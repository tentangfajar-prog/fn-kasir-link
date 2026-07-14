# Warung Consignment API Contract

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## POST /warung/consignment/entries

Create consignment entry.

```json
{
  "partner_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "qty": 50,
      "unit_id": "uuid",
      "selling_price_amount": 8000,
      "setor_price_amount": 5000
    }
  ]
}
```

Rules:
- Stock consignment increases.
- No payable created yet.
- Not purchase.
- Not HPP.

## POST /warung/consignment/payments

Pay consignment payable.

```json
{
  "partner_id": "uuid",
  "cash_source": "kas_laci",
  "items": [
    {
      "consignment_sale_id": "uuid",
      "qty_paid_base": 4
    }
  ]
}
```

Rules:
- Pay only sold unpaid qty.
- Partial by qty.
- Payment is not expense.
- FIFO allocation.

## POST /warung/consignment/returns

Return unsold consignment.

Rules:
- Only unsold stock.
- Reduces consignment stock.
- No cash/profit/payable change.
