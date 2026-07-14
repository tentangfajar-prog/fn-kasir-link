# Warung Retur Expired Workflow

Status: **FINAL V1 BASELINE**

## Summary

Pilih supplier/produk expired → input qty/refund → stok turun → kas naik.

## Required Rules

- Permission backend wajib dicek.
- Domain scope wajib dicek.
- Proses uang/stok wajib atomic.
- Snapshot dan Audit Log wajib untuk aksi penting.
