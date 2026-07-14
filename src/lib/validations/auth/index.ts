import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(128),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(8).max(128),
  new_password: z.string().min(10).max(128),
});

export const resetPasswordSchema = z.object({
  user_id: z.string().uuid(),
});
