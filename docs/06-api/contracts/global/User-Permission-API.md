# User & Permission API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## GET /users

List users.

### Permission

```text
settings.user.view
```

### Query

```text
keyword
role_id
status
page
limit
```

## POST /users

Create user.

### Permission

```text
settings.user.create
```

### Request

```json
{
  "name": "Rina",
  "username": "rina",
  "phone": "08123456789",
  "email": null,
  "role_id": "uuid",
  "status": "active"
}
```

### Rules

- Owner can create all roles.
- Admin with permission can create Kasir Warung and Petugas BRILink.
- Admin cannot create Owner.
- Admin cannot create Admin unless has `admin.create`.
- Audit Log required.

## PATCH /users/:id

Update user basic data.

### Rules

- Cannot edit Owner account unless actor is Owner.
- Cannot disable last Owner.
- User used in transactions should be deactivated, not hard deleted.

## POST /users/:id/deactivate

Deactivate user.

### Rules

- Cannot deactivate last Owner.
- Audit Log required.

## GET /permissions

List permission grouped by module.

## PUT /roles/:id/permissions

Update role permission checklist.

### Permission

```text
settings.permission.manage
```

### Request

```json
{
  "permissions": [
    { "code": "warung.pos.use", "allow": true },
    { "code": "brilink.transaction.create", "allow": false }
  ]
}
```

### Rules

- Non-Owner cannot modify Owner role.
- Sensitive permissions require confirmation in UI.
- Audit Log required.

## PUT /users/:id/permission-overrides

Set user permission overrides.

### Request

```json
{
  "overrides": [
    { "code": "warung.closing.create", "effect": "allow" },
    { "code": "brilink.transaction.create", "effect": "deny" }
  ]
}
```

### Rules

- Deny overrides Allow.
- Admin cannot grant sensitive permissions to self.
- Audit Log required.
