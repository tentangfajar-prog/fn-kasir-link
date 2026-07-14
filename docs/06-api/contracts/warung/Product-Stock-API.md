# Warung Product & Stock API Contract

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Products

### GET /warung/products

List stock products.

### POST /warung/products

Create stock product.

```json
{
  "name": "Teh Gelas",
  "base_unit_id": "uuid",
  "sku": "TG",
  "barcode": null,
  "min_stock_qty": 5
}
```

Rules:
- base_unit required.
- SKU/barcode unique if filled.
- Stock stored in base unit.

### PATCH /warung/products/:id

Update safe fields.

Rules:
- Cannot change base unit if product already used.
- Cannot delete used product permanently.

## Sellable Items

### GET /warung/sellable-items

List item jual.

### POST /warung/sellable-items

```json
{
  "item_type": "normal",
  "stock_product_id": "uuid",
  "category_id": "uuid",
  "name": "Teh Gelas",
  "selling_price_amount": 3000,
  "is_favorite": false,
  "sku": "TG-PCS",
  "barcode": "899xxx"
}
```

Rules:
- Barcode unique for active items.
- Active item appears in POS.
- Used item cannot be hard deleted.

## Composition

### POST /warung/sellable-items/:id/composition

```json
{
  "components": [
    {
      "stock_product_id": "uuid",
      "qty": 1,
      "unit_id": "uuid"
    }
  ]
}
```

Rules:
- Components only stock products.
- No consignment as component V1.
- Snapshot composition on sale.

## Stock Opname

### POST /warung/stock-opname

Create session.

### POST /warung/stock-opname/:id/post

Post session.

Rules:
- Owner only default.
- Changes stock qty only.
- Does not change HPP.
- Creates stock movements.
