# Reversal Workflow

Status: **FINAL V1 BASELINE**

## Summary

Transaksi asli tetap ada, sistem membuat pembalik, Audit Log wajib.

## Required Rules

- Permission backend wajib dicek.
- Domain scope wajib dicek.
- Proses uang/stok wajib atomic.
- Snapshot dan Audit Log wajib untuk aksi penting.
