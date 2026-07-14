# Warung Purchase, Expense, and Debt API Contract

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## POST /warung/purchases

Create purchase note.

```json
{
  "partner_id": "uuid",
  "payment_status": "supplier_debt",
  "cash_source": null,
  "invoice_discount": {
    "type": "amount",
    "value": 20000
  },
  "items": [
    {
      "stock_product_id": "uuid",
      "qty": 2,
      "unit_id": "uuid",
      "unit_price_amount": 48000,
      "discount_amount": 0
    }
  ]
}
```

Rules:
- Supplier required for debt.
- Cash source required for paid_cash.
- Purchase updates stock and HPP.
- Invoice discount allocated proportionally.
- Additional costs are expenses, not HPP.

## POST /warung/purchases/:id/cancel

Cancel purchase.

Rules:
- Owner default.
- Full reversal only.
- Stock/cash/debt reversed.
- Cannot partial edit purchase.

## POST /warung/expenses

Create expense.

```json
{
  "category_id": "uuid",
  "amount": 25000,
  "description": "Gas",
  "cash_source": "kas_laci"
}
```

Rules:
- Kasir default only Kas Laci.
- Kas Aman default Owner only.
- Category Lainnya requires description.
- Expense does not affect HPP.

## POST /warung/debts/:id/payments

Pay supplier debt.

```json
{
  "payment_amount": 200000,
  "cash_source": "kas_laci"
}
```

Rules:
- Debt is per purchase note.
- Payment can be partial.
- Payment is not expense.
- Cash source must be enough.
