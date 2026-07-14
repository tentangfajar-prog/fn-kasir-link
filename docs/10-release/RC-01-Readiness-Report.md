# RC-01 Readiness Report

Status: **INTERNAL RELEASE CANDIDATE**

## Current Scope

Implemented through Sprint 11:

- Sprint 00 Foundation
- Sprint 01 Auth & Permission Core
- Sprint 02 Global Master
- Sprint 03 Warung Product & Stock
- Sprint 04 POS Warung Core
- Sprint 05 Warung Finance Daily
- Sprint 06 Warung Purchase & Supplier Debt
- Sprint 07 BRILink Core
- Sprint 08 BRILink Temporary Funds
- Sprint 09 Dashboard & Reports
- Sprint 10 Absensi & Hardening
- Sprint 11 Release Candidate checks

## RC Gate

Run:

```bash
npm run check:rc
```

This runs:

- Prisma generate
- TypeScript check
- Next build
- ESLint
- Sprint 01–11 self-checks

## Security/Separation Checks

- Git remote must stay plain HTTPS without token.
- Tracked files must not contain GitHub PAT pattern.
- Tracked files must not contain known server password pattern.
- Kasir Warung must not have BRILink permissions.
- Petugas BRILink must not have Warung permissions.
- Basic security headers must exist.

## Known Limits Before Production

Still not production-ready until these are finished:

- Real route handlers/API wiring.
- Real UI forms beyond placeholders.
- Auth session/cookie wiring.
- Closing Warung and BRILink services.
- Cancel/reversal flows.
- Consignment flows.
- Print/reprint log flows.
- Production migrations generated and tested.
- Backup/restore tested.
- Full end-to-end browser smoke test.

## Production Migration Rule

Do not use `prisma db push` in production.

Use:

```bash
prisma migrate deploy
```

after backup and migration testing.
