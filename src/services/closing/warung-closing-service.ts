import type { Prisma, WarungCashAccount } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { closingFilterSchema, createWarungClosingSchema } from "@/lib/validations/closing";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

function date(input?: string) {
  return input ? new Date(input) : new Date();
}

function money(value: number) {
  return BigInt(value);
}

export class WarungClosingService {
  async previewClosing(ctx: AuthContext, input: unknown = {}) {
    this.requireClosing(ctx);
    const payload = closingFilterSchema.parse(input);
    const operationalDate = date(payload.operational_date);
    const systemCashLaciAmount = await this.cashBalance(prisma, "KAS_LACI");
    return {
      operational_date: operationalDate,
      system_cash_laci_amount: systemCashLaciAmount.toString(),
      existing_closing: await prisma.warungClosing.findFirst({ where: { operationalDate, status: "POSTED" } }),
    };
  }

  async createClosing(ctx: AuthContext, input: unknown) {
    this.requireClosing(ctx);
    const payload = createWarungClosingSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const operationalDate = date(payload.operational_date);
      const systemCash = await this.cashBalance(tx, "KAS_LACI");
      const actualCash = money(payload.actual_cash_laci_amount);
      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "CLOSING", "WCL-");
      const closing = await tx.warungClosing.create({
        data: { documentNo, operationalDate, systemCashLaciAmount: systemCash, actualCashLaciAmount: actualCash, differenceAmount: actualCash - systemCash, setoranAmanAmount: actualCash, note: payload.note, createdBy: ctx.user.id },
      });
      if (actualCash > BigInt(0)) {
        await tx.warungCashLedger.create({ data: { account: "KAS_LACI", direction: "OUT", amount: actualCash, sourceType: "warung_closing", sourceId: closing.id, documentNo, operationalDate, createdBy: ctx.user.id, note: "Setoran closing ke Kas Aman" } });
        await tx.warungCashLedger.create({ data: { account: "KAS_AMAN", direction: "IN", amount: actualCash, sourceType: "warung_closing", sourceId: closing.id, documentNo, operationalDate, createdBy: ctx.user.id, note: "Setoran closing dari Kas Laci" } });
      }
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.closing", action: "closing.create", entityType: "warung_closing", entityId: closing.id, entityNo: documentNo, newValue: { system_cash: systemCash.toString(), actual_cash: actualCash.toString(), difference: (actualCash - systemCash).toString() } });
      return closing;
    });
  }

  async printClosing(ctx: AuthContext, closingId: string) {
    this.requireClosing(ctx);
    return prisma.warungClosing.findUniqueOrThrow({ where: { id: closingId } });
  }

  private async cashBalance(db: Tx | typeof prisma, account: WarungCashAccount) {
    const ledgers = await db.warungCashLedger.findMany({ where: { account }, select: { direction: true, amount: true } });
    return ledgers.reduce((total, ledger) => total + (ledger.direction === "IN" ? ledger.amount : -ledger.amount), BigInt(0));
  }

  private requireClosing(ctx: AuthContext) {
    permissionService.require(ctx, "warung.closing.create");
    permissionService.requireDomain(ctx, "WARUNG");
  }
}

export const warungClosingService = new WarungClosingService();
