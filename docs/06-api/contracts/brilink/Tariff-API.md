# BRILink Tariff API Contract

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## GET /brilink/transaction-types

List transaction types.

## POST /brilink/transaction-types

Create type.

Rules:
- Owner default.
- Template Cash/Saldo required.
- Used type cannot be hard deleted.

## POST /brilink/tariff-groups

Create tariff group.

## POST /brilink/tariff-ranges

Create tariff range.

```json
{
  "tariff_group_id": "uuid",
  "min_amount": 0,
  "max_amount": 500000,
  "fee_amount": 5000
}
```

Rules:
- No overlap.
- Inclusive range.
- Changes apply next transactions only.
- Old transactions keep snapshot.
