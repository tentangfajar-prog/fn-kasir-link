# API Principles — FN Kasir Link

Status: **FINAL V1 BASELINE**

## Purpose

API/action layer menjaga kebenaran data. UI hanya membantu user, backend yang memastikan aturan bisnis benar.

## Every API Must

```text
1. Require authenticated user.
2. Check permission.
3. Check domain scope.
4. Validate input.
5. Use DB transaction for money/stock operations.
6. Create ledger/movement entries when needed.
7. Save snapshots.
8. Write Audit Log for sensitive actions.
9. Return human-readable errors.
```

## Response Standard

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Data berhasil disimpan."
}
```

Error:

```json
{
  "success": false,
  "code": "INSUFFICIENT_BALANCE",
  "message": "Saldo BRILink tidak cukup.",
  "details": {
    "available": 700000,
    "required": 1000000
  }
}
```

## Permission Naming

```text
domain.module.action
```

Examples:

```text
warung.pos.use
warung.purchase.create
warung.debt.pay
brilink.transaction.create
brilink.tariff.manage
financial_report.owner.view
attendance.qr.display
settings.permission.manage
```

## Atomic Operations

Atomic required for:

- POS checkout.
- BRILink transaction.
- Purchase.
- Expense.
- Debt payment.
- Consignment payment.
- Closing.
- Dana di Luar.
- Injeksi.
- Stock opname.
- Retur expired.
- Reversal.

## Smart Search API

```text
GET /api/search/products?q=
GET /api/search/partners?q=
GET /api/search/users?q=
GET /api/search/documents?q=
```

Return max 20 results unless specified.

## Chart API

Dashboard chart API should support:

```text
metric=pendapatan|profit|fee|transaction_count
mode=combined|split_domain
period=daily_current_vs_previous|monthly_year
year=YYYY
```

## Never Trust Frontend

Backend calculates:

- Fee.
- HPP.
- Profit.
- Cash movement.
- Saldo movement.
- Ledger entries.
- Stock movements.
