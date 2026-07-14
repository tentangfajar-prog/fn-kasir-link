import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { createCashTransferSchema, createExpenseSchema, dailySummarySchema, expenseCategorySchema } from "@/lib/validations/warung/finance";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

function asMoney(value: number) {
  return BigInt(value);
}

function day(input?: string) {
  return input ? new Date(input) : new Date();
}

export class WarungFinanceService {
  async createExpenseCategory(ctx: AuthContext, input: unknown) {
    this.requireFinanceMutation(ctx, "warung.expense.create");
    const payload = expenseCategorySchema.parse(input);
    const category = await prisma.warungExpenseCategory.create({
      data: { name: payload.name, code: payload.code, sortOrder: payload.sort_order },
    });
    await new AuditService().write({ ctx, domain: "WARUNG", module: "warung.finance", action: "expense_category.create", entityType: "warung_expense_category", entityId: category.id, newValue: category });
    return category;
  }

  async createExpense(ctx: AuthContext, input: unknown) {
    this.requireFinanceMutation(ctx, "warung.expense.create");
    const payload = createExpenseSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const category = await tx.warungExpenseCategory.findUniqueOrThrow({ where: { id: payload.category_id } });
      if (!category.isActive || category.deletedAt) throw new AppError("EXPENSE_CATEGORY_INACTIVE", "Kategori pengeluaran tidak aktif.");

      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "EXPENSE", "WEX-");
      const amount = asMoney(payload.amount);
      const operationalDate = day(payload.operational_date);
      const expense = await tx.warungExpense.create({
        data: {
          documentNo,
          operationalDate,
          account: payload.account,
          categoryId: category.id,
          categoryNameSnapshot: category.name,
          description: payload.description,
          amount,
          note: payload.note,
          createdBy: ctx.user.id,
        },
      });

      await this.createCashLedger(tx, payload.account, "OUT", amount, "warung_expense", expense.id, documentNo, operationalDate, ctx.user.id, payload.description);
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.finance", action: "expense.create", entityType: "warung_expense", entityId: expense.id, entityNo: documentNo, newValue: { amount: amount.toString(), account: payload.account, category: category.name } });
      return expense;
    });
  }

  async transferCash(ctx: AuthContext, input: unknown) {
    this.requireFinanceMutation(ctx, "warung.cash.transfer");
    const payload = createCashTransferSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "CASH_TRANSFER", "WCT-");
      const amount = asMoney(payload.amount);
      const operationalDate = day(payload.operational_date);
      const transfer = await tx.warungCashTransfer.create({
        data: {
          documentNo,
          operationalDate,
          fromAccount: payload.from_account,
          toAccount: payload.to_account,
          amount,
          note: payload.note,
          createdBy: ctx.user.id,
        },
      });

      await this.createCashLedger(tx, payload.from_account, "OUT", amount, "warung_cash_transfer", transfer.id, documentNo, operationalDate, ctx.user.id, payload.note);
      await this.createCashLedger(tx, payload.to_account, "IN", amount, "warung_cash_transfer", transfer.id, documentNo, operationalDate, ctx.user.id, payload.note);
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.finance", action: "cash_transfer.create", entityType: "warung_cash_transfer", entityId: transfer.id, entityNo: documentNo, newValue: { amount: amount.toString(), from: payload.from_account, to: payload.to_account } });
      return transfer;
    });
  }

  async dailySummary(ctx: AuthContext, input: unknown = {}) {
    permissionService.require(ctx, "warung.finance.view");
    permissionService.requireDomain(ctx, "WARUNG");
    const payload = dailySummarySchema.parse(input);
    const operationalDate = day(payload.operational_date);

    const [cashLedgers, nonCashLedgers, sales, expenses] = await Promise.all([
      prisma.warungCashLedger.findMany({ where: { operationalDate } }),
      prisma.warungNonCashLedger.findMany({ where: { operationalDate }, include: { paymentMethod: true } }),
      prisma.warungSale.findMany({ where: { operationalDate, status: "COMPLETED" } }),
      prisma.warungExpense.findMany({ where: { operationalDate, status: "POSTED" } }),
    ]);

    return {
      operational_date: operationalDate,
      sales_total: this.sum(sales.map((sale) => sale.totalAmount)),
      expense_total: this.sum(expenses.map((expense) => expense.amount)),
      kas_laci: this.cashBalance(cashLedgers, "KAS_LACI"),
      kas_aman: this.cashBalance(cashLedgers, "KAS_AMAN"),
      non_cash_total: this.sum(nonCashLedgers.map((ledger) => ledger.direction === "IN" ? ledger.amount : -ledger.amount)),
    };
  }

  private async createCashLedger(tx: Tx, account: "KAS_LACI" | "KAS_AMAN", direction: "IN" | "OUT", amount: bigint, sourceType: string, sourceId: string, documentNo: string, operationalDate: Date, createdBy: string, note?: string) {
    return tx.warungCashLedger.create({ data: { account, direction, amount, sourceType, sourceId, documentNo, operationalDate, createdBy, note } });
  }

  private cashBalance(ledgers: { account: "KAS_LACI" | "KAS_AMAN"; direction: "IN" | "OUT"; amount: bigint }[], account: "KAS_LACI" | "KAS_AMAN") {
    return this.sum(ledgers.filter((ledger) => ledger.account === account).map((ledger) => ledger.direction === "IN" ? ledger.amount : -ledger.amount));
  }

  private sum(values: bigint[]) {
    return values.reduce((total, value) => total + value, BigInt(0)).toString();
  }

  private requireFinanceMutation(ctx: AuthContext, permission: string) {
    permissionService.require(ctx, permission);
    permissionService.requireDomain(ctx, "WARUNG");
  }
}

export const warungFinanceService = new WarungFinanceService();
