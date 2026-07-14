# Error Response Standard

Status: **FINAL V1 BASELINE**

## Standard Error

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Pesan manusiawi.",
  "details": {},
  "field_errors": {}
}
```

## Examples

Stok tidak cukup:

```json
{
  "success": false,
  "code": "INSUFFICIENT_STOCK",
  "message": "Stok Cup tidak cukup.",
  "details": {
    "product": "Cup",
    "available": 0,
    "required": 1
  }
}
```

Saldo tidak cukup:

```json
{
  "success": false,
  "code": "INSUFFICIENT_SALDO",
  "message": "Saldo BRILink tidak cukup.",
  "details": {
    "available": 700000,
    "required": 1000000
  }
}
```
