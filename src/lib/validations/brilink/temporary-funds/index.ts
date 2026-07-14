import { z } from "zod";

const positiveMoney = z.number().int().positive();
const account = z.enum(["cash", "saldo", "CASH", "SALDO"]).transform((value) => value.toUpperCase() as "CASH" | "SALDO");
const note = z.string().trim().max(500).optional().nullable();

export const createDanaLuarSchema = z.object({
  borrower_name: z.string().trim().min(2).max(120),
  nominal_amount: positiveMoney,
  source_account: account,
  operational_date: z.string().date().optional(),
  notes: note,
});

export const returnDanaLuarSchema = z.object({
  return_amount: positiveMoney,
  return_to_account: account,
  operational_date: z.string().date().optional(),
  notes: note,
});

export const createInjectionSchema = z.object({
  fund_provider_name: z.string().trim().min(2).max(120),
  nominal_amount: positiveMoney,
  target_account: account,
  operational_date: z.string().date().optional(),
  notes: note,
});

export const returnInjectionSchema = z.object({
  return_amount: positiveMoney,
  return_from_account: account,
  operational_date: z.string().date().optional(),
  notes: note,
});
