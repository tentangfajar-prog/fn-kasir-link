# WarungClosingService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Membuat Closing Warung.

## Main Methods

```ts
previewClosing(ctx, operationalDate)
createClosing(ctx, input)
printClosing(ctx, closingId, format)
```

## Rules

- Kasir/Admin/Owner bisa closing sesuai permission.
- Closing boleh dibuat kapan saja setelah cutoff.
- Input Cash Fisik Aktual.
- Calculate Kas Laci Sistem.
- Difference shown, not auto-adjusted.
- Setoran Aman = Cash Fisik Aktual.
- Kas Laci after closing = 0.
- Closing not editable.

## Atomic Flow

```text
Validate permission
Read ledger snapshot
Calculate system cash
Generate document number
Create closing snapshot
Create setoran aman ledger
Create pending difference marker if needed
Create audit log
Commit
```
