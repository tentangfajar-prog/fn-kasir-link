import { z } from "zod";

export const settingScopeSchema = z.enum(["GLOBAL", "WARUNG", "BRILINK", "ABSENSI", "PRINT", "SYSTEM"]);

export const updateSettingsSchema = z.record(z.string().min(1), z.unknown()).refine((value) => Object.keys(value).length > 0, {
  message: "Minimal satu setting harus diisi.",
});
