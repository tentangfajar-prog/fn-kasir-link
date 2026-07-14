# Sprint 04 Implementation Notes — POS Warung

Status: **IN PROGRESS**

## Scope implemented

- POS schema foundation:
  - WarungPaymentMethod
  - WarungSale
  - WarungSaleItem
  - WarungCashLedger
  - WarungNonCashLedger
- WarungPosService:
  - catalog
  - validate item
  - checkout
- Checkout is atomic:
  - generate document number
  - create sale
  - create sale items
  - reduce stock / components
  - create stock movements
  - create cash or non-cash ledger
  - create audit log
- Permission/domain required:
  - warung.pos.use
  - WARUNG domain
- Payment validation:
  - inactive method blocked
  - cash received must cover total
  - no stock minus
  - no component stock minus

## Still intentionally not implemented

- Hold transaction.
- Sale cancellation/reversal.
- Consignment POS handling.
- Full POS UI.
- Route handlers.
- Cash opening rules.
- Purchase/HPP recalculation.

## Notes

This is service-layer checkout core, not polished cashier UI. All important mutations happen in one transaction.
