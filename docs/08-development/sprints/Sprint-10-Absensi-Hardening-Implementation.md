# Sprint 10 — Absensi & Hardening Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 10 implements attendance core and basic app hardening.

Included:

- Attendance setting.
- Dynamic QR token storage with SHA-256 hash.
- Attendance record.
- Attendance correction.
- `AttendanceService` methods:
  - `upsertSetting`
  - `displayQr`
  - `generateQrToken`
  - `getTodayStatus`
  - `checkIn`
  - `checkOut`
  - `correctAttendance`
- GPS validation.
- Radius validation.
- QR expiry validation.
- Audit log for setting, check-in, check-out, correction.
- Permissions:
  - `absensi.view`
  - `attendance.check`
  - `attendance.qr.display`
  - `attendance.correct`
- Basic security headers in `next.config.ts`:
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
- Self-check script:
  - `npm run check:sprint10`

## Atomic Rules

`checkIn` runs in one Prisma transaction:

1. validate permission
2. validate active setting
3. validate QR hash and expiry
4. validate GPS radius
5. validate no check-in today
6. create attendance record
7. create audit log

`checkOut` runs in one Prisma transaction:

1. validate permission
2. validate active setting
3. validate QR hash and expiry
4. validate GPS radius
5. validate existing check-in
6. validate not checked out
7. update attendance record
8. create audit log

`correctAttendance` runs in one Prisma transaction:

1. validate correction permission
2. load record
3. update corrected values
4. create correction row with old/new value
5. create audit log

## Deliberate Limits

Not included in Sprint 10:

- API route handlers.
- Final QR display UI.
- Final GPS browser integration.
- Full CSP, because UI/assets are not finalized yet.
- Rate limiting middleware, because auth/session route handlers are not wired yet.
