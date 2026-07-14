# BRILinkTransactionService

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## Purpose

Menangani transaksi BRILink: Transfer, Setor Tunai, Tarik Tunai, Top Up, dan jenis tambahan.

## Main Methods

```ts
getNewTransactionContext(ctx)
preview(ctx, input)
create(ctx, input)
cancel(ctx, transactionId, reason)
```

## Permission

```text
brilink.transaction.create
transaction.cancel for cancellation
```

## Preview

Calculates:

```text
fee
cash_in
cash_out
saldo_in
saldo_out
fee_income
```

using tariff and template.

## Create Atomic Flow

```text
Require BRILINK domain
Validate transaction type
Find tariff
Calculate movement
Validate Cash/Saldo enough
Generate BRI document number
Create transaction
Create cash ledger
Create saldo ledger
Create fee ledger
Create audit log
Commit
```

## Rules

- Fee read-only from master tariff.
- No cash/saldo minus.
- Old transactions keep snapshot.
- Reversal if cancelled.
