# Warung Tables

Status: **FINAL V1 BASELINE**

## Summary

produk, item jual, satuan, POS, pembelian, hutang, pengeluaran, konsinyasi, stock opname, retur expired, closing.

## Rules

- UUID primary key.
- Audit Log untuk aksi penting.
- Soft delete untuk master data.
- Snapshot untuk transaksi.
- Atomic untuk proses uang/stok.
