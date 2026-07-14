import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/services/audit/audit-service";
import { DocumentSequenceService } from "@/services/document-sequences/document-sequence-service";
import { permissionService } from "@/services/permissions/permission-service";
import {
  warungCategoryInputSchema,
  warungCompositionInputSchema,
  warungSellableItemInputSchema,
  warungStockOpnameInputSchema,
  warungStockProductInputSchema,
  warungStockProductUpdateSchema,
  warungUnitInputSchema,
} from "@/lib/validations/warung/product-stock";
import type { AuthContext } from "@/types/auth";

function decimal(value: string | number | Decimal) {
  return new Decimal(value);
}

export class WarungProductStockService {
  async createUnit(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = warungUnitInputSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const unit = await tx.warungUnit.create({
        data: {
          name: payload.name,
          code: payload.code,
          isDecimalAllowed: payload.is_decimal_allowed,
          sortOrder: payload.sort_order,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "create_unit", entityType: "warung_unit", entityId: unit.id, newValue: unit });
      return unit;
    });
  }

  async createCategory(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = warungCategoryInputSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const category = await tx.warungProductCategory.create({ data: { name: payload.name, code: payload.code, sortOrder: payload.sort_order } });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "create_category", entityType: "warung_product_category", entityId: category.id, newValue: category });
      return category;
    });
  }

  async createStockProduct(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = warungStockProductInputSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const product = await tx.warungStockProduct.create({
        data: {
          name: payload.name,
          baseUnitId: payload.base_unit_id,
          sku: payload.sku,
          barcode: payload.barcode,
          minStockQty: decimal(payload.min_stock_qty),
          notes: payload.notes,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "create_stock_product", entityType: "warung_stock_product", entityId: product.id, newValue: product });
      return product;
    });
  }

  async updateStockProduct(ctx: AuthContext, productId: string, input: unknown) {
    this.requireManage(ctx);
    const payload = warungStockProductUpdateSchema.parse(input);
    const current = await prisma.warungStockProduct.findUniqueOrThrow({ where: { id: productId } });
    return prisma.$transaction(async (tx) => {
      const product = await tx.warungStockProduct.update({
        where: { id: productId },
        data: {
          name: payload.name,
          sku: payload.sku,
          barcode: payload.barcode,
          minStockQty: payload.min_stock_qty === undefined ? undefined : decimal(payload.min_stock_qty),
          notes: payload.notes,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "update_stock_product", entityType: "warung_stock_product", entityId: product.id, oldValue: current, newValue: product });
      return product;
    });
  }

  async createSellableItem(ctx: AuthContext, input: unknown) {
    this.requireManage(ctx);
    const payload = warungSellableItemInputSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const item = await tx.warungSellableItem.create({
        data: {
          itemType: payload.item_type,
          stockProductId: payload.stock_product_id,
          categoryId: payload.category_id,
          name: payload.name,
          sellingPriceAmount: payload.selling_price_amount,
          isFavorite: payload.is_favorite,
          sku: payload.sku,
          barcode: payload.barcode,
        },
      });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "create_sellable_item", entityType: "warung_sellable_item", entityId: item.id, newValue: item });
      return item;
    });
  }

  async setComposition(ctx: AuthContext, sellableItemId: string, input: unknown) {
    this.requireManage(ctx);
    const payload = warungCompositionInputSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      await tx.warungItemComposition.deleteMany({ where: { sellableItemId } });
      const components = await Promise.all(
        payload.components.map((component, index) =>
          tx.warungItemComposition.create({
            data: {
              sellableItemId,
              componentProductId: component.stock_product_id,
              qtyBase: decimal(component.qty_base),
              sortOrder: index,
            },
          }),
        ),
      );
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.product", action: "set_composition", entityType: "warung_sellable_item", entityId: sellableItemId, newValue: components });
      return components;
    });
  }

  async createStockOpname(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "warung.stock.opname");
    permissionService.requireDomain(ctx, "WARUNG");
    const payload = warungStockOpnameInputSchema.parse(input);

    return prisma.$transaction(async (tx) => {
      const docNo = await new DocumentSequenceService(tx).nextNumber("WARUNG", "STOCK_OPNAME", "WSO-");
      const productIds = payload.items.map((item) => item.stock_product_id);
      const products = await tx.warungStockProduct.findMany({ where: { id: { in: productIds } } });
      const productById = new Map(products.map((product) => [product.id, product]));
      const opname = await tx.warungStockOpname.create({
        data: {
          documentNo: docNo,
          operationalDate: new Date(payload.operational_date),
          notes: payload.notes,
          createdBy: ctx.user.id,
          items: {
            create: payload.items.map((item) => {
              const product = productById.get(item.stock_product_id);
              const systemQty = product?.currentStockQty ?? decimal(0);
              const physicalQty = decimal(item.physical_qty_base);
              return {
                stockProductId: item.stock_product_id,
                systemQtyBase: systemQty,
                physicalQtyBase: physicalQty,
                differenceQtyBase: physicalQty.minus(systemQty),
                notes: item.notes,
              };
            }),
          },
        },
      });
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.stock", action: "create_stock_opname", entityType: "warung_stock_opname", entityId: opname.id, entityNo: docNo, newValue: payload });
      return opname;
    });
  }

  async postStockOpname(ctx: AuthContext, opnameId: string) {
    permissionService.require(ctx, "warung.stock.opname");
    permissionService.requireDomain(ctx, "WARUNG");
    const current = await prisma.warungStockOpname.findUniqueOrThrow({ where: { id: opnameId }, include: { items: true } });

    return prisma.$transaction(async (tx) => {
      const posted = await tx.warungStockOpname.update({ where: { id: opnameId }, data: { status: "POSTED", postedAt: new Date(), postedBy: ctx.user.id } });
      for (const item of current.items) {
        if (item.differenceQtyBase.equals(0)) continue;
        await tx.warungStockProduct.update({ where: { id: item.stockProductId }, data: { currentStockQty: item.physicalQtyBase } });
        await tx.warungStockMovement.create({
          data: {
            stockProductId: item.stockProductId,
            movementType: "STOCK_OPNAME",
            direction: item.differenceQtyBase.greaterThan(0) ? "IN" : "OUT",
            qtyBase: item.differenceQtyBase.abs(),
            sourceType: "warung_stock_opname",
            sourceId: opnameId,
            documentNo: current.documentNo,
            operationalDate: current.operationalDate,
            createdBy: ctx.user.id,
          },
        });
      }
      await new AuditService(tx).write({ ctx, domain: "WARUNG", module: "warung.stock", action: "post_stock_opname", entityType: "warung_stock_opname", entityId: opnameId, entityNo: current.documentNo, oldValue: { status: current.status }, newValue: { status: posted.status } });
      return posted;
    });
  }

  private requireManage(ctx: AuthContext) {
    permissionService.require(ctx, "warung.product.manage");
    permissionService.requireDomain(ctx, "WARUNG");
  }
}

export const warungProductStockService = new WarungProductStockService();
