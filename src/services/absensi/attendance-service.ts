import { createHash, randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { AuditService } from "@/services/audit/audit-service";
import { permissionService } from "@/services/permissions/permission-service";
import { attendanceScanSchema, attendanceSettingSchema, correctAttendanceSchema } from "@/lib/validations/absensi";
import type { AuthContext } from "@/types/auth";

type Tx = Prisma.TransactionClient;

type Location = { latitude: number; longitude: number };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export class AttendanceService {
  async upsertSetting(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "attendance.correct");
    const payload = attendanceSettingSchema.parse(input);
    const current = await prisma.attendanceSetting.findFirst({ where: { isActive: true, deletedAt: null } });
    return prisma.$transaction(async (tx) => {
      if (current) await tx.attendanceSetting.update({ where: { id: current.id }, data: { isActive: false, deletedAt: new Date() } });
      const setting = await tx.attendanceSetting.create({
        data: { name: payload.name, latitude: payload.latitude, longitude: payload.longitude, radiusMeters: payload.radius_meters, qrTtlSeconds: payload.qr_ttl_seconds },
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "absensi", action: "attendance_setting.upsert", entityType: "attendance_setting", entityId: setting.id, newValue: setting });
      return setting;
    });
  }

  async displayQr(ctx: AuthContext) {
    permissionService.require(ctx, "attendance.qr.display");
    return this.generateQrToken(ctx);
  }

  async generateQrToken(ctx: AuthContext) {
    permissionService.require(ctx, "attendance.qr.display");
    const setting = await this.activeSetting(prisma);
    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date(Date.now() + setting.qrTtlSeconds * 1000);
    await prisma.attendanceQrToken.create({ data: { tokenHash: hashToken(token), expiresAt, createdBy: ctx.user.id } });
    return { qr_token: token, expires_at: expiresAt, ttl_seconds: setting.qrTtlSeconds };
  }

  async getTodayStatus(ctx: AuthContext) {
    permissionService.require(ctx, "absensi.view");
    const record = await prisma.attendanceRecord.findUnique({ where: { userId_attendanceDate: { userId: ctx.user.id, attendanceDate: today() } } });
    return { attendance_date: today(), status: record?.status ?? "NOT_CHECKED_IN", record };
  }

  async checkIn(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "attendance.check");
    const payload = attendanceScanSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const setting = await this.activeSetting(tx);
      await this.validateQr(tx, payload.qr_token);
      const distance = this.distanceMeters({ latitude: payload.latitude, longitude: payload.longitude }, { latitude: setting.latitude.toNumber(), longitude: setting.longitude.toNumber() });
      if (distance > setting.radiusMeters) throw new AppError("OUTSIDE_RADIUS", "Lokasi di luar radius absensi.");
      const attendanceDate = today();
      const existing = await tx.attendanceRecord.findUnique({ where: { userId_attendanceDate: { userId: ctx.user.id, attendanceDate } } });
      if (existing) throw new AppError("ALREADY_CHECKED_IN", "Sudah check-in hari ini.");
      const record = await tx.attendanceRecord.create({
        data: { userId: ctx.user.id, attendanceDate, checkInAt: new Date(), checkInLatitude: payload.latitude, checkInLongitude: payload.longitude, checkInDistanceM: Math.round(distance), status: "CHECKED_IN" },
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "absensi", action: "attendance.check_in", entityType: "attendance_record", entityId: record.id, newValue: { distance_meters: Math.round(distance) } });
      return record;
    });
  }

  async checkOut(ctx: AuthContext, input: unknown) {
    permissionService.require(ctx, "attendance.check");
    const payload = attendanceScanSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const setting = await this.activeSetting(tx);
      await this.validateQr(tx, payload.qr_token);
      const distance = this.distanceMeters({ latitude: payload.latitude, longitude: payload.longitude }, { latitude: setting.latitude.toNumber(), longitude: setting.longitude.toNumber() });
      if (distance > setting.radiusMeters) throw new AppError("OUTSIDE_RADIUS", "Lokasi di luar radius absensi.");
      const attendanceDate = today();
      const existing = await tx.attendanceRecord.findUnique({ where: { userId_attendanceDate: { userId: ctx.user.id, attendanceDate } } });
      if (!existing) throw new AppError("CHECKOUT_WITHOUT_CHECKIN", "Belum check-in hari ini.");
      if (existing.checkOutAt) throw new AppError("ALREADY_CHECKED_OUT", "Sudah check-out hari ini.");
      const record = await tx.attendanceRecord.update({
        where: { id: existing.id },
        data: { checkOutAt: new Date(), checkOutLatitude: payload.latitude, checkOutLongitude: payload.longitude, checkOutDistanceM: Math.round(distance), status: "CHECKED_OUT" },
      });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "absensi", action: "attendance.check_out", entityType: "attendance_record", entityId: record.id, oldValue: existing, newValue: { distance_meters: Math.round(distance) } });
      return record;
    });
  }

  async correctAttendance(ctx: AuthContext, recordId: string, input: unknown) {
    permissionService.require(ctx, "attendance.correct");
    const payload = correctAttendanceSchema.parse(input);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.attendanceRecord.findUniqueOrThrow({ where: { id: recordId } });
      const newValue = {
        checkInAt: payload.check_in_at ? new Date(payload.check_in_at) : existing.checkInAt,
        checkOutAt: payload.check_out_at ? new Date(payload.check_out_at) : existing.checkOutAt,
        status: payload.status ?? "CORRECTED",
      };
      const record = await tx.attendanceRecord.update({ where: { id: recordId }, data: newValue });
      await tx.attendanceCorrection.create({ data: { recordId, reason: payload.reason, oldValue: this.json(existing), newValue: this.json(newValue), correctedBy: ctx.user.id } });
      await new AuditService(tx).write({ ctx, domain: "GLOBAL", module: "absensi", action: "attendance.correct", entityType: "attendance_record", entityId: record.id, oldValue: existing, newValue: { ...newValue, reason: payload.reason } });
      return record;
    });
  }

  private json(value: unknown) {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private async activeSetting(db: Tx | typeof prisma) {
    const setting = await db.attendanceSetting.findFirst({ where: { isActive: true, deletedAt: null }, orderBy: { createdAt: "desc" } });
    if (!setting) throw new AppError("ATTENDANCE_SETTING_MISSING", "Setting absensi belum dibuat.");
    return setting;
  }

  private async validateQr(tx: Tx, token: string) {
    const qr = await tx.attendanceQrToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!qr) throw new AppError("QR_INVALID", "QR absensi tidak valid.");
    if (qr.expiresAt < new Date()) throw new AppError("QR_EXPIRED", "QR absensi sudah kedaluwarsa.");
  }

  private distanceMeters(a: Location, b: Location) {
    const earthRadius = 6371000;
    const dLat = this.rad(b.latitude - a.latitude);
    const dLon = this.rad(b.longitude - a.longitude);
    const lat1 = this.rad(a.latitude);
    const lat2 = this.rad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * earthRadius * Math.asin(Math.sqrt(h));
  }

  private rad(value: number) {
    return value * Math.PI / 180;
  }
}

export const attendanceService = new AttendanceService();
