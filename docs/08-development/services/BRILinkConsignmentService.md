# BRILinkConsignmentService

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## Purpose

Mengelola konsinyasi BRILink.

## Main Methods

```ts
createEntry(ctx, input)
sell(ctx, input)
payConsignor(ctx, input)
returnUnsold(ctx, input)
cancelSale(ctx, saleId, reason)
cancelPayment(ctx, paymentId, reason)
```

## Rules

- Entry increases consignment stock.
- Entry does not create payable.
- Sale defaults to Cash BRILink.
- Sale creates payable.
- Payment uses Cash BRILink.
- Payment based on sold unpaid qty.
- Return only unsold stock.
