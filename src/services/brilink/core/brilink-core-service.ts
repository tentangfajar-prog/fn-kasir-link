import type { BrilinkAmountFormula, Prisma, StockDirection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import {
  brilinkTransactionInputSchema,
  createBrilinkTariffGroupSchema,
  createBrilinkTariffRangeSchema,
  createBrilinkTemplateSchema,
  createBrilinkTransactionTypeSchema,
} from "@/lib/validations/brilink/core";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;
type Movement = {
  feeAmount: bigint;
  cashInAmount: bigint;
  cashOutAmount: bigint;
  saldoInAmount: bigint;
  saldoOutAmount: bigint;
};

function money(value: number) {
  return BigInt(value);
}

function day(input?: string) {
  return input ? new Date(input) : new Date();
}

export class BrilinkCoreService {
  async createTemplate(ctx: AuthContext, input: unknown) {
    this.requireTariffManage(ctx);
    const payload = createBrilinkTemplateSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const template = await tx.brilinkCashSaldoTemplate.create({
        data: {
          code: payload.code,
          name: payload.name,
          cashDirection: payload.cash_direction,
          cashAmountFormula: payload.cash_amount_formula,
          saldoDirection: payload.saldo_direction,
          saldoAmountFormula: payload.saldo_amount_formula,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.tariff", action: "template.create", entityType: "brilink_cash_saldo_template", entityId: template.id, newValue: template });
      return template;
    });
  }

  async createTransactionType(ctx: AuthContext, input: unknown) {
    this.requireTariffManage(ctx);
    const payload = createBrilinkTransactionTypeSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const template = await tx.brilinkCashSaldoTemplate.findUniqueOrThrow({ where: { id: payload.template_id } });
      if (!template.isActive) throw new AppError("TEMPLATE_INACTIVE", "Template BRILink tidak aktif.");
      const type = await tx.brilinkTransactionType.create({
        data: { code: payload.code, name: payload.name, templateId: template.id, sortOrder: payload.sort_order },
      });
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.tariff", action: "transaction_type.create", entityType: "brilink_transaction_type", entityId: type.id, newValue: type });
      return type;
    });
  }

  async createTariffGroup(ctx: AuthContext, input: unknown) {
    this.requireTariffManage(ctx);
    const payload = createBrilinkTariffGroupSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const type = await tx.brilinkTransactionType.findUniqueOrThrow({ where: { id: payload.transaction_type_id } });
      if (!type.isActive || type.deletedAt) throw new AppError("TRANSACTION_TYPE_INACTIVE", "Jenis transaksi tidak aktif.");
      const group = await tx.brilinkTariffGroup.create({
        data: { transactionTypeId: type.id, name: payload.name, bankCategory: payload.bank_category },
      });
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.tariff", action: "tariff_group.create", entityType: "brilink_tariff_group", entityId: group.id, newValue: group });
      return group;
    });
  }

  async createTariffRange(ctx: AuthContext, input: unknown) {
    this.requireTariffManage(ctx);
    const payload = createBrilinkTariffRangeSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      await this.validateNoOverlap(tx, payload.tariff_group_id, money(payload.min_amount), payload.max_amount == null ? null : money(payload.max_amount));
      const range = await tx.brilinkTariffRange.create({
        data: { tariffGroupId: payload.tariff_group_id, minAmount: money(payload.min_amount), maxAmount: payload.max_amount == null ? null : money(payload.max_amount), feeAmount: money(payload.fee_amount) },
      });
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.tariff", action: "tariff_range.create", entityType: "brilink_tariff_range", entityId: range.id, newValue: { ...range, minAmount: range.minAmount.toString(), maxAmount: range.maxAmount?.toString(), feeAmount: range.feeAmount.toString() } });
      return range;
    });
  }

  async getNewTransactionContext(ctx: AuthContext) {
    permissionService.require(ctx, "brilink.transaction.create");
    permissionService.requireDomain(ctx, "BRILINK");
    const [types, cashBalance, saldoBalance] = await Promise.all([
      prisma.brilinkTransactionType.findMany({ where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: "asc" } }),
      this.balance(prisma, "brilinkCashLedger"),
      this.balance(prisma, "brilinkSaldoLedger"),
    ]);
    return { transaction_types: types, cash_balance: cashBalance.toString(), saldo_balance: saldoBalance.toString() };
  }

  async preview(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "brilink.transaction.create");
    permissionService.requireDomain(ctx, "BRILINK");
    const payload = brilinkTransactionInputSchema.parse(input);
    const loaded = await this.loadTransactionSetup(prisma, payload.transaction_type_id, payload.bank_category ?? null, money(payload.nominal_amount));
    const movement = this.calculateMovement(loaded.template, money(payload.nominal_amount), loaded.tariff.feeAmount);
    return this.serializeMovement(movement);
  }

  async create(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "brilink.transaction.create");
    permissionService.requireDomain(ctx, "BRILINK");
    const payload = brilinkTransactionInputSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const nominal = money(payload.nominal_amount);
      const loaded = await this.loadTransactionSetup(tx, payload.transaction_type_id, payload.bank_category ?? null, nominal);
      const movement = this.calculateMovement(loaded.template, nominal, loaded.tariff.feeAmount);
      await this.ensureBalance(tx, "brilinkCashLedger", movement.cashOutAmount);
      await this.ensureBalance(tx, "brilinkSaldoLedger", movement.saldoOutAmount);

      const documentNo = await new DocumentSequenceService(tx).nextNumber("BRILINK", "TRX", "BRI-");
      const operationalDate = day(payload.operational_date);
      const transaction = await tx.brilinkTransaction.create({
        data: {
          documentNo,
          operationalDate,
          transactionTypeId: loaded.type.id,
          transactionTypeNameSnapshot: loaded.type.name,
          templateCodeSnapshot: loaded.template.code,
          bankCategory: payload.bank_category,
          nominalAmount: nominal,
          feeAmount: movement.feeAmount,
          cashInAmount: movement.cashInAmount,
          cashOutAmount: movement.cashOutAmount,
          saldoInAmount: movement.saldoInAmount,
          saldoOutAmount: movement.saldoOutAmount,
          referenceNo: payload.reference_no,
          targetAccountNo: payload.target_account_no,
          targetPhoneNo: payload.target_phone_no,
          targetName: payload.target_name,
          providerName: payload.provider_name,
          customerName: payload.customer_name,
          note: payload.note,
          createdBy: ctx.user.id,
        },
      });

      await this.createLedgers(tx, transaction.id, documentNo, operationalDate, movement, ctx.user.id, payload.note ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "BRILINK", module: "brilink.transaction", action: "transaction.create", entityType: "brilink_transaction", entityId: transaction.id, entityNo: documentNo, newValue: { nominal: nominal.toString(), fee: movement.feeAmount.toString(), type: loaded.type.name } });
      return transaction;
    });
  }

  private async loadTransactionSetup(db: Tx | typeof prisma, transactionTypeId: string, bankCategory: string | null, nominal: bigint) {
    const type = await db.brilinkTransactionType.findUniqueOrThrow({ where: { id: transactionTypeId }, include: { template: true, tariffGroups: { include: { ranges: true } } } });
    if (!type.isActive || type.deletedAt) throw new AppError("TRANSACTION_TYPE_INACTIVE", "Jenis transaksi tidak aktif.");
    const group = type.tariffGroups.find((item) => item.isActive && (item.bankCategory ?? null) === bankCategory) ?? type.tariffGroups.find((item) => item.isActive && item.bankCategory == null) ?? type.tariffGroups.find((item) => item.isActive && item.bankCategory === "DEFAULT");
    if (!group) throw new AppError("TARIFF_NOT_FOUND", "Grup tarif tidak ditemukan.");
    const tariff = group.ranges.find((range) => range.isActive && range.minAmount <= nominal && (range.maxAmount == null || range.maxAmount >= nominal));
    if (!tariff) throw new AppError("TARIFF_NOT_FOUND", "Tarif tidak ditemukan.");
    return { type, template: type.template, tariff };
  }

  private calculateMovement(template: { cashDirection: StockDirection | null; cashAmountFormula: BrilinkAmountFormula; saldoDirection: StockDirection | null; saldoAmountFormula: BrilinkAmountFormula }, nominal: bigint, fee: bigint): Movement {
    const cashAmount = this.formulaAmount(template.cashAmountFormula, nominal, fee);
    const saldoAmount = this.formulaAmount(template.saldoAmountFormula, nominal, fee);
    return {
      feeAmount: fee,
      cashInAmount: template.cashDirection === "IN" ? cashAmount : BigInt(0),
      cashOutAmount: template.cashDirection === "OUT" ? cashAmount : BigInt(0),
      saldoInAmount: template.saldoDirection === "IN" ? saldoAmount : BigInt(0),
      saldoOutAmount: template.saldoDirection === "OUT" ? saldoAmount : BigInt(0),
    };
  }

  private formulaAmount(formula: BrilinkAmountFormula, nominal: bigint, fee: bigint) {
    if (formula === "NOMINAL") return nominal;
    if (formula === "FEE") return fee;
    if (formula === "NOMINAL_PLUS_FEE") return nominal + fee;
    return BigInt(0);
  }

  private async createLedgers(tx: Tx, transactionId: string, documentNo: string, operationalDate: Date, movement: Movement, createdBy: string, note?: string) {
    if (movement.cashInAmount > BigInt(0)) await tx.brilinkCashLedger.create({ data: { transactionId, direction: "IN", amount: movement.cashInAmount, sourceType: "brilink_transaction", sourceId: transactionId, documentNo, operationalDate, createdBy, note } });
    if (movement.cashOutAmount > BigInt(0)) await tx.brilinkCashLedger.create({ data: { transactionId, direction: "OUT", amount: movement.cashOutAmount, sourceType: "brilink_transaction", sourceId: transactionId, documentNo, operationalDate, createdBy, note } });
    if (movement.saldoInAmount > BigInt(0)) await tx.brilinkSaldoLedger.create({ data: { transactionId, direction: "IN", amount: movement.saldoInAmount, sourceType: "brilink_transaction", sourceId: transactionId, documentNo, operationalDate, createdBy, note } });
    if (movement.saldoOutAmount > BigInt(0)) await tx.brilinkSaldoLedger.create({ data: { transactionId, direction: "OUT", amount: movement.saldoOutAmount, sourceType: "brilink_transaction", sourceId: transactionId, documentNo, operationalDate, createdBy, note } });
    if (movement.feeAmount > BigInt(0)) await tx.brilinkFeeLedger.create({ data: { transactionId, direction: "IN", amount: movement.feeAmount, sourceType: "brilink_transaction", sourceId: transactionId, documentNo, operationalDate, createdBy, note } });
  }

  private async validateNoOverlap(tx: Tx, tariffGroupId: string, minAmount: bigint, maxAmount: bigint | null) {
    const ranges = await tx.brilinkTariffRange.findMany({ where: { tariffGroupId, isActive: true } });
    const end = maxAmount ?? BigInt("999999999999999999");
    const overlaps = ranges.some((range) => {
      const rangeEnd = range.maxAmount ?? BigInt("999999999999999999");
      return minAmount <= rangeEnd && end >= range.minAmount;
    });
    if (overlaps) throw new AppError("TARIFF_RANGE_OVERLAP", "Range tarif tumpang tindih.");
  }

  private async ensureBalance(tx: Tx, table: "brilinkCashLedger" | "brilinkSaldoLedger", required: bigint) {
    if (required === BigInt(0)) return;
    const balance = await this.balance(tx, table);
    if (balance < required) throw new AppError("INSUFFICIENT_BALANCE", "Saldo BRILink tidak cukup.");
  }

  private async balance(db: Tx | typeof prisma, table: "brilinkCashLedger" | "brilinkSaldoLedger") {
    const ledgers = table === "brilinkCashLedger"
      ? await db.brilinkCashLedger.findMany({ select: { direction: true, amount: true } })
      : await db.brilinkSaldoLedger.findMany({ select: { direction: true, amount: true } });
    return ledgers.reduce((total: bigint, ledger: { direction: StockDirection; amount: bigint }) => total + (ledger.direction === "IN" ? ledger.amount : -ledger.amount), BigInt(0));
  }

  private serializeMovement(movement: Movement) {
    return {
      fee_amount: movement.feeAmount.toString(),
      cash_in_amount: movement.cashInAmount.toString(),
      cash_out_amount: movement.cashOutAmount.toString(),
      saldo_in_amount: movement.saldoInAmount.toString(),
      saldo_out_amount: movement.saldoOutAmount.toString(),
    };
  }

  private requireTariffManage(ctx: AuthContext) {
    permissionService.require(ctx, "brilink.tariff.manage");
    permissionService.requireDomain(ctx, "BRILINK");
  }
}

export const brilinkCoreService = new BrilinkCoreService();
