import { z } from "zod";

const decimalInput = z.union([z.number(), z.string()]).transform((value) => String(value));

export const warungUnitInputSchema = z.object({
  name: z.string().min(1).max(80),
  code: z.string().min(1).max(20).toUpperCase(),
  is_decimal_allowed: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const warungCategoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(40).toUpperCase(),
  sort_order: z.number().int().default(0),
});

export const warungStockProductInputSchema = z.object({
  name: z.string().min(2).max(120),
  base_unit_id: z.string().uuid(),
  sku: z.string().max(50).optional().nullable(),
  barcode: z.string().max(80).optional().nullable(),
  min_stock_qty: decimalInput.default("0"),
  notes: z.string().max(500).optional().nullable(),
});

export const warungStockProductUpdateSchema = warungStockProductInputSchema.partial().omit({ base_unit_id: true });

export const warungSellableItemInputSchema = z.object({
  item_type: z.enum(["NORMAL", "RECIPE", "BUNDLE"]).default("NORMAL"),
  stock_product_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid(),
  name: z.string().min(2).max(120),
  selling_price_amount: z.number().int().nonnegative(),
  is_favorite: z.boolean().default(false),
  sku: z.string().max(50).optional().nullable(),
  barcode: z.string().max(80).optional().nullable(),
});

export const warungCompositionInputSchema = z.object({
  components: z.array(z.object({
    stock_product_id: z.string().uuid(),
    qty_base: decimalInput,
  })).min(1),
});

export const warungStockOpnameInputSchema = z.object({
  operational_date: z.string().date(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(z.object({
    stock_product_id: z.string().uuid(),
    physical_qty_base: decimalInput,
    notes: z.string().max(500).optional().nullable(),
  })).min(1),
});
