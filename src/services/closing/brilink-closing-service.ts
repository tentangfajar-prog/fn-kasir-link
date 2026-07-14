import type { Prisma, StockDirection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { closingFilterSchema, createBrilinkClosingSchema } from "@/lib/validations/closing";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;
type Ledger = { direction: StockDirection; amount: bigint };

function date(input?: string) {
  return input ? new Date(input) : new Date();
}

function money(value: number) {
  return BigInt(value);
}

export class BrilinkClosingService {
  async previewClosing(ctx: AuthContext, input: unknown = {}) {
    this.requireClosing(ctx);
    const payload = closingFilterSchema.parse(input);
    const operationalDate = date(payload.operational_date);
    const [cash, saldo, fee, danaLuar, injections] = await Promise.all([
      this.cashBalance(prisma),
      this.saldoBalance(prisma),
      this.feeBalance(prisma),
      this.activeDanaLuar(),
      this.activeInjections(),
    ]);
    return { operational_date: operationalDate, system_cash_amount: cash.toString(), system_saldo_amount: saldo.toString(), fee_amount: fee.toString(), dana_luar_amount: danaLuar.toString(), injection_amount: injections.toString(), existing_closing: await prisma.brilinkClosing.findFirst({ where: { operationalDate, status: "POSTED" } }) };
  }

  async createClosing(ctx: AuthContext, input: unknown) {
    this.requireClosing(ctx);
    const payload = createBrilinkClosingSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const operationalDate = date(payload.operational_date);
      const [cash, saldo, fee, danaLuar, injections] = await Promise.all([
        this.cashBalance(tx),
        this.saldoBalance(tx),
        this.feeBalance(tx),
        this.activeDanaLuar(tx),
        this.activeInjections(tx),
      ]);
      const actualCash = money(payload.actual_cash_amount);
      const actualSaldo = money(payload.actual_saldo_amount);
      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "CLOSING", "BCL-");
      const closing = await tx.brilinkClosing.create({
        data: { documentNo, operationalDate, systemCashAmount: cash, actualCashAmount: actualCash, cashDifferenceAmount: actualCash - cash, systemSaldoAmount: saldo, actualSaldoAmount: actualSaldo, saldoDifferenceAmount: actualSaldo - saldo, feeAmount: fee, danaLuarAmount: danaLuar, injectionAmount: injections, note: payload.note, createdBy: ctx.user.id },
      });
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.closing", action: "closing.create", entityType: "brilink_closing", entityId: closing.id, entityNo: documentNo, newValue: { cash_diff: (actualCash - cash).toString(), saldo_diff: (actualSaldo - saldo).toString() } });
      return closing;
    });
  }

  async printClosing(ctx: AuthContext, closingId: string) {
    this.requireClosing(ctx);
    return prisma.brilinkClosing.findUniqueOrThrow({ where: { id: closingId } });
  }

  private async cashBalance(db: Tx | typeof prisma) {
    const rows = await db.brilinkCashLedger.findMany({ select: { direction: true, amount: true } });
    return this.ledgerSum(rows);
  }

  private async saldoBalance(db: Tx | typeof prisma) {
    const rows = await db.brilinkSaldoLedger.findMany({ select: { direction: true, amount: true } });
    return this.ledgerSum(rows);
  }

  private async feeBalance(db: Tx | typeof prisma) {
    const rows = await db.brilinkFeeLedger.findMany({ select: { direction: true, amount: true } });
    return this.ledgerSum(rows);
  }

  private async activeDanaLuar(db: Tx | typeof prisma = prisma) {
    const rows = await db.brilinkDanaLuar.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } });
    return rows.reduce((total, row) => total + row.remainingAmount, BigInt(0));
  }

  private async activeInjections(db: Tx | typeof prisma = prisma) {
    const rows = await db.brilinkInjection.findMany({ where: { status: { in: ["ACTIVE", "PARTIAL"] } }, select: { remainingAmount: true } });
    return rows.reduce((total, row) => total + row.remainingAmount, BigInt(0));
  }

  private ledgerSum(rows: Ledger[]) {
    return rows.reduce((total, row) => total + (row.direction === "IN" ? row.amount : -row.amount), BigInt(0));
  }

  private requireClosing(ctx: AuthContext) {
    permissionService.require(ctx, "brilink.closing.create");
    permissionService.requireDomain(ctx, "BRILINK");
  }
}

export const brilinkClosingService = new BrilinkClosingService();
