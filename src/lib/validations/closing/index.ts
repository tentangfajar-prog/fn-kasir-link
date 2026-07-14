import { z } from "zod";

const money = z.number().int().nonnegative();

export const closingFilterSchema = z.object({
  operational_date: z.string().date().optional(),
});

export const createWarungClosingSchema = z.object({
  operational_date: z.string().date().optional(),
  actual_cash_laci_amount: money,
  note: z.string().trim().max(500).optional().nullable(),
});

export const createBrilinkClosingSchema = z.object({
  operational_date: z.string().date().optional(),
  actual_cash_amount: money,
  actual_saldo_amount: money,
  note: z.string().trim().max(500).optional().nullable(),
});

export const reversalReasonSchema = z.object({
  reason: z.string().trim().min(5).max(500),
});
