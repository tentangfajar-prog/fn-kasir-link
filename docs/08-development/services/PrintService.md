# PrintService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Mengatur cetak dan print log.

## Main Methods

```ts
printDocument(ctx, entityType, entityId, format)
recordPrintLog(tx, payload)
getPrintableData(ctx, entityType, entityId)
```

## Rules

- Print setting can enable/disable print.
- Reprint follows permission.
- Print failure must not cancel already saved transaction.
- Print/reprint creates Print Log.

## Printable

- POS receipt.
- BRILink transaction receipt.
- Closing Warung.
- Closing BRILink.
- Selected reports.
