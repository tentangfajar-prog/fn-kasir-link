# BRILink Tables

Status: **FINAL V1 BASELINE**

## Summary

jenis transaksi, tarif, transaksi, cash/saldo/fee ledger, dana luar, injeksi, konsinyasi, closing.

## Rules

- UUID primary key.
- Audit Log untuk aksi penting.
- Soft delete untuk master data.
- Snapshot untuk transaksi.
- Atomic untuk proses uang/stok.
