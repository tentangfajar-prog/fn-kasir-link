import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const service = readFileSync("src/services/absensi/attendance-service.ts", "utf8");
const nextConfig = readFileSync("next.config.ts", "utf8");
const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));

assert.equal(permissionCodes.has("absensi.view"), true);
assert.equal(permissionCodes.has("attendance.check"), true);
assert.equal(permissionCodes.has("attendance.qr.display"), true);
assert.equal(permissionCodes.has("attendance.correct"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("attendance.check"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("attendance.check"), true);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("attendance.correct"), false);
assert.match(schema, /model AttendanceSetting /);
assert.match(schema, /model AttendanceQrToken /);
assert.match(schema, /model AttendanceRecord /);
assert.match(schema, /model AttendanceCorrection /);
assert.match(service, /randomBytes/);
assert.match(service, /sha256/);
assert.match(service, /distanceMeters/);
assert.match(service, /OUTSIDE_RADIUS/);
assert.match(service, /QR_EXPIRED/);
assert.match(service, /AuditService/);
assert.match(nextConfig, /X-Frame-Options/);
assert.match(nextConfig, /X-Content-Type-Options/);
assert.match(nextConfig, /Permissions-Policy/);

console.log("Sprint 10 absensi hardening self-check OK");
