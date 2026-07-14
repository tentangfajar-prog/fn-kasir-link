# Konsinyasi Warung

Status: **FINAL V1 BASELINE**

## Scope

Barang titipan Warung, kewajiban muncul saat laku, pembayaran berdasarkan qty, retur barang belum laku.

## Core Rules

- Domain mengikuti menu masing-masing.
- Semua aksi penting masuk Audit Log.
- Semua transaksi uang/stok memakai ledger/snapshot.
- Koreksi memakai reversal, bukan edit langsung.
