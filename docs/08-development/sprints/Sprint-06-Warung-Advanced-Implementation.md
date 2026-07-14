# Sprint 06 — Warung Advanced Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 06 keeps Warung and BRILink separated. Implemented Warung purchase and supplier debt core only.

Included:

- Purchase note model and items.
- Supplier debt per purchase note.
- Supplier debt payment.
- `WarungPurchaseService.createPurchase`.
- `WarungPurchaseService.payDebt`.
- Weighted-average HPP recalculation on purchase.
- Stock increase and stock movement for purchase.
- Cash ledger for paid-cash purchase and debt payment.
- Audit log for purchase and debt payment.
- Warung-only permissions:
  - `warung.purchase.create`
  - `warung.debt.pay`
- Placeholder routes:
  - `/warung/purchases`
  - `/warung/debts`
- Self-check script:
  - `npm run check:sprint06`

## Atomic Rules

`createPurchase` runs in one Prisma transaction:

1. validate WARUNG permission/domain
2. validate supplier partner
3. allocate invoice discount
4. generate purchase number
5. create purchase
6. create purchase items
7. update stock and HPP
8. create stock movement
9. create cash ledger for paid-cash purchase, or supplier debt for debt purchase
10. create audit log

`payDebt` runs in one Prisma transaction:

1. validate WARUNG permission/domain
2. validate debt status and remaining amount
3. generate payment number
4. create debt payment
5. update paid/remaining/status
6. create cash ledger
7. create audit log

## Deliberate Limits

Not included in Sprint 06:

- Purchase cancellation/reversal.
- Debt payment cancellation.
- Retur expired.
- Consignment.
- Closing Warung.
- Route handlers/API implementation.
- Final form UI.
- Decimal quantity conversion beyond base unit.

Qty purchase is intentionally limited to integer base quantity in this sprint so HPP math stays safe under current BigInt money model.
