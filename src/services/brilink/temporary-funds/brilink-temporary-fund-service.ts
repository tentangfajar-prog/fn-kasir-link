import type { BrilinkFundAccount, Prisma, StockDirection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { createDanaLuarSchema, createInjectionSchema, returnDanaLuarSchema, returnInjectionSchema } from "@/lib/validations/brilink/temporary-funds";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

function money(value: number) {
  return BigInt(value);
}

function day(input?: string) {
  return input ? new Date(input) : new Date();
}

export class BrilinkTemporaryFundService {
  async createDanaLuar(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = createDanaLuarSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const amount = money(payload.nominal_amount);
      await this.ensureBalance(tx, payload.source_account, amount);
      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "DANA_LUAR", "BDL-");
      const operationalDate = day(payload.operational_date);
      const danaLuar = await tx.brilinkDanaLuar.create({
        data: {
          documentNo,
          operationalDate,
          borrowerName: payload.borrower_name,
          sourceAccount: payload.source_account,
          principalAmount: amount,
          remainingAmount: amount,
          note: payload.notes,
          createdBy: ctx.user.id,
        },
      });
      await this.createLedger(tx, payload.source_account, "OUT", amount, "brilink_dana_luar", danaLuar.id, documentNo, operationalDate, ctx.user.id, payload.notes ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.temporary_fund", action: "dana_luar.create", entityType: "brilink_dana_luar", entityId: danaLuar.id, entityNo: documentNo, newValue: { borrower_name: payload.borrower_name, amount: amount.toString(), source_account: payload.source_account } });
      return danaLuar;
    });
  }

  async returnDanaLuar(ctx: AuthContext, danaLuarId: string, input: unknown) {
    this.requireManage(ctx);
    const payload = returnDanaLuarSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const danaLuar = await tx.brilinkDanaLuar.findUniqueOrThrow({ where: { id: danaLuarId } });
      if (danaLuar.status === "RETURNED" || danaLuar.status === "CANCELLED") throw new AppError("TEMPORARY_FUND_NOT_RETURNABLE", "Dana di luar tidak bisa dikembalikan.");
      const amount = money(payload.return_amount);
      if (amount > danaLuar.remainingAmount) throw new AppError("RETURN_EXCEEDS_REMAINING", "Pengembalian melebihi sisa dana di luar.");
      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "DANA_LUAR_RETURN", "BDR-");
      const operationalDate = day(payload.operational_date);
      const returned = await tx.brilinkDanaLuarReturn.create({
        data: { danaLuarId, documentNo, operationalDate, returnToAccount: payload.return_to_account, amount, note: payload.notes, createdBy: ctx.user.id },
      });
      const returnedAmount = danaLuar.returnedAmount + amount;
      const remainingAmount = danaLuar.remainingAmount - amount;
      await tx.brilinkDanaLuar.update({ where: { id: danaLuarId }, data: { returnedAmount, remainingAmount, status: remainingAmount === BigInt(0) ? "RETURNED" : "PARTIAL" } });
      await this.createLedger(tx, payload.return_to_account, "IN", amount, "brilink_dana_luar_return", returned.id, documentNo, operationalDate, ctx.user.id, payload.notes ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.temporary_fund", action: "dana_luar.return", entityType: "brilink_dana_luar_return", entityId: returned.id, entityNo: documentNo, newValue: { amount: amount.toString(), dana_luar_id: danaLuarId, return_to_account: payload.return_to_account } });
      return returned;
    });
  }

  async createInjection(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = createInjectionSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const amount = money(payload.nominal_amount);
      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "INJECTION", "BIN-");
      const operationalDate = day(payload.operational_date);
      const injection = await tx.brilinkInjection.create({
        data: {
          documentNo,
          operationalDate,
          fundProviderName: payload.fund_provider_name,
          targetAccount: payload.target_account,
          principalAmount: amount,
          remainingAmount: amount,
          note: payload.notes,
          createdBy: ctx.user.id,
        },
      });
      await this.createLedger(tx, payload.target_account, "IN", amount, "brilink_injection", injection.id, documentNo, operationalDate, ctx.user.id, payload.notes ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.temporary_fund", action: "injection.create", entityType: "brilink_injection", entityId: injection.id, entityNo: documentNo, newValue: { provider_name: payload.fund_provider_name, amount: amount.toString(), target_account: payload.target_account } });
      return injection;
    });
  }

  async returnInjection(ctx: AuthContext, injectionId: string, input: unknown) {
    this.requireManage(ctx);
    const payload = returnInjectionSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const injection = await tx.brilinkInjection.findUniqueOrThrow({ where: { id: injectionId } });
      if (injection.status === "RETURNED" || injection.status === "CANCELLED") throw new AppError("INJECTION_NOT_RETURNABLE", "Injeksi tidak bisa dikembalikan.");
      const amount = money(payload.return_amount);
      if (amount > injection.remainingAmount) throw new AppError("RETURN_EXCEEDS_REMAINING", "Pengembalian melebihi sisa injeksi.");
      await this.ensureBalance(tx, payload.return_from_account, amount);
      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "INJECTION_RETURN", "BIR-");
      const operationalDate = day(payload.operational_date);
      const returned = await tx.brilinkInjectionReturn.create({
        data: { injectionId, documentNo, operationalDate, returnFromAccount: payload.return_from_account, amount, note: payload.notes, createdBy: ctx.user.id },
      });
      const returnedAmount = injection.returnedAmount + amount;
      const remainingAmount = injection.remainingAmount - amount;
      await tx.brilinkInjection.update({ where: { id: injectionId }, data: { returnedAmount, remainingAmount, status: remainingAmount === BigInt(0) ? "RETURNED" : "PARTIAL" } });
      await this.createLedger(tx, payload.return_from_account, "OUT", amount, "brilink_injection_return", returned.id, documentNo, operationalDate, ctx.user.id, payload.notes ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.temporary_fund", action: "injection.return", entityType: "brilink_injection_return", entityId: returned.id, entityNo: documentNo, newValue: { amount: amount.toString(), injection_id: injectionId, return_from_account: payload.return_from_account } });
      return returned;
    });
  }

  private async createLedger(tx: Tx, account: BrilinkFundAccount, direction: StockDirection, amount: bigint, sourceType: string, sourceId: string, documentNo: string, operationalDate: Date, createdBy: string, note?: string) {
    const data = { direction, amount, sourceType, sourceId, documentNo, operationalDate, createdBy, note };
    if (account === "CASH") return tx.brilinkCashLedger.create({ data });
    return tx.brilinkSaldoLedger.create({ data });
  }

  private async ensureBalance(tx: Tx, account: BrilinkFundAccount, required: bigint) {
    const ledgers = account === "CASH"
      ? await tx.brilinkCashLedger.findMany({ select: { direction: true, amount: true } })
      : await tx.brilinkSaldoLedger.findMany({ select: { direction: true, amount: true } });
    const balance = ledgers.reduce((total: bigint, ledger: { direction: StockDirection; amount: bigint }) => total + (ledger.direction === "IN" ? ledger.amount : -ledger.amount), BigInt(0));
    if (balance < required) throw new AppError("INSUFFICIENT_BALANCE", "Saldo BRILink tidak cukup.");
  }

  private requireManage(ctx: AuthContext) {
    permissionService.require(ctx, "brilink.temporary_fund.manage");
    permissionService.requireDomain(ctx, "BRILINK");
  }
}

export const brilinkTemporaryFundService = new BrilinkTemporaryFundService();
