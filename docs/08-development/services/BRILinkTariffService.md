# BRILinkTariffService

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## Purpose

Mengelola jenis transaksi, template, dan tarif BRILink.

## Main Methods

```ts
createTransactionType(ctx, input)
updateTransactionType(ctx, id, input)
createTariffGroup(ctx, input)
createTariffRange(ctx, input)
findTariff(transactionTypeId, nominal, bankCategory)
validateNoOverlap(tariffGroupId, range)
```

## Rules

- Range inclusive.
- No overlap.
- No active duplicate range.
- Used tariff not edited destructively.
- Changes apply next transactions only.

## Error Cases

```text
TARIFF_NOT_FOUND
TARIFF_RANGE_OVERLAP
TRANSACTION_TYPE_INACTIVE
```
