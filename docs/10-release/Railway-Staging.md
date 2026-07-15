# Railway Staging

Target: `kasirlink.nairagroup.id`

## Services

- Web service: GitHub repo `tentangfajar-prog/fn-kasir-link`
- PostgreSQL service: Railway PostgreSQL

## Variables

Set on the **web service**, not only the PostgreSQL service.

```env
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_APP_NAME=FN Kasir Link Staging
UPLOAD_STORAGE_PATH=/tmp/fn-kasir-link/uploads
BARCODE_CAMERA_ENABLED=true
SEED_OWNER_PASSWORD=replace-with-staging-owner-password
```

Notes:
- Railway may expose the PostgreSQL reference with a different service name. Use the `DATABASE_URL` copied from Railway PostgreSQL if reference variable does not resolve.
- Do not use production database for staging.

## Deploy

`railway.json` now forces Dockerfile deploy, so Railway does not override commands with Nixpacks.

Dockerfile handles:

- install: `npm ci`
- build: `npm run prisma:generate && npm run build`
- start: `npm run db:migrate:deploy && npm start`
- healthcheck: `/auth/login`

## First Seed

Run once after first successful deploy:

```bash
npm run prisma:seed
```

Use Railway shell/job/one-off command if available.

## Custom Domain

After deploy is healthy:

1. Open web service Settings.
2. Add custom domain: `kasirlink.nairagroup.id`.
3. Copy the DNS target shown by Railway.
4. In Hostinger DNS, update `kasirlink` CNAME/A according to Railway instruction.
5. Wait for SSL active.

## Smoke Test

- `/auth/login`
- owner login
- `/dashboard`
- `/warung/pos`
- `/brilink/transactions`
- closing preview
- `/laporan-keuangan`
- `/absensi`
- print receipt
