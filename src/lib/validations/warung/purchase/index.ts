import { z } from "zod";

const money = z.number().int().nonnegative();
const positiveMoney = z.number().int().positive();
const decimalInput = z.union([z.number(), z.string()]).transform((value) => String(value));

export const createPurchaseSchema = z.object({
  partner_id: z.string().uuid(),
  payment_status: z.enum(["PAID_CASH", "SUPPLIER_DEBT"]),
  cash_source: z.enum(["KAS_LACI", "KAS_AMAN"]).optional().nullable(),
  invoice_discount_amount: money.default(0),
  operational_date: z.string().date().optional(),
  note: z.string().trim().max(500).optional().nullable(),
  items: z.array(z.object({
    stock_product_id: z.string().uuid(),
    qty_base: decimalInput,
    unit_price_amount: positiveMoney,
    discount_amount: money.default(0),
  })).min(1),
}).superRefine((value, ctx) => {
  if (value.payment_status === "PAID_CASH" && !value.cash_source) {
    ctx.addIssue({ code: "custom", path: ["cash_source"], message: "Sumber kas wajib untuk pembelian tunai." });
  }
});

export const paySupplierDebtSchema = z.object({
  payment_amount: positiveMoney,
  cash_source: z.enum(["KAS_LACI", "KAS_AMAN"]),
  operational_date: z.string().date().optional(),
  note: z.string().trim().max(500).optional().nullable(),
});
