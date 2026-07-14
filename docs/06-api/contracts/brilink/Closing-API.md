# BRILink Closing API Contract

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## GET /brilink/closing/preview

Returns:

```text
Cash Sistem
Saldo Sistem
Total Fee
Total Transaksi
Dana di Luar Aktif
Injeksi Aktif
Konsinyasi BRILink
```

## POST /brilink/closing

```json
{
  "operational_date": "2026-07-14",
  "cash_physical_actual_amount": 15200000,
  "saldo_actual_amount": 38700000,
  "notes": "OK"
}
```

Rules:
- Permission `brilink.closing.create`.
- Cash and Saldo difference calculated.
- Difference pending adjustment.
- Closing not editable.
