# Absensi Tables

Status: **FINAL V1 BASELINE**

## Summary

attendance_settings, attendance_qr_tokens, attendance_records, attendance_corrections.

## Rules

- UUID primary key.
- Audit Log untuk aksi penting.
- Soft delete untuk master data.
- Snapshot untuk transaksi.
- Atomic untuk proses uang/stok.
