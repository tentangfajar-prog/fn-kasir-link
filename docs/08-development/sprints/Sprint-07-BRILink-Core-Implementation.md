# Sprint 07 — BRILink Core Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 07 implements BRILink core only. Warung data remains separate.

Included:

- BRILink cash/saldo templates.
- BRILink transaction types.
- BRILink tariff groups.
- BRILink tariff ranges.
- BRILink transactions.
- BRILink cash ledger.
- BRILink saldo ledger.
- BRILink fee ledger.
- `BrilinkCoreService` methods:
  - `createTemplate`
  - `createTransactionType`
  - `createTariffGroup`
  - `createTariffRange`
  - `getNewTransactionContext`
  - `preview`
  - `create`
- Seed defaults:
  - Transfer
  - Setor Tunai
  - Tarik Tunai
  - Top Up
  - Default cash/saldo templates
  - Default tariff ranges
- Permissions:
  - `brilink.transaction.create`
  - `brilink.tariff.manage`
- Placeholder routes:
  - `/brilink/transactions`
  - `/brilink/tariffs`
- Self-check script:
  - `npm run check:sprint07`

## Atomic Transaction Flow

`BrilinkCoreService.create` runs in one Prisma transaction:

1. validate `brilink.transaction.create`
2. validate BRILINK domain
3. validate active transaction type
4. find active tariff group/range
5. calculate fee, cash movement, saldo movement
6. validate cash/saldo not minus
7. generate document number
8. create transaction
9. create cash ledger if needed
10. create saldo ledger if needed
11. create fee ledger
12. create audit log

## Tariff Rules

- Fee is read from master tariff, not UI input.
- Range is inclusive.
- Active tariff ranges cannot overlap in the same group.
- Old transactions keep snapshots.

## Deliberate Limits

Not included in Sprint 07:

- Transaction cancellation/reversal.
- Dana di luar.
- Injeksi saldo.
- Konsinyasi BRILink.
- Closing BRILink.
- Route handlers/API implementation.
- Final form UI.

These stay for later BRILink sprints.
