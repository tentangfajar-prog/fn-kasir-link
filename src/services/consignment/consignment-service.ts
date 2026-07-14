import type { Domain, Prisma, WarungCashAccount } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { consignmentEntrySchema, consignmentPaymentSchema, consignmentReturnSchema } from "@/lib/validations/consignment";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

type CashSource = WarungCashAccount | "CASH";

function date(input?: string) {
  return input ? new Date(input) : new Date();
}

function decimal(value: string | number | Decimal) {
  return new Decimal(value);
}

export class ConsignmentService {
  async createEntry(ctx: AuthContext, domain: "WARUNG" | "BRILINK", input: unknown) {
    this.requireManage(ctx, domain);
    const payload = consignmentEntrySchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findUniqueOrThrow({ where: { id: payload.partner_id } });
      if (partner.status !== "ACTIVE" || partner.deletedAt || (partner.partnerType !== "CONSIGNMENT" && partner.partnerType !== "BOTH")) throw new AppError("CONSIGNMENT_PARTNER_REQUIRED", "Partner harus konsinyasi aktif.");
      const qtyReceived = this.positiveQty(payload.qty_received);
      const documentNo = await new DocumentSequenceService(tx).nextNumber(domain, "CONSIGNMENT", domain === "WARUNG" ? "WCO-" : "BCO-");
      const entry = await tx.consignmentEntry.create({
        data: { domain, documentNo, operationalDate: date(payload.operational_date), partnerId: partner.id, partnerNameSnapshot: partner.name, itemName: payload.item_name, qtyReceived, unitCostAmount: BigInt(payload.unit_cost_amount), note: payload.note, createdBy: ctx.user.id },
      });
      await new AuditService(tx).write({ ctx, domain, module: `${domain.toLowerCase()}.consignment`, action: "consignment.entry.create", entityType: "consignment_entry", entityId: entry.id, entityNo: documentNo, newValue: { item_name: payload.item_name, qty: qtyReceived.toString() } });
      return entry;
    });
  }

  async recordSale(ctx: AuthContext, domain: "WARUNG" | "BRILINK", entryId: string, qtySoldInput: unknown) {
    this.requireManage(ctx, domain);
    const qtySold = this.positiveQty(typeof qtySoldInput === "object" && qtySoldInput && "qty_sold" in qtySoldInput ? String((qtySoldInput as { qty_sold: unknown }).qty_sold) : String(qtySoldInput));
    return prisma.$transaction(async (tx) => {
      const entry = await this.entry(tx, domain, entryId);
      const available = entry.qtyReceived.minus(entry.qtySold).minus(entry.qtyReturned);
      if (qtySold.greaterThan(available)) throw new AppError("CONSIGNMENT_STOCK_NOT_ENOUGH", "Stok konsinyasi tidak cukup.");
      const updated = await tx.consignmentEntry.update({ where: { id: entryId }, data: { qtySold: entry.qtySold.plus(qtySold) } });
      await new AuditService(tx).write({ ctx, domain, module: `${domain.toLowerCase()}.consignment`, action: "consignment.sale.record", entityType: "consignment_entry", entityId: entryId, oldValue: { qtySold: entry.qtySold.toString() }, newValue: { qtySold: updated.qtySold.toString() } });
      return updated;
    });
  }

  async payConsignor(ctx: AuthContext, domain: "WARUNG" | "BRILINK", entryId: string, input: unknown) {
    this.requireManage(ctx, domain);
    const payload = consignmentPaymentSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const entry = await this.entry(tx, domain, entryId);
      const qtyPaid = this.positiveQty(payload.qty_paid);
      const unpaidSold = entry.qtySold.minus(entry.qtyPaid);
      if (qtyPaid.greaterThan(unpaidSold)) throw new AppError("PAY_QTY_EXCEEDS_UNPAID", "Qty bayar melebihi qty terjual belum dibayar.");
      const amount = BigInt(qtyPaid.mul(entry.unitCostAmount.toString()).floor().toFixed(0));
      const documentNo = await new DocumentSequenceService(tx).nextNumber(domain, "CONSIGNMENT_PAYMENT", domain === "WARUNG" ? "WCP-" : "BCP-");
      await this.ensureCash(tx, domain, payload.cash_source, amount);
      const payment = await tx.consignmentPayment.create({ data: { entryId, documentNo, operationalDate: date(payload.operational_date), qtyPaid, amount, note: payload.note, createdBy: ctx.user.id } });
      await tx.consignmentEntry.update({ where: { id: entryId }, data: { qtyPaid: entry.qtyPaid.plus(qtyPaid), status: entry.qtyPaid.plus(qtyPaid).equals(entry.qtySold) && entry.qtyReturned.plus(entry.qtySold).equals(entry.qtyReceived) ? "SETTLED" : "ACTIVE" } });
      await this.cashOut(tx, domain, payload.cash_source, amount, payment.id, documentNo, payment.operationalDate, ctx.user.id, payload.note ?? undefined);
      await new AuditService(tx).write({ ctx, domain, module: `${domain.toLowerCase()}.consignment`, action: "consignment.payment.create", entityType: "consignment_payment", entityId: payment.id, entityNo: documentNo, newValue: { amount: amount.toString(), qty: qtyPaid.toString() } });
      return payment;
    });
  }

  async returnUnsold(ctx: AuthContext, domain: "WARUNG" | "BRILINK", entryId: string, input: unknown) {
    this.requireManage(ctx, domain);
    const payload = consignmentReturnSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const entry = await this.entry(tx, domain, entryId);
      const qtyReturned = this.positiveQty(payload.qty_returned);
      const unsold = entry.qtyReceived.minus(entry.qtySold).minus(entry.qtyReturned);
      if (qtyReturned.greaterThan(unsold)) throw new AppError("CANNOT_RETURN_SOLD_ITEM", "Qty retur melebihi stok belum terjual.");
      const documentNo = await new DocumentSequenceService(tx).nextNumber(domain, "CONSIGNMENT_RETURN", domain === "WARUNG" ? "WCR-" : "BCR-");
      const returned = await tx.consignmentReturn.create({ data: { entryId, documentNo, operationalDate: date(payload.operational_date), qtyReturned, note: payload.note, createdBy: ctx.user.id } });
      const newReturned = entry.qtyReturned.plus(qtyReturned);
      await tx.consignmentEntry.update({ where: { id: entryId }, data: { qtyReturned: newReturned, status: newReturned.plus(entry.qtySold).equals(entry.qtyReceived) && entry.qtyPaid.equals(entry.qtySold) ? "SETTLED" : "ACTIVE" } });
      await new AuditService(tx).write({ ctx, domain, module: `${domain.toLowerCase()}.consignment`, action: "consignment.return.create", entityType: "consignment_return", entityId: returned.id, entityNo: documentNo, newValue: { qty: qtyReturned.toString() } });
      return returned;
    });
  }

  private async entry(tx: Tx, domain: Domain, entryId: string) {
    const entry = await tx.consignmentEntry.findUniqueOrThrow({ where: { id: entryId } });
    if (entry.domain !== domain || entry.status === "CANCELLED") throw new AppError("CONSIGNMENT_INVALID", "Konsinyasi tidak valid.");
    return entry;
  }

  private positiveQty(value: string) {
    const result = decimal(value);
    if (result.lessThanOrEqualTo(0)) throw new AppError("INVALID_QTY", "Qty harus lebih dari 0.");
    return result;
  }

  private async ensureCash(tx: Tx, domain: Domain, cashSource: CashSource | undefined, amount: bigint) {
    if (domain === "WARUNG") {
      if (cashSource !== "KAS_LACI" && cashSource !== "KAS_AMAN") throw new AppError("CASH_SOURCE_REQUIRED", "Sumber kas Warung wajib.");
      const rows = await tx.warungCashLedger.findMany({ where: { account: cashSource }, select: { direction: true, amount: true } });
      if (this.balance(rows) < amount) throw new AppError("CASH_SOURCE_NOT_ENOUGH", "Kas tidak cukup.");
      return;
    }
    const rows = await tx.brilinkCashLedger.findMany({ select: { direction: true, amount: true } });
    if (this.balance(rows) < amount) throw new AppError("CASH_SOURCE_NOT_ENOUGH", "Cash BRILink tidak cukup.");
  }

  private async cashOut(tx: Tx, domain: Domain, cashSource: CashSource | undefined, amount: bigint, sourceId: string, documentNo: string, operationalDate: Date, createdBy: string, note?: string) {
    if (domain === "WARUNG") return tx.warungCashLedger.create({ data: { account: cashSource as WarungCashAccount, direction: "OUT", amount, sourceType: "consignment_payment", sourceId, documentNo, operationalDate, createdBy, note } });
    return tx.brilinkCashLedger.create({ data: { direction: "OUT", amount, sourceType: "consignment_payment", sourceId, documentNo, operationalDate, createdBy, note } });
  }

  private balance(rows: { direction: "IN" | "OUT"; amount: bigint }[]) {
    return rows.reduce((total, row) => total + (row.direction === "IN" ? row.amount : -row.amount), BigInt(0));
  }

  private requireManage(ctx: AuthContext, domain: "WARUNG" | "BRILINK") {
    const permission = domain === "WARUNG" ? "warung.consignment.manage" : "brilink.consignment.manage";
    permissionService.require(ctx, permission);
    permissionService.requireDomain(ctx, domain);
  }
}

export const consignmentService = new ConsignmentService();
