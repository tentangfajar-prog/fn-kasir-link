# Auth API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## POST /auth/login

Login user.

### Request

```json
{
  "username": "owner",
  "password": "secret"
}
```

### Success

```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Owner",
      "role": "Owner",
      "must_change_password": false
    }
  }
}
```

### Errors

```text
INVALID_CREDENTIALS
USER_INACTIVE
PASSWORD_CHANGE_REQUIRED
```

### Side Effects

```text
login_history created
device_history updated
```

## POST /auth/logout

Logout current user.

### Side Effects

```text
audit log optional
session cleared
```

## POST /auth/change-password

Change own password.

### Request

```json
{
  "old_password": "old",
  "new_password": "new-strong-password"
}
```

### Rules

- User must be authenticated.
- New password must meet minimum security rule.
- Password stored as hash.
- Plaintext password never stored.

## POST /auth/reset-password

Reset another user password.

### Permission

```text
settings.user.reset_password
```

or equivalent permission.

### Request

```json
{
  "user_id": "uuid"
}
```

### Success

```json
{
  "success": true,
  "message": "Password sementara dibuat.",
  "data": {
    "temporary_password": "one-time-visible-password"
  }
}
```

### Rules

- Temporary password shown only once.
- User must change password on next login.
- Cannot reset Owner password unless actor is Owner.
- Audit Log required.
