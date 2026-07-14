# Prisma and PostgreSQL Notes

Status: **DRAFT BASELINE**

## Purpose

Catatan implementasi database dengan Prisma dan PostgreSQL.

## Principles

- Schema must represent domain separation clearly.
- Use database migrations.
- Use foreign keys for important relations.
- Use indexes for reports and filters.
- Use transactions for money/stock workflows.
- Do not rely on cached balances as source of truth.

## Money

Use integer.

```text
Rp25.000 = 25000
```

## Quantity

Use Decimal for qty fields.

## Transactions

Use DB transaction for:

- POS checkout.
- BRILink transaction.
- Purchase.
- Expense.
- Payment.
- Closing.
- Reversal.
