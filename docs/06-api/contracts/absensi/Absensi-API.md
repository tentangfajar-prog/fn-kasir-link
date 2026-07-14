# Absensi API Contract

Status: **FINAL V1 BASELINE**  
Domain: ABSENSI

## GET /absensi/status

Returns today's attendance status for current user.

## GET /absensi/display-qr

Display dynamic QR.

### Permission

```text
attendance.qr.display
```

Rules:
- QR token dynamic.
- Short TTL.
- Not static print.

## POST /absensi/check-in

```json
{
  "qr_token": "token",
  "latitude": -6.123,
  "longitude": 106.123
}
```

Rules:
- User must login.
- QR valid and not expired.
- GPS required.
- Radius validated.

## POST /absensi/check-out

Same validation as check-in.

## POST /absensi/:id/correct

Owner correction.

Rules:
- Reason required.
- Old/new value stored.
- Audit Log required.
