# BRILink Transaction API Contract

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## GET /brilink/transactions/new-context

Return current Cash/Saldo and active transaction types.

## POST /brilink/transactions/preview

Calculate tariff and movement preview.

```json
{
  "transaction_type_id": "uuid",
  "nominal_amount": 1000000,
  "bank_category": "sesama_bri"
}
```

Response:

```json
{
  "fee_amount": 5000,
  "cash_in_amount": 1005000,
  "cash_out_amount": 0,
  "saldo_in_amount": 0,
  "saldo_out_amount": 1000000
}
```

## POST /brilink/transactions

Create BRILink transaction.

```json
{
  "transaction_type_id": "uuid",
  "nominal_amount": 1000000,
  "bank_category": "sesama_bri",
  "reference_no": "ABC123",
  "target_account_no": "123xxx",
  "target_phone_no": null,
  "target_name": "Budi",
  "provider_name": null,
  "customer_name": "Pelanggan",
  "note": null
}
```

Rules:
- Fee from tariff.
- Fee read-only.
- Validate Cash/Saldo enough.
- Create cash ledger, saldo ledger, fee ledger.
- Save snapshot.
- Audit Log.

## POST /brilink/transactions/:id/cancel

Cancel transaction.

Rules:
- Owner default.
- Reversal created.
- Cash/Saldo/Fee reversed.
- Old closing remains As-Closed.
