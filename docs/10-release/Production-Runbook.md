# Production Runbook

Status: **PREPARED — DO NOT DEPLOY WITHOUT OWNER APPROVAL**

## Golden Rules

- Backup database before migration.
- Do not use `prisma db push` in production.
- Use `prisma migrate deploy` for production migrations.
- Never commit real `.env` values.
- Run smoke tests after deploy.
- Keep Warung and BRILink data scopes separated.

## Preflight

```bash
npm install --include=dev
npm run check:rc
npm run preflight:production
```

## Deployment Steps

1. Confirm release commit.
2. Backup production database.
3. Pull release on staging first.
4. Install dependencies.
5. Run Prisma migration deploy: `npm run db:migrate:deploy`.
6. Run seed only if required and reviewed. Set `SEED_OWNER_PASSWORD` first in production.
7. Start app.
8. Run smoke test.
9. Check audit log and error log.
10. Promote to production only after staging passes.

## Migration Command

```bash
npm run db:migrate:deploy
```

## Smoke Test

- Owner login.
- Kasir Warung cannot access BRILink.
- Petugas BRILink cannot access Warung.
- Warung POS checkout.
- BRILink transaction.
- Warung closing preview/create.
- BRILink closing preview/create.
- Dashboard summary.
- Laporan Keuangan summary.
- Absensi status/check-in/check-out.
- Print log creates entry.

## Rollback Notes

- Code rollback: redeploy previous commit.
- DB rollback: restore from backup if migration is not reversible.
- Never manually edit production tables to fix failed migration.
