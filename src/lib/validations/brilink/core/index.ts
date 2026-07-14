import { z } from "zod";

const money = z.number().int().nonnegative();
const positiveMoney = z.number().int().positive();
const optionalText = z.string().trim().max(120).optional().nullable();

export const createBrilinkTemplateSchema = z.object({
  code: z.string().trim().min(2).max(40).toUpperCase(),
  name: z.string().trim().min(2).max(100),
  cash_direction: z.enum(["IN", "OUT"]).optional().nullable(),
  cash_amount_formula: z.enum(["NONE", "NOMINAL", "FEE", "NOMINAL_PLUS_FEE"]).default("NONE"),
  saldo_direction: z.enum(["IN", "OUT"]).optional().nullable(),
  saldo_amount_formula: z.enum(["NONE", "NOMINAL", "FEE", "NOMINAL_PLUS_FEE"]).default("NONE"),
});

export const createBrilinkTransactionTypeSchema = z.object({
  code: z.string().trim().min(2).max(40).toUpperCase(),
  name: z.string().trim().min(2).max(100),
  template_id: z.string().uuid(),
  sort_order: z.number().int().nonnegative().default(0),
});

export const createBrilinkTariffGroupSchema = z.object({
  transaction_type_id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  bank_category: z.string().trim().max(80).optional().nullable(),
});

export const createBrilinkTariffRangeSchema = z.object({
  tariff_group_id: z.string().uuid(),
  min_amount: money,
  max_amount: money.optional().nullable(),
  fee_amount: money,
}).refine((value) => value.max_amount == null || value.max_amount >= value.min_amount, {
  path: ["max_amount"],
  message: "Maksimum nominal harus >= minimum nominal.",
});

export const brilinkTransactionInputSchema = z.object({
  transaction_type_id: z.string().uuid(),
  nominal_amount: positiveMoney,
  bank_category: z.string().trim().max(80).optional().nullable(),
  operational_date: z.string().date().optional(),
  reference_no: optionalText,
  target_account_no: optionalText,
  target_phone_no: optionalText,
  target_name: optionalText,
  provider_name: optionalText,
  customer_name: optionalText,
  note: z.string().trim().max(500).optional().nullable(),
});
