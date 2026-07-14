import { z } from "zod";

const money = z.number().int().positive();

export const expenseCategorySchema = z.object({
  name: z.string().trim().min(2),
  code: z.string().trim().min(2).max(32).toUpperCase(),
  sort_order: z.number().int().nonnegative().default(0),
});

export const createExpenseSchema = z.object({
  category_id: z.string().uuid(),
  account: z.enum(["KAS_LACI", "KAS_AMAN"]),
  description: z.string().trim().min(3),
  amount: money,
  operational_date: z.string().date().optional(),
  note: z.string().trim().optional(),
});

export const createCashTransferSchema = z.object({
  from_account: z.enum(["KAS_LACI", "KAS_AMAN"]),
  to_account: z.enum(["KAS_LACI", "KAS_AMAN"]),
  amount: money,
  operational_date: z.string().date().optional(),
  note: z.string().trim().optional(),
}).refine((value) => value.from_account !== value.to_account, {
  path: ["to_account"],
  message: "Akun tujuan harus berbeda.",
});

export const dailySummarySchema = z.object({
  operational_date: z.string().date().optional(),
});
