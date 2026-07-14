# Sprint 05 Implementation Notes — Warung Finance Daily

Status: **IN PROGRESS**

## Scope implemented

- Warung finance schema:
  - WarungExpenseCategory
  - WarungExpense
  - WarungCashTransfer
  - WarungCashLedger extension from Sprint 04
  - WarungNonCashLedger relation to payment method
- WarungFinanceService:
  - create expense category
  - create expense
  - transfer cash between Kas Laci and Kas Aman
  - daily summary
- Permission additions:
  - warung.finance.view
  - warung.expense.create
  - warung.cash.transfer
- Placeholders:
  - /warung/expenses
  - /warung/cash-transfer
  - /warung/finance

## Rules covered

- Pengeluaran creates OUT ledger from selected Warung cash account.
- Setoran aman is cash transfer: OUT from Kas Laci, IN to Kas Aman.
- Setoran aman is not expense.
- Mutations are atomic and write audit log.
- Service layer decides ledger entries and document numbers.

## Still intentionally not implemented

- Cancellation/reversal for expense or cash transfer.
- Closing Warung.
- Cash opening rules.
- Real UI forms.
- Route handlers.
- Attachments/bukti upload.
