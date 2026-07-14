# BRILink Dana di Luar & Injeksi API Contract

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## POST /brilink/dana-luar

Create Dana di Luar.

```json
{
  "borrower_name": "Pak A",
  "nominal_amount": 2000000,
  "source_account": "cash",
  "notes": "Pinjaman sementara"
}
```

Rules:
- Source Cash/Saldo must be enough.
- Not expense.
- Status active.
- Ledger created.

## POST /brilink/dana-luar/:id/returns

Return Dana di Luar partially.

```json
{
  "return_amount": 500000,
  "return_to_account": "cash"
}
```

Rules:
- Return <= remaining.
- Can return to Cash/Saldo.
- If remaining 0, status Dikembalikan.

## POST /brilink/injections

Create injection.

```json
{
  "fund_provider_name": "Owner",
  "nominal_amount": 5000000,
  "target_account": "saldo"
}
```

Rules:
- Not revenue.
- Not permanent capital.
- Status active.

## POST /brilink/injections/:id/returns

Return injection partially.

Rules:
- Return <= remaining.
- Return from Cash/Saldo.
- Source must be enough.
