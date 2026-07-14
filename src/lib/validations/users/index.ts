import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9._-]+$/),
  phone: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().nullable(),
  role_id: z.string().uuid(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateUserSchema = createUserSchema.partial().omit({ role_id: true }).extend({
  role_id: z.string().uuid().optional(),
});

export const permissionOverrideSchema = z.object({
  overrides: z.array(z.object({
    code: z.string().min(3),
    effect: z.enum(["ALLOW", "DENY"]),
  })),
});
