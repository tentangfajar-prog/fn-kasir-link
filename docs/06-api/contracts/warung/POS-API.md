# Warung POS API Contract

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## GET /warung/pos/catalog

Return POS catalog optimized for mobile.

### Permission

```text
warung.pos.use
```

### Response

```json
{
  "success": true,
  "data": {
    "categories": [],
    "favorites": [],
    "items": [
      {
        "id": "uuid",
        "name": "Kopi Seduh",
        "price": 5000,
        "category": "Kopi",
        "is_favorite": true,
        "item_type": "recipe",
        "stock_status": "available",
        "badge": null,
        "barcode": null
      }
    ]
  }
}
```

### Rules

- Only active sellable items.
- Include stock/component status.
- Include consignment badge.
- Must be fast for HP.

## POST /warung/pos/validate-item

Validate item before adding to cart.

### Request

```json
{
  "sellable_item_id": "uuid",
  "qty": 1
}
```

### Rules

- Validate normal stock.
- Validate recipe components.
- Validate bundle components.
- Validate consignment stock.
- No stock minus.

## POST /warung/pos/hold

Create hold transaction.

### Rules

- Hold does not reduce stock.
- Hold does not create ledger.
- Hold is not sales.

## GET /warung/pos/holds

List active holds.

## POST /warung/pos/checkout

Checkout transaction.

### Permission

```text
warung.pos.use
```

### Request

```json
{
  "items": [
    {
      "sellable_item_id": "uuid",
      "qty": 2,
      "discount": {
        "type": "amount",
        "value": 0
      }
    }
  ],
  "transaction_discount": {
    "type": "amount",
    "value": 0
  },
  "payment_method_id": "uuid",
  "cash_received_amount": 20000,
  "hold_id": null
}
```

### Atomic Side Effects

```text
create warung_sales
create warung_sale_items
create stock movements
create cash or non-cash ledger
create consignment sale/payable if needed
create audit log
```

### Errors

```text
KAS_LACI_NOT_OPENED
INSUFFICIENT_STOCK
COMPONENT_NOT_ENOUGH
PAYMENT_AMOUNT_LESS_THAN_TOTAL
PAYMENT_METHOD_INACTIVE
PERMISSION_DENIED
```

## POST /warung/sales/:id/cancel

Cancel sale via reversal.

### Permission

```text
transaction.cancel
```

### Request

```json
{
  "reason": "Salah input item"
}
```

### Rules

- Original sale remains.
- Reversal transaction created.
- Stock and ledger reversed.
- If consignment already paid, block until payment reversal.
