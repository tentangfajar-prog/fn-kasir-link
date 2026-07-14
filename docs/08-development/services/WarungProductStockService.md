# WarungProductStockService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Mengelola produk stok, item jual, satuan, konversi, komposisi, HPP, stock movement.

## Main Methods

```ts
createStockProduct(ctx, input)
updateStockProduct(ctx, id, input)
createSellableItem(ctx, input)
updateSellableItem(ctx, id, input)
setComposition(ctx, sellableItemId, components)
createUnitConversion(ctx, input)
calculateWeightedAverageHpp(oldStock, oldHpp, qtyIn, purchaseHpp)
createStockMovement(tx, input)
```

## Rules

- Stok disimpan dalam satuan dasar.
- HPP memakai rata-rata tertimbang.
- Produk yang sudah dipakai tidak bisa hard delete.
- Satuan dasar tidak boleh diubah jika produk sudah dipakai.
- Konversi yang sudah dipakai harus versioning.
- Komposisi disnapshot saat transaksi.

## Error Cases

```text
BASE_UNIT_LOCKED
CONVERSION_ALREADY_USED
DUPLICATE_BARCODE
DUPLICATE_SKU
INVALID_COMPONENT
```
