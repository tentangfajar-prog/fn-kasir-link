# Sprint 12 — API Route Wiring Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 12 wires key service-layer methods to Next.js route handlers.

Included:

- `ApiSession` model for httpOnly cookie sessions.
- `requireAuth()` implementation backed by DB session token hash.
- Common API response/error helper.
- Auth routes:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
  - `POST /api/auth/change-password`
- Warung routes:
  - `GET /api/warung/pos/catalog`
  - `POST /api/warung/pos/checkout`
  - `POST /api/warung/expenses`
  - `GET /api/warung/finance/daily-summary`
  - `POST /api/warung/purchases`
  - `POST /api/warung/debts/:id/pay`
- BRILink routes:
  - `GET /api/brilink/transactions/context`
  - `POST /api/brilink/transactions/preview`
  - `POST /api/brilink/transactions`
  - temporary fund create/return routes
- Absensi routes:
  - `GET /api/absensi/status`
  - `GET /api/absensi/display-qr`
  - `POST /api/absensi/check-in`
  - `POST /api/absensi/check-out`
  - `POST /api/absensi/:id/correct`
- Dashboard/report routes:
  - dashboard summary/daily/monthly chart
  - laporan keuangan summary/assets/debts
- Self-check script:
  - `npm run check:sprint12`

## Safety Rules

- Route handlers call service layer; no business math in route handlers.
- Session cookie is httpOnly.
- Session token is stored as SHA-256 hash.
- Protected routes call `requireAuth()`.
- Errors use structured JSON.

## Deliberate Limits

Not included in Sprint 12:

- Full API coverage for every admin/master operation.
- CSRF token flow.
- Rate limiting.
- Browser E2E test.
- Final UI integration.
