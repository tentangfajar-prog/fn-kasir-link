# SettingsService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Mengelola settings sistem.

## Main Methods

```ts
getSettings(ctx, scope)
updateSettings(ctx, scope, input)
```

## Rules

- Sensitive settings require permission and confirmation.
- Changes Audit Log required.
- Settings should not store transactional data.
- Structured business data must use proper tables.

## Scopes

```text
global
warung
brilink
absensi
print
system
```
