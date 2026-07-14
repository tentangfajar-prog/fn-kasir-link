# AttendanceService

Status: **FINAL V1 BASELINE**  
Domain: ABSENSI

## Purpose

Mengelola absensi QR dinamis + GPS.

## Main Methods

```ts
displayQr(ctx)
generateQrToken(ctx)
getTodayStatus(ctx)
checkIn(ctx, input)
checkOut(ctx, input)
correctAttendance(ctx, recordId, input)
```

## Rules

- User must login before attendance.
- QR only inside application.
- QR dynamic and short-lived.
- GPS required for valid attendance.
- Radius validated.
- Correction default Owner only.
- attendance.qr.display required to show QR display.

## Errors

```text
QR_EXPIRED
QR_INVALID
GPS_UNAVAILABLE
OUTSIDE_RADIUS
ALREADY_CHECKED_IN
CHECKOUT_WITHOUT_CHECKIN
```
