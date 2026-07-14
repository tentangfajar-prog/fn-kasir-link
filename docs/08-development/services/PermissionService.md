# PermissionService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Menghitung dan memvalidasi akses user berdasarkan:

```text
Role permissions
User overrides
Sensitive permission rules
Domain access
```

## Main Methods

```ts
getUserPermissions(userId)
hasPermission(ctx, code)
require(ctx, code)
canAccessDomain(ctx, domain)
requireDomain(ctx, domain)
isOwner(ctx)
```

## Rules

- Deny override stronger than allow.
- Owner has full access.
- Non-Owner cannot modify Owner permission.
- Admin cannot grant sensitive permission to self.
- Last Owner cannot be disabled/deleted.

## Errors

```text
FORBIDDEN
DOMAIN_FORBIDDEN
OWNER_LAST_ACCOUNT_PROTECTED
SENSITIVE_PERMISSION_SELF_GRANT_DENIED
```

## Audit

Permission changes must call AuditService.
