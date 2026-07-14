# Warung Konsinyasi Workflow

Status: **FINAL V1 BASELINE**

## Summary

Konsinyasi masuk → laku di POS → kewajiban → pembayaran penitip → retur sisa.

## Required Rules

- Permission backend wajib dicek.
- Domain scope wajib dicek.
- Proses uang/stok wajib atomic.
- Snapshot dan Audit Log wajib untuk aksi penting.
