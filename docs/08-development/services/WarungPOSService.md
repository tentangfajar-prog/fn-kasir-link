# WarungPOSService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Menangani POS Warung, validasi stok, checkout, hold, dan reversal.

## Main Methods

```ts
getCatalog(ctx)
validateItem(ctx, input)
createHold(ctx, input)
getHolds(ctx)
checkout(ctx, input)
cancelSale(ctx, saleId, reason)
```

## Permission

```text
warung.pos.use
transaction.cancel for cancellation
```

## Checkout Atomic Flow

```text
Require WARUNG domain
Check Kas Laci open
Validate cart
Validate stock/components/consignment
Validate discount permission
Validate payment
Generate WRG document number
Create warung_sales
Create warung_sale_items
Create stock movements
Update stock cache
Create cash/non-cash ledger
Create consignment sale/payable if needed
Create audit log
Commit
```

## Stock Rules

- Normal item checks stock product.
- Recipe checks all components.
- Bundle checks all components.
- Consignment checks consignment stock.
- No stock minus.

## Error Cases

```text
KAS_LACI_NOT_OPENED
INSUFFICIENT_STOCK
COMPONENT_NOT_ENOUGH
CONSIGNMENT_STOCK_NOT_ENOUGH
PAYMENT_AMOUNT_LESS_THAN_TOTAL
PAYMENT_METHOD_INACTIVE
DISCOUNT_NOT_ALLOWED
```

## Related API

```text
docs/06-api/contracts/warung/POS-API.md
```
