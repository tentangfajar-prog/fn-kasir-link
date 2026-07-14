# Stock Opname

Status: **FINAL V1 BASELINE**

## Scope

Stock opname per produk dan tabel, stok sistem vs fisik, tidak mengubah HPP.

## Core Rules

- Domain mengikuti menu masing-masing.
- Semua aksi penting masuk Audit Log.
- Semua transaksi uang/stok memakai ledger/snapshot.
- Koreksi memakai reversal, bukan edit langsung.
