# FinancialReportService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Menyediakan Laporan Keuangan Owner.

## Main Methods

```ts
getSummary(ctx, filter)
getAssetLiquidity(ctx, filter)
getMatchingKasModal(ctx, filter)
getDebtAndPayables(ctx, filter)
getTemporaryFunds(ctx, filter)
getConsignmentCombined(ctx, filter)
getClosingDifferences(ctx, filter)
```

## Rules

- Owner only default.
- Does not create operational transactions.
- Reads from ledger and snapshot.
- Does not mix Warung and BRILink ledger.
- Shows combined monitoring only.

## Key Formulas

```text
Total Aset Likuid =
Kas Laci + Kas Aman + Cash BRILink + Saldo BRILink
```

```text
Estimasi Bersih Warung =
Kas Laci + Kas Aman + Nilai Stok - Hutang Supplier - Kewajiban Konsinyasi Warung
```

```text
Estimasi Dana Bersih BRILink =
Cash + Saldo + Dana di Luar Aktif - Injeksi Aktif - Kewajiban Konsinyasi BRILink
```
