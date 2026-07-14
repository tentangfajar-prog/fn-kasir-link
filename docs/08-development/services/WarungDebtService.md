# WarungDebtService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Mengelola pembayaran hutang supplier per nota.

## Main Methods

```ts
payDebt(ctx, debtId, input)
cancelDebtPayment(ctx, paymentId, reason)
```

## Rules

- Hutang supplier per nota.
- Payment can be partial.
- Payment source Kas Laci/Kas Aman.
- Payment is not expense.
- Cash source must be enough.
- Status changes automatically.

## Atomic Flow

```text
Validate permission
Load debt
Validate amount <= remaining
Validate cash source enough
Generate WRG document number
Create payment
Update debt paid/remaining/status
Create cash ledger
Create audit log
Commit
```
