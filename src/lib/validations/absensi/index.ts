import { z } from "zod";

export const attendanceSettingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius_meters: z.number().int().min(10).max(1000).default(100),
  qr_ttl_seconds: z.number().int().min(15).max(300).default(60),
});

export const attendanceScanSchema = z.object({
  qr_token: z.string().trim().min(16),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const correctAttendanceSchema = z.object({
  reason: z.string().trim().min(5).max(500),
  check_in_at: z.string().datetime().optional().nullable(),
  check_out_at: z.string().datetime().optional().nullable(),
  status: z.enum(["CHECKED_IN", "CHECKED_OUT", "CORRECTED", "CANCELLED"]).optional(),
});
