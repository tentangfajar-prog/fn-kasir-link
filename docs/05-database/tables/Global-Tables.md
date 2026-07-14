# Global Tables

Status: **FINAL V1 BASELINE**

## Summary

users, roles, permissions, partners, settings, document_sequences, audit_logs, attachments, print_logs, login_history, device_history.

## Rules

- UUID primary key.
- Audit Log untuk aksi penting.
- Soft delete untuk master data.
- Snapshot untuk transaksi.
- Atomic untuk proses uang/stok.
