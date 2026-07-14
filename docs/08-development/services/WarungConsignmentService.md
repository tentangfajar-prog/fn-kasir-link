# WarungConsignmentService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Mengelola konsinyasi Warung.

## Main Methods

```ts
createEntry(ctx, input)
sellFromPOS(tx, sale, saleItems)
payConsignor(ctx, input)
returnUnsold(ctx, input)
cancelPayment(ctx, paymentId, reason)
cancelReturn(ctx, returnId, reason)
```

## Rules

- Entry increases consignment stock.
- Entry does not create payable.
- Payable appears when item sold.
- Payment based on sold unpaid qty.
- Payment can be partial by qty.
- FIFO allocation.
- Return only unsold stock.
- Payment is not expense.

## Error Cases

```text
CONSIGNMENT_STOCK_NOT_ENOUGH
PAY_QTY_EXCEEDS_UNPAID
CASH_SOURCE_NOT_ENOUGH
CANNOT_RETURN_SOLD_ITEM
```
