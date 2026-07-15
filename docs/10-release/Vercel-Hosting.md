# Vercel Hosting

Recommended paid setup:

- App hosting: Vercel Pro
- Database: Neon paid PostgreSQL
- Domain: `kasirlink.nairagroup.id`

## Why

This app is Next.js, so Vercel removes custom server/build routing problems. Neon provides PostgreSQL without running a VPS.

## Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST/db?sslmode=require
NEXT_PUBLIC_APP_NAME=FN Kasir Link Staging
UPLOAD_STORAGE_PATH=/tmp/fn-kasir-link/uploads
BARCODE_CAMERA_ENABLED=true
SEED_OWNER_PASSWORD=replac…word
```

## Deploy

Import GitHub repo:

```text
tentangfajar-prog/fn-kasir-link
```

Branch:

```text
main
```

Vercel reads `vercel.json`:

```bash
npm ci
npm run prisma:generate && npm run build
```

## Migration

Do not run migrations inside request/startup. After Vercel deploy succeeds, run from a trusted machine with the same `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate:deploy
DATABASE_URL="postgresql://..." SEED_OWNER_PASSWORD="..." npm run prisma:seed
```

Run seed once only.

## Smoke Test

Before custom domain:

- Open Vercel URL `/auth/login`.
- Run migration.
- Run seed once.
- Login owner.
- Check `/dashboard`, `/warung/pos`, `/brilink/transactions`, `/laporan-keuangan`, `/absensi`.

## Custom Domain

Only after smoke test passes:

1. Add `kasirlink.nairagroup.id` in Vercel Domains.
2. Copy Vercel DNS instruction.
3. Update DNS in Hostinger/Niagahoster.
4. Wait for SSL active.
