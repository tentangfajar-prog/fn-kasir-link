# BRILinkClosingService

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## Purpose

Membuat Closing BRILink.

## Main Methods

```ts
previewClosing(ctx, operationalDate)
createClosing(ctx, input)
printClosing(ctx, closingId, format)
```

## Rules

- Auto cutoff 21.00.
- Input Cash Fisik Aktual.
- Input Saldo Aktual Gabungan.
- Calculate Cash/Saldo system.
- Show Cash/Saldo difference.
- Show Fee, Dana di Luar, Injeksi, Konsinyasi.
- Difference not auto-adjusted.
- Closing not editable.

## Atomic Flow

```text
Validate permission
Read cash/saldo/fee ledger snapshot
Read Dana di Luar/Injeksi/Konsinyasi snapshot
Generate BRI document number
Create closing
Create audit log
Commit
```
