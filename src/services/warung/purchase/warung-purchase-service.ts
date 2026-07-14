import type { Prisma, WarungCashAccount } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { createPurchaseSchema, paySupplierDebtSchema } from "@/lib/validations/warung/purchase";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;
type PurchaseItem = { stock_product_id: string; qty_base: string; unit_price_amount: number; discount_amount: number };

function money(value: number) {
  return BigInt(value);
}

function decimal(value: string | number | Decimal) {
  return new Decimal(value);
}

function day(input?: string) {
  return input ? new Date(input) : new Date();
}

export class WarungPurchaseService {
  async createPurchase(ctx: AuthContext, input: unknown) {
    this.requirePurchase(ctx);
    const payload = createPurchaseSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findUniqueOrThrow({ where: { id: payload.partner_id } });
      if (partner.status !== "ACTIVE" || partner.deletedAt) throw new AppError("SUPPLIER_INACTIVE", "Supplier tidak aktif.");
      if (partner.partnerType !== "SUPPLIER" && partner.partnerType !== "BOTH") throw new AppError("SUPPLIER_REQUIRED_FOR_DEBT", "Partner harus supplier.");

      const rows = this.calculateItems(payload.items, money(payload.invoice_discount_amount));
      const subtotal = rows.reduce((total, row) => total + row.grossAmount - row.discountAmount, BigInt(0));
      if (money(payload.invoice_discount_amount) > subtotal) throw new AppError("INVALID_INVOICE_DISCOUNT", "Diskon nota melebihi subtotal.");
      const total = rows.reduce((sum, row) => sum + row.netAmount, BigInt(0));
      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "PURCHASE", "WPU-");
      const operationalDate = day(payload.operational_date);

      const products = await tx.warungStockProduct.findMany({ where: { id: { in: rows.map((row) => row.stockProductId) } } });
      const productById = new Map(products.map((product) => [product.id, product]));
      if (productById.size !== new Set(rows.map((row) => row.stockProductId)).size) throw new AppError("INVALID_PURCHASE_ITEM", "Produk pembelian tidak valid.");

      const purchase = await tx.warungPurchase.create({
        data: {
          documentNo,
          operationalDate,
          partnerId: partner.id,
          partnerNameSnapshot: partner.name,
          paymentStatus: payload.payment_status,
          cashSource: payload.cash_source,
          subtotalAmount: subtotal,
          invoiceDiscountAmount: money(payload.invoice_discount_amount),
          totalAmount: total,
          note: payload.note,
          createdBy: ctx.user.id,
        },
      });

      for (const row of rows) {
        const product = productById.get(row.stockProductId)!;
        await tx.warungPurchaseItem.create({
          data: {
            purchaseId: purchase.id,
            stockProductId: product.id,
            stockProductNameSnapshot: product.name,
            qtyBase: row.qtyBase,
            unitPriceAmount: row.unitPriceAmount,
            discountAmount: row.discountAmount,
            invoiceDiscountShare: row.invoiceDiscountShare,
            netAmount: row.netAmount,
            hppAmount: row.hppAmount,
          },
        });
        await tx.warungStockProduct.update({
          where: { id: product.id },
          data: {
            currentStockQty: product.currentStockQty.plus(row.qtyBase),
            currentHppAmount: this.weightedAverageHpp(product.currentStockQty, product.currentHppAmount, row.qtyBase, row.hppAmount),
          },
        });
        await tx.warungStockMovement.create({
          data: {
            stockProductId: product.id,
            movementType: "PURCHASE",
            direction: "IN",
            qtyBase: row.qtyBase,
            hppAmountSnapshot: row.hppAmount,
            valueAmount: row.netAmount,
            sourceType: "warung_purchase",
            sourceId: purchase.id,
            documentNo,
            operationalDate,
            createdBy: ctx.user.id,
          },
        });
      }

      if (payload.payment_status === "PAID_CASH") {
        await this.ensureCashAvailable(tx, payload.cash_source!, total);
        await this.createCashLedger(tx, payload.cash_source!, "OUT", total, "warung_purchase", purchase.id, documentNo, operationalDate, ctx.user.id, payload.note ?? undefined);
      } else {
        await tx.warungSupplierDebt.create({
          data: {
            purchaseId: purchase.id,
            documentNo,
            partnerId: partner.id,
            partnerNameSnapshot: partner.name,
            principalAmount: total,
            remainingAmount: total,
            createdBy: ctx.user.id,
          },
        });
      }

      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.purchase", action: "purchase.create", entityType: "warung_purchase", entityId: purchase.id, entityNo: documentNo, newValue: { total: total.toString(), payment_status: payload.payment_status } });
      return purchase;
    });
  }

  async payDebt(ctx: AuthContext, debtId: string, input: unknown) {
    permissionService.require(ctx, "warung.debt.pay");
    permissionService.requireDomain(ctx, "WARUNG");
    const payload = paySupplierDebtSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const debt = await tx.warungSupplierDebt.findUniqueOrThrow({ where: { id: debtId } });
      if (debt.status === "PAID" || debt.status === "CANCELLED") throw new AppError("DEBT_NOT_PAYABLE", "Hutang tidak bisa dibayar.");
      const amount = money(payload.payment_amount);
      if (amount > debt.remainingAmount) throw new AppError("PAYMENT_EXCEEDS_DEBT", "Pembayaran melebihi sisa hutang.");

      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "DEBT_PAYMENT", "WDP-");
      const operationalDate = day(payload.operational_date);
      const payment = await tx.warungSupplierDebtPayment.create({
        data: { debtId, documentNo, operationalDate, cashSource: payload.cash_source, amount, note: payload.note, createdBy: ctx.user.id },
      });

      const paidAmount = debt.paidAmount + amount;
      const remainingAmount = debt.remainingAmount - amount;
      await tx.warungSupplierDebt.update({
        where: { id: debtId },
        data: { paidAmount, remainingAmount, status: remainingAmount === BigInt(0) ? "PAID" : "PARTIAL" },
      });
      await this.ensureCashAvailable(tx, payload.cash_source, amount);
      await this.createCashLedger(tx, payload.cash_source, "OUT", amount, "warung_supplier_debt_payment", payment.id, documentNo, operationalDate, ctx.user.id, payload.note ?? undefined);
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.debt", action: "debt.payment.create", entityType: "warung_supplier_debt_payment", entityId: payment.id, entityNo: documentNo, newValue: { amount: amount.toString(), debt_id: debtId } });
      return payment;
    });
  }

  private calculateItems(items: PurchaseItem[], invoiceDiscount: bigint) {
    const baseRows = items.map((item) => {
      const qtyBase = decimal(item.qty_base);
      if (!qtyBase.isInteger() || qtyBase.lessThanOrEqualTo(0)) throw new AppError("INVALID_PURCHASE_ITEM", "Qty pembelian harus bilangan bulat positif untuk Sprint 06.");
      const qty = BigInt(qtyBase.toString());
      const grossAmount = money(item.unit_price_amount) * qty;
      const discountAmount = money(item.discount_amount);
      if (discountAmount > grossAmount) throw new AppError("INVALID_PURCHASE_ITEM", "Diskon item melebihi harga item.");
      return { item, qtyBase, qty, grossAmount, discountAmount, beforeInvoiceDiscount: grossAmount - discountAmount };
    });
    const subtotal = baseRows.reduce((total, row) => total + row.beforeInvoiceDiscount, BigInt(0));
    let allocated = BigInt(0);
    return baseRows.map((row, index) => {
      const invoiceDiscountShare = index === baseRows.length - 1 ? invoiceDiscount - allocated : subtotal === BigInt(0) ? BigInt(0) : (invoiceDiscount * row.beforeInvoiceDiscount) / subtotal;
      allocated += invoiceDiscountShare;
      const netAmount = row.beforeInvoiceDiscount - invoiceDiscountShare;
      return {
        stockProductId: row.item.stock_product_id,
        qtyBase: row.qtyBase,
        unitPriceAmount: money(row.item.unit_price_amount),
        discountAmount: row.discountAmount,
        grossAmount: row.grossAmount,
        invoiceDiscountShare,
        netAmount,
        hppAmount: netAmount / row.qty,
      };
    });
  }

  private weightedAverageHpp(oldQty: Decimal, oldHpp: bigint, qtyIn: Decimal, purchaseHpp: bigint) {
    const totalQty = oldQty.plus(qtyIn);
    if (totalQty.equals(0)) return purchaseHpp;
    const totalValue = oldQty.mul(oldHpp.toString()).plus(qtyIn.mul(purchaseHpp.toString()));
    return BigInt(totalValue.div(totalQty).floor().toFixed(0));
  }

  private async createCashLedger(tx: Tx, account: WarungCashAccount, direction: "IN" | "OUT", amount: bigint, sourceType: string, sourceId: string, documentNo: string, operationalDate: Date, createdBy: string, note?: string) {
    return tx.warungCashLedger.create({ data: { account, direction, amount, sourceType, sourceId, documentNo, operationalDate, createdBy, note } });
  }

  private async ensureCashAvailable(tx: Tx, account: WarungCashAccount, amount: bigint) {
    const ledgers = await tx.warungCashLedger.findMany({ where: { account }, select: { direction: true, amount: true } });
    const balance = ledgers.reduce((total, ledger) => total + (ledger.direction === "IN" ? ledger.amount : -ledger.amount), BigInt(0));
    if (balance < amount) throw new AppError("INSUFFICIENT_CASH", "Saldo kas tidak cukup.");
  }

  private requirePurchase(ctx: AuthContext) {
    permissionService.require(ctx, "warung.purchase.create");
    permissionService.requireDomain(ctx, "WARUNG");
  }
}

export const warungPurchaseService = new WarungPurchaseService();
