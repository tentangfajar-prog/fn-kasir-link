import { z } from "zod";

export const partnerQuerySchema = z.object({
  keyword: z.string().max(100).optional(),
  partner_type: z.enum(["SUPPLIER", "CONSIGNMENT", "BOTH"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const partnerInputSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().max(30).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  partner_type: z.enum(["SUPPLIER", "CONSIGNMENT", "BOTH"]),
});

export const partnerUpdateSchema = partnerInputSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
