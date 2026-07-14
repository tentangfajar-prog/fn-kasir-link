import type { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import { posCheckoutSchema, posValidateItemSchema } from "@/lib/validations/warung/pos";
import type { AuthContext } from "@/types/auth";

function decimal(value: string | number | Decimal) {
  return new Decimal(value);
}

function money(value: bigint | number) {
  return typeof value === "bigint" ? value : BigInt(value);
}

function toNumber(value: bigint) {
  return Number(value);
}

export class WarungPosService {
  async catalog(ctx: AuthContext) {
    this.requirePos(ctx);
    const [categories, items] = await Promise.all([
      prisma.warungProductCategory.findMany({ where: { isActive: true, deletedAt: null }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.warungSellableItem.findMany({
        where: { isActive: true, deletedAt: null },
        include: { category: true, stockProduct: true, compositions: { include: { componentProduct: true } } },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    ]);

    return {
      categories,
      favorites: items.filter((item) => item.isFavorite),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: toNumber(item.sellingPriceAmount),
        category: item.category.name,
        is_favorite: item.isFavorite,
        item_type: item.itemType,
        stock_status: this.stockStatus(item),
        badge: null,
        barcode: item.barcode,
      })),
    };
  }

  async validateItem(ctx: AuthContext, input: unknown) {
    this.requirePos(ctx);
    const payload = posValidateItemSchema.parse(input);
    const item = await prisma.warungSellableItem.findUniqueOrThrow({
      where: { id: payload.sellable_item_id },
      include: { stockProduct: true, compositions: { include: { componentProduct: true } } },
    });
    this.assertAvailable(item, decimal(payload.qty));
    return { available: true };
  }

  async checkout(ctx: AuthContext, input: unknown) {
    this.requirePos(ctx);
    const payload = posCheckoutSchema.parse(input);
    const qtyByItem = new Map(payload.items.map((item) => [item.sellable_item_id, decimal(item.qty)]));
    const discounts = new Map(payload.items.map((item) => [item.sellable_item_id, money(item.discount_amount)]));

    return prisma.$transaction(async (tx) => {
      const paymentMethod = await tx.warungPaymentMethod.findUniqueOrThrow({ where: { id: payload.payment_method_id } });
      if (!paymentMethod.isActive) throw new AppError("PAYMENT_METHOD_INACTIVE", "Metode pembayaran tidak aktif.");

      const items = await tx.warungSellableItem.findMany({
        where: { id: { in: [...qtyByItem.keys()] }, isActive: true, deletedAt: null },
        include: { category: true, stockProduct: true, compositions: { include: { componentProduct: true } } },
      });
      if (items.length !== payload.items.length) throw new AppError("ITEM_NOT_FOUND", "Item tidak ditemukan atau tidak aktif.");

      const lineItems = items.map((item) => {
        const quantity = qtyByItem.get(item.id)!;
        this.assertAvailable(item, quantity);
        const gross = money(item.sellingPriceAmount) * BigInt(quantity.toString());
        const discount = discounts.get(item.id) ?? BigInt(0);
        if (discount > gross) throw new AppError("DISCOUNT_EXCEEDS_GROSS", "Diskon item melebihi subtotal.");
        const hpp = item.stockProduct?.currentHppAmount ?? BigInt(0);
        const net = gross - discount;
        return { item, quantity, gross, discount, net, hpp, profit: net - hpp * BigInt(quantity.toString()) };
      });

      const subtotal = lineItems.reduce((sum, line) => sum + line.gross, BigInt(0));
      const itemDiscount = lineItems.reduce((sum, line) => sum + line.discount, BigInt(0));
      const transactionDiscount = money(payload.transaction_discount_amount);
      const totalDiscount = itemDiscount + transactionDiscount;
      if (totalDiscount > subtotal) throw new AppError("DISCOUNT_EXCEEDS_SUBTOTAL", "Diskon transaksi melebihi subtotal.");
      const total = subtotal - totalDiscount;

      if (paymentMethod.category === "CASH") {
        const cashReceived = money(payload.cash_received_amount ?? 0);
        if (cashReceived < total) throw new AppError("PAYMENT_AMOUNT_LESS_THAN_TOTAL", "Uang diterima kurang dari total.");
      }

      const operationalDate = payload.operational_date ? new Date(payload.operational_date) : new Date();
      const documentNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "SALE", "WRG-");
      const sale = await tx.warungSale.create({
        data: {
          documentNo,
          operationalDate,
          cashierUserId: ctx.user.id,
          cashierNameSnapshot: ctx.user.name,
          cashierRoleSnapshot: ctx.user.roleCode,
          paymentMethodId: paymentMethod.id,
          paymentMethodNameSnapshot: paymentMethod.name,
          paymentCategorySnapshot: paymentMethod.category,
          subtotalAmount: subtotal,
          totalDiscountAmount: totalDiscount,
          totalAmount: total,
          cashReceivedAmount: paymentMethod.category === "CASH" ? money(payload.cash_received_amount ?? 0) : null,
          changeAmount: paymentMethod.category === "CASH" ? money(payload.cash_received_amount ?? 0) - total : null,
        },
      });

      for (const line of lineItems) {
        const saleItem = await tx.warungSaleItem.create({
          data: {
            saleId: sale.id,
            sellableItemId: line.item.id,
            stockProductId: line.item.stockProductId,
            sellableItemNameSnapshot: line.item.name,
            itemTypeSnapshot: line.item.itemType,
            categoryNameSnapshot: line.item.category.name,
            qty: line.quantity,
            qtyBase: line.item.stockProductId ? line.quantity : null,
            sellingPriceSnapshot: line.item.sellingPriceAmount,
            hppSnapshotAmount: line.hpp,
            grossAmount: line.gross,
            discountAmount: line.discount,
            netAmount: line.net,
            profitAmount: line.profit,
            compositionSnapshot: line.item.compositions.length ? JSON.parse(JSON.stringify(line.item.compositions.map((component) => ({ product_id: component.componentProductId, qty_base: component.qtyBase.toString() })))) : undefined,
          },
        });

        if (line.item.stockProductId) {
          await this.reduceStock(tx, line.item.stockProductId, line.quantity, "SALE", sale.id, documentNo, operationalDate, ctx.user.id, line.hpp);
        }

        for (const component of line.item.compositions) {
          const componentQty = component.qtyBase.mul(line.quantity);
          await this.reduceStock(tx, component.componentProductId, componentQty, "COMPOSITION_SALE", saleItem.id, documentNo, operationalDate, ctx.user.id, component.componentProduct.currentHppAmount);
        }
      }

      if (paymentMethod.category === "CASH") {
        await tx.warungCashLedger.create({ data: { account: "KAS_LACI", direction: "IN", amount: total, sourceType: "warung_sale", sourceId: sale.id, documentNo, operationalDate, createdBy: ctx.user.id } });
      } else {
        await tx.warungNonCashLedger.create({ data: { paymentMethodId: paymentMethod.id, direction: "IN", amount: total, sourceType: "warung_sale", sourceId: sale.id, documentNo, operationalDate, createdBy: ctx.user.id } });
      }

      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.pos", action: "checkout", entityType: "warung_sale", entityId: sale.id, entityNo: documentNo, newValue: { subtotal: subtotal.toString(), total: total.toString(), item_count: lineItems.length } });
      return sale;
    });
  }

  private async reduceStock(tx: Prisma.TransactionClient, stockProductId: string, qtyBase: Decimal, movementType: "SALE" | "COMPOSITION_SALE", sourceId: string, documentNo: string, operationalDate: Date, createdBy: string, hppAmountSnapshot: bigint) {
    const product = await tx.warungStockProduct.findUniqueOrThrow({ where: { id: stockProductId } });
    if (product.currentStockQty.lt(qtyBase)) throw new AppError("INSUFFICIENT_STOCK", `Stok ${product.name} tidak cukup.`);
    await tx.warungStockProduct.update({ where: { id: stockProductId }, data: { currentStockQty: { decrement: qtyBase } } });
    await tx.warungStockMovement.create({ data: { stockProductId, movementType, direction: "OUT", qtyBase, hppAmountSnapshot, valueAmount: hppAmountSnapshot * BigInt(qtyBase.toString()), sourceType: movementType === "SALE" ? "warung_sale" : "warung_sale_item", sourceId, documentNo, operationalDate, createdBy } });
  }

  private assertAvailable(item: { isActive: boolean; deletedAt: Date | null; name: string; stockProduct?: { currentStockQty: Decimal } | null; compositions: { qtyBase: Decimal; componentProduct: { name: string; currentStockQty: Decimal } }[] }, qty: Decimal) {
    if (!item.isActive || item.deletedAt) throw new AppError("ITEM_INACTIVE", "Item tidak aktif.");
    if (item.stockProduct && item.stockProduct.currentStockQty.lt(qty)) throw new AppError("INSUFFICIENT_STOCK", `Stok ${item.name} tidak cukup.`);
    for (const component of item.compositions) {
      const required = component.qtyBase.mul(qty);
      if (component.componentProduct.currentStockQty.lt(required)) throw new AppError("COMPONENT_NOT_ENOUGH", `Komponen ${component.componentProduct.name} tidak cukup.`);
    }
  }

  private stockStatus(item: { stockProduct?: { currentStockQty: Decimal } | null; compositions: { componentProduct: { currentStockQty: Decimal } }[] }) {
    if (item.stockProduct && item.stockProduct.currentStockQty.lte(0)) return "empty";
    if (item.compositions.some((component) => component.componentProduct.currentStockQty.lte(0))) return "empty";
    return "available";
  }

  private requirePos(ctx: AuthContext) {
    permissionService.require(ctx, "warung.pos.use");
    permissionService.requireDomain(ctx, "WARUNG");
  }
}

export const warungPosService = new WarungPosService();
