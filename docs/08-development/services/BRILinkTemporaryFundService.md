# BRILinkTemporaryFundService

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## Purpose

Mengelola Dana di Luar dan Injeksi.

## Main Methods

```ts
createDanaLuar(ctx, input)
returnDanaLuar(ctx, danaLuarId, input)
cancelDanaLuar(ctx, id, reason)

createInjection(ctx, input)
returnInjection(ctx, injectionId, input)
cancelInjection(ctx, id, reason)
```

## Dana di Luar Rules

- Uang BRILink keluar sementara.
- Source Cash/Saldo.
- Not expense.
- Return can be partial.
- Return to Cash/Saldo.
- Status Dikembalikan if remaining 0.

## Injeksi Rules

- Dana tambahan sementara.
- Target Cash/Saldo.
- Not revenue.
- Not permanent capital.
- Return can be partial.
- Return from Cash/Saldo.

## Atomic Required

All create/return/cancel operations atomic.
