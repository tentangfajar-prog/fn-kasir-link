# Prisma Schema Draft V1

Status: **DRAFT BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Purpose

Dokumen ini menjelaskan draft `schema.prisma` untuk FN Kasir Link V1.

File draft schema berada di:

```text
database/prisma/schema.prisma
```

## Important Note

Schema ini adalah **draft teknis**, bukan migration final production.

Sebelum dipakai untuk production:

1. Jalankan validasi Prisma.
2. Review relation yang polymorphic.
3. Review index.
4. Review naming convention.
5. Jalankan migration di database development.
6. Jalankan seed data.
7. Jalankan smoke test database.

## Key Design Decisions

### Money Uses BigInt

Nominal uang memakai `BigInt`.

Alasan:

- Rupiah bisa melewati batas aman Int 32-bit.
- Ledger dan laporan harus aman jangka panjang.
- `BigInt` tetap integer, sesuai prinsip uang tidak memakai floating point.

### Quantity Uses Decimal

Qty stok memakai `Decimal`.

Alasan:

- Ada satuan Gram, ML, KG, Liter.
- PCS/Botol/Bungkus tetap divalidasi integer di service layer.

### Domain Separation

Schema memiliki domain:

```text
GLOBAL
WARUNG
BRILINK
ABSENSI
SYSTEM
```

Warung dan BRILink tetap memiliki tabel operasional terpisah.

### Ledger Append-Only

Ledger tables:

```text
WarungCashLedger
WarungNonCashLedger
BrilinkCashLedger
BrilinkSaldoLedger
BrilinkFeeLedger
```

Ledger tidak boleh diedit langsung.

### Snapshot Fields

Banyak tabel menyimpan snapshot name/role/price/partner.

Alasan:

- Master data bisa berubah.
- Histori transaksi tidak boleh berubah.

## Known Draft Issues

### Polymorphic Ledger Relations

Beberapa ledger memakai `sourceType` dan `sourceId`. Prisma tidak mendukung polymorphic relation native secara sempurna.

Draft schema menandai beberapa relation sebagai indikatif. Implementasi final bisa memilih:

1. Polymorphic relation tanpa direct Prisma relation.
2. Ledger per source type.
3. Relasi nullable eksplisit per source.

Rekomendasi V1:

```text
Gunakan sourceType + sourceId tanpa foreign key Prisma untuk ledger polymorphic.
Validasi integritas dilakukan service layer.
```

Ini lebih sederhana untuk V1, tapi harus disiplin di service layer. Ya, database tidak bisa melindungi semua hal kalau kita memilih polymorphic. Maka service layer jangan tidur siang.

## Related Documents

- docs/05-database/Database-Principles.md
- docs/05-database/tables/Global-Tables.md
- docs/05-database/tables/Warung-Tables.md
- docs/05-database/tables/BRILink-Tables.md
- docs/05-database/tables/Absensi-Tables.md
