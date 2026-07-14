# Warung Closing API Contract

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## GET /warung/closing/preview

Preview closing numbers.

### Response Includes

```text
Kas Laci Awal
Penjualan Tunai
Penjualan Non-Tunai
Pembelian Tunai
Pembayaran Hutang
Pembayaran Konsinyasi
Pengeluaran
Retur Expired Refund
Kas Laci Sistem
```

## POST /warung/closing

Create closing.

```json
{
  "operational_date": "2026-07-14",
  "cash_physical_actual_amount": 1480000,
  "notes": "Selisih dicek besok"
}
```

Rules:
- Permission `warung.closing.create`.
- Cash difference calculated.
- Setoran Aman = Cash Fisik Aktual.
- Kas Laci after closing = 0.
- Closing not editable.
- Difference pending adjustment.

## GET /warung/closing/:id/print

Print closing.

Rules:
- Print Log required.
