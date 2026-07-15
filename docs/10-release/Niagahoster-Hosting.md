# Niagahoster Hosting

Target paid hosting path for `kasirlink.nairagroup.id`.

## Runtime

- Hosting: Niagahoster/Hostinger hPanel
- App runtime: Node.js App in hPanel, Node 22
- Database: MySQL/MariaDB from hPanel
- Domain: `kasirlink.nairagroup.id`

## hPanel setup

Create MySQL database in hPanel:

```text
Databases → MySQL Databases → Create Database
```

Keep these values:

```text
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST usually localhost
```

Create Node.js app in hPanel if available:

```text
Website → Advanced → Node.js
```

Use:

```text
Node version: 22
Application root: /home/u779371263/apps/fn-kasir-link
Application URL: kasirlink.nairagroup.id
Application startup file: server.js
```

## Environment Variables

Set in Node.js App environment or `.env` inside app root:

```env
NODE_ENV=production
DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME
NEXT_PUBLIC_APP_NAME=FN Kasir Link
UPLOAD_STORAGE_PATH=/home/u779371263/apps/fn-kasir-link/storage/uploads
BARCODE_CAMERA_ENABLED=true
SEED_OWNER_PASSWORD=***
```

## Build artifact

Build outside shared hosting, then upload `.next/standalone` output to app root. Shared hosting can run Node, but direct build may fail from resource/thread limits.

## First database setup

After upload and env setup:

```bash
npm run db:migrate:deploy
npm run prisma:seed
```

Run seed once only.

## Smoke test

Before production use:

- `/auth/login`
- owner login
- `/dashboard`
- `/warung/pos`
- `/brilink/transactions`
- `/warung/closing`
- `/brilink/closing`
- `/laporan-keuangan`
- `/absensi`

## Known constraints

SSH alone cannot create hPanel Node.js application routing. If Node.js app is not visible in hPanel, ask hosting support to enable Node.js App for this hosting plan or upgrade to a plan that supports Node.js applications.
