import { z } from "zod";

export const reportFilterSchema = z.object({
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
}).refine((value) => !value.date_from || !value.date_to || value.date_from <= value.date_to, {
  path: ["date_to"],
  message: "Tanggal akhir harus >= tanggal awal.",
});

export const dailyChartFilterSchema = z.object({
  metric: z.enum(["pendapatan", "profit", "fee", "transaction_count"]).default("pendapatan"),
  mode: z.enum(["combined", "split_domain"]).default("combined"),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  compare_with_previous: z.union([z.boolean(), z.enum(["true", "false"])]).default(false).transform((value) => value === true || value === "true"),
});

export const monthlyChartFilterSchema = z.object({
  metric: z.enum(["pendapatan", "profit"]).default("pendapatan"),
  mode: z.enum(["combined", "split_domain"]).default("combined"),
  year: z.coerce.number().int().min(2000).max(2100),
});
