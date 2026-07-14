# Laporan Keuangan API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## GET /laporan-keuangan/summary

Returns:

```text
Total Pendapatan Operasional
Total Profit Operasional
Total Aset Likuid
Total Modal Tercatat
Total Kewajiban
Estimasi Bersih Warung
Estimasi Dana Bersih BRILink
```

## GET /laporan-keuangan/matching

Returns Warung vs BRILink matching.

## GET /laporan-keuangan/kewajiban

Returns:

```text
Hutang Supplier
Kewajiban Konsinyasi Warung
Kewajiban Konsinyasi BRILink
Injeksi Aktif
```

## GET /laporan-keuangan/closing-selisih

Returns closing with differences.

## Rules

- Owner only default.
- Does not create transactions.
- Reads ledger and snapshots.
- Must not mix Warung/BRILink ledger.
