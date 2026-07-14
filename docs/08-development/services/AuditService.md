# AuditService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Mencatat semua aksi penting.

## Main Methods

```ts
write(tx, {
  ctx,
  domain,
  module,
  action,
  entityType,
  entityId,
  entityNo,
  oldValue,
  newValue
})
```

## Required For

- Login/logout
- User changes
- Reset password
- Permission changes
- Transactions
- Reversals
- Purchases
- Expenses
- Debt payment
- Consignment payment
- Stock opname
- Retur expired
- Dana di Luar
- Injeksi
- Closing
- Adjustment
- Print/reprint
- Settings changes

## Rule

For sensitive actions, Audit Log is part of DB transaction.

If audit fails, action fails. Ya, audit tidak boleh cuma jadi dekorasi di halaman admin.
