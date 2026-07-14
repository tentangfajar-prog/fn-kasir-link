# Print Workflow

Status: **FINAL V1 BASELINE**

## Summary

Cetak/cetak ulang masuk Print Log, printer gagal tidak membatalkan transaksi.

## Required Rules

- Permission backend wajib dicek.
- Domain scope wajib dicek.
- Proses uang/stok wajib atomic.
- Snapshot dan Audit Log wajib untuk aksi penting.
