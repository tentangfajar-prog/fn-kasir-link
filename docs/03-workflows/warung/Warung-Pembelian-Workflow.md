# Warung Pembelian Workflow

Status: **FINAL V1 BASELINE**

## Summary

Nota Pembelian → item → diskon → tunai/hutang → stok naik → HPP berubah.

## Required Rules

- Permission backend wajib dicek.
- Domain scope wajib dicek.
- Proses uang/stok wajib atomic.
- Snapshot dan Audit Log wajib untuk aksi penting.
