# Migration Plan V1

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Purpose

Dokumen ini menjelaskan urutan migration database untuk FN Kasir Link V1.

Migration harus dibuat bertahap agar mudah diuji dan rollback secara development.

## Prisma Commands

Development:

```bash
npx prisma migrate dev
```

Production/staging:

```bash
npx prisma migrate deploy
```

Catatan:

```text
migrate dev hanya untuk development.
migrate deploy untuk staging/production.
```

## Migration Order

### 0001_init_global_auth

Create:

```text
users
roles
permissions
role_permissions
user_permission_overrides
login_history
device_history
audit_logs
```

Seed:

```text
Owner role
Admin role
Kasir Warung role
Petugas BRILink role
Owner user
Baseline permissions
```

### 0002_global_master_settings

Create:

```text
partners
settings
document_sequences
attachments
print_logs
```

Seed:

```text
system.timezone = Asia/Jakarta
system.currency = IDR
default print settings
```

### 0003_warung_master_product_stock

Create:

```text
warung_units
warung_product_categories
warung_stock_products
warung_product_unit_conversions
warung_sellable_items
warung_item_compositions
warung_stock_movements
warung_payment_methods
```

Seed:

```text
PCS, Dus, Pack, Renceng, Gram, KG, ML, Liter, Botol, Sachet, Porsi, Cup, Bungkus
Makanan, Minuman, Kopi, Rokok, Snack, Seduh, Paket, Konsinyasi, Lainnya
Tunai, QRIS, DANA, SPay, Transfer
```

### 0004_warung_pos_sales

Create:

```text
warung_sales
warung_sale_items
warung_cash_ledger
warung_non_cash_ledger
```

### 0005_warung_purchase_expense_debt

Create:

```text
warung_purchases
warung_purchase_items
warung_supplier_debts
warung_supplier_debt_payments
warung_expense_categories
warung_expenses
```

Seed:

```text
Gas, Galon, Listrik, Ongkir, Transport, Parkir, Plastik, Kebersihan, Peralatan, Lainnya
```

### 0006_warung_consignment_stockopname_closing

Create:

```text
warung_consignment_products
warung_consignment_entries
warung_consignment_entry_items
warung_consignment_sales
warung_consignment_payments
warung_consignment_payment_items
warung_consignment_returns
warung_consignment_return_items
warung_closings
```

Stock opname and expired return tables should be added here or split into:

```text
0006a_warung_stock_opname
0006b_warung_expired_return
```

If complexity grows, split them. Database migrations are not a contest in who can cram more tables into one file.

### 0007_brilink_master_tariff

Create:

```text
brilink_cash_saldo_templates
brilink_transaction_types
brilink_tariff_groups
brilink_tariff_ranges
```

Seed:

```text
Transfer
Setor Tunai
Tarik Tunai
Top Up
Default Cash/Saldo templates
```

### 0008_brilink_transactions_ledgers

Create:

```text
brilink_transactions
brilink_cash_ledger
brilink_saldo_ledger
brilink_fee_ledger
```

### 0009_brilink_temporary_funds

Create:

```text
brilink_dana_luar
brilink_dana_luar_returns
brilink_injections
brilink_injection_returns
```

### 0010_brilink_consignment_closing

Create:

```text
brilink_consignment_products
brilink_consignment_entries
brilink_consignment_entry_items
brilink_consignment_sales
brilink_consignment_payments
brilink_consignment_payment_items
brilink_consignment_returns
brilink_consignment_return_items
brilink_closings
```

### 0011_attendance

Create:

```text
attendance_settings
attendance_qr_tokens
attendance_records
attendance_corrections
```

Seed:

```text
default attendance settings
```

### 0012_financial_adjustments_reporting

Create:

```text
financial_adjustments
```

Optional reporting views/cache:

```text
daily_summary_views
monthly_summary_views
```

## Migration Rules

- Commit migration files to Git.
- Never edit applied migrations.
- Do not use `db push` for production.
- Use `migrate dev` in local development.
- Use `migrate deploy` in staging/production.
- Backup before production migration.
- Run smoke tests after migration.

## Related Documents

- docs/05-database/prisma/Prisma-Schema-Draft-V1.md
- docs/08-development/Migration-Guide.md
- docs/09-testing/Smoke-Test-Checklist.md
