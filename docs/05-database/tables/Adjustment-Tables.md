# Adjustment Tables

Status: **FINAL V1 BASELINE**

## Summary

financial_adjustments dengan domain, account, amount, reason, source_closing_id.

## Rules

- UUID primary key.
- Audit Log untuk aksi penting.
- Soft delete untuk master data.
- Snapshot untuk transaksi.
- Atomic untuk proses uang/stok.
