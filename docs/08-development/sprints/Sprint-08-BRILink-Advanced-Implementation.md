# Sprint 08 — BRILink Advanced Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 08 implements BRILink temporary funds only. Warung remains separate.

Included:

- Dana di Luar model.
- Dana di Luar return model.
- Injection model.
- Injection return model.
- `BrilinkTemporaryFundService` methods:
  - `createDanaLuar`
  - `returnDanaLuar`
  - `createInjection`
  - `returnInjection`
- Cash/saldo ledger integration.
- Partial returns.
- Status tracking:
  - `ACTIVE`
  - `PARTIAL`
  - `RETURNED`
  - `CANCELLED` reserved for future reversal/cancel flow.
- Permission:
  - `brilink.temporary_fund.manage`
- Placeholder route:
  - `/brilink/temporary-funds`
- Self-check script:
  - `npm run check:sprint08`

## Atomic Rules

`createDanaLuar` runs in one Prisma transaction:

1. validate `brilink.temporary_fund.manage`
2. validate BRILINK domain
3. validate cash/saldo enough
4. generate document number
5. create Dana di Luar
6. create cash/saldo OUT ledger
7. create audit log

`returnDanaLuar` runs in one Prisma transaction:

1. validate permission/domain
2. validate active Dana di Luar
3. validate return <= remaining
4. generate document number
5. create return row
6. update returned/remaining/status
7. create cash/saldo IN ledger
8. create audit log

`createInjection` runs in one Prisma transaction:

1. validate permission/domain
2. generate document number
3. create Injection
4. create cash/saldo IN ledger
5. create audit log

`returnInjection` runs in one Prisma transaction:

1. validate permission/domain
2. validate active Injection
3. validate return <= remaining
4. validate cash/saldo enough
5. generate document number
6. create return row
7. update returned/remaining/status
8. create cash/saldo OUT ledger
9. create audit log

## Deliberate Limits

Not included in Sprint 08:

- Cancel/reversal flow.
- BRILink consignment.
- BRILink closing.
- API route handlers.
- Final form UI.

These remain for later sprints.
