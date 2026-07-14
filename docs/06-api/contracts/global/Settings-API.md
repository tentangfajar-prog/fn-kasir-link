# Settings API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## GET /settings

Get grouped settings.

### Query

```text
scope=global|warung|brilink|absensi|print|system
```

## PUT /settings/:scope

Update settings in scope.

### Permission

```text
settings.system.manage
```

or domain-specific settings permission.

### Request Example

```json
{
  "pos.barcode.enabled": true,
  "pos.barcode.scan_modes": ["scanner", "camera"],
  "pos.receipt.enabled": true
}
```

### Rules

- Sensitive settings require Audit Log.
- Some settings require warning confirmation.
- Settings must not store structured transactional data.
