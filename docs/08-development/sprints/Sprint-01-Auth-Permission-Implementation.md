# Sprint 01 Implementation Notes — Auth, User, Role, Permission, Audit Core

Status: **IN PROGRESS**

## Scope implemented

- Prisma auth/permission/audit core schema.
- Role model:
  - OWNER
  - ADMIN
  - KASIR_WARUNG
  - PETUGAS_BRILINK
- Permission model with sensitive flag.
- Role permission checklist model.
- User permission override model.
- Login history and device history model.
- Audit log model expanded for module/action/entity/old/new values.
- PermissionService core:
  - owner full access
  - deny/allow permission map
  - domain access guard
  - non-owner cannot modify Owner role
  - admin self sensitive grant blocked
- AuthService core:
  - login validation
  - password hash helper
  - login history
  - password change
  - audit write
- UserService core:
  - create user with temporary password
  - update user
  - deactivate user
  - last Owner protection
  - audit write inside transaction
- RolePermissionService core:
  - update role permissions
  - set user overrides
  - audit write inside transaction
- Seed script for base roles, permissions, and owner user.

## Still intentionally not implemented

- Full session/cookie handling.
- Real login UI form submit.
- Route handlers for Auth/User/Permission APIs.
- Production password policy beyond minimum validation.
- POS checkout.
- BRILink transaction.
- Dashboard chart.
- Closing.
- Absensi QR.

## Security notes

- Plaintext password is never stored.
- Temporary password is generated only at create/reset flow and intended to be shown once.
- Audit writes for sensitive auth/user/permission changes happen inside DB transaction where mutation exists.
- Owner last account cannot be deactivated.
