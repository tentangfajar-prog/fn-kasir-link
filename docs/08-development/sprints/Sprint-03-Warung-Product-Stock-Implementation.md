# Sprint 03 Implementation Notes — Warung Product & Stock

Status: **IN PROGRESS**

## Scope implemented

- Warung product/stock schema:
  - WarungUnit
  - WarungProductCategory
  - WarungStockProduct
  - WarungProductUnitConversion
  - WarungSellableItem
  - WarungItemComposition
  - WarungStockMovement
  - WarungStockOpname
  - WarungStockOpnameItem
- Permission additions:
  - warung.product.manage
  - warung.stock.view
  - warung.stock.opname
- WarungProductStockService:
  - create unit
  - create category
  - create stock product
  - update safe stock product fields
  - create sellable item
  - set composition
  - create stock opname draft
  - post stock opname with stock movements
- Stock movement remains service-owned. UI must not mutate stock directly.
- Stock opname changes stock quantity only; HPP unchanged.
- Placeholder pages:
  - /warung/products
  - /warung/sellable-items
  - /warung/stock-opname

## Still intentionally not implemented

- Purchase flow.
- HPP recalculation from purchase.
- POS checkout.
- Sale stock deduction.
- Retur expired.
- Full UI forms.
- Route handlers.

## Notes

This sprint prepares Warung product and stock foundation only. Money movement and purchase posting stay out until later sprint.
