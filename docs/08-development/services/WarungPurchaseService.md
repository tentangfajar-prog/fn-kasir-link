# WarungPurchaseService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Menangani Nota Pembelian Warung, HPP, stok masuk, dan hutang supplier.

## Main Methods

```ts
createPurchase(ctx, input)
cancelPurchase(ctx, purchaseId, reason)
allocateInvoiceDiscount(items, invoiceDiscount)
calculatePurchaseHpp(item)
```

## Atomic Flow

```text
Require WARUNG domain
Validate supplier/payment status
Validate cash source if paid_cash
Generate WRG document number
Create purchase
Create purchase items
Update HPP
Create stock movements
Create cash ledger if paid_cash
Create supplier debt if supplier_debt
Create audit log
Commit
```

## Rules

- Pembelian tunai mengurangi kas sumber.
- Pembelian hutang membuat hutang per nota.
- Diskon pembelian memengaruhi HPP.
- Ongkir/transport masuk Pengeluaran, bukan HPP.
- Koreksi nota = cancel full + input ulang.

## Error Cases

```text
SUPPLIER_REQUIRED_FOR_DEBT
CASH_SOURCE_REQUIRED
INSUFFICIENT_CASH
INVALID_PURCHASE_ITEM
```
