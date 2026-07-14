import { z } from "zod";

const money = z.number().int().nonnegative();
const qty = z.union([z.number(), z.string()]).transform((value) => String(value));

export const posValidateItemSchema = z.object({
  sellable_item_id: z.string().uuid(),
  qty: qty,
});

export const posCheckoutSchema = z.object({
  items: z.array(z.object({
    sellable_item_id: z.string().uuid(),
    qty: qty,
    discount_amount: money.default(0),
  })).min(1),
  transaction_discount_amount: money.default(0),
  payment_method_id: z.string().uuid(),
  cash_received_amount: money.optional().nullable(),
  operational_date: z.string().date().optional(),
});
