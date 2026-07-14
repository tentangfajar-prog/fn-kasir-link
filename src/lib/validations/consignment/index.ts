import { z } from "zod";

const qty = z.union([z.number(), z.string()]).transform((value) => String(value));
const money = z.number().int().nonnegative();

export const consignmentEntrySchema = z.object({
  partner_id: z.string().uuid(),
  item_name: z.string().trim().min(2).max(120),
  qty_received: qty,
  unit_cost_amount: money,
  operational_date: z.string().date().optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const consignmentPaymentSchema = z.object({
  qty_paid: qty,
  cash_source: z.enum(["KAS_LACI", "KAS_AMAN", "CASH"]).optional(),
  operational_date: z.string().date().optional(),
  note: z.string().trim().max(500).optional().nullable(),
});

export const consignmentReturnSchema = z.object({
  qty_returned: qty,
  operational_date: z.string().date().optional(),
  note: z.string().trim().max(500).optional().nullable(),
});
