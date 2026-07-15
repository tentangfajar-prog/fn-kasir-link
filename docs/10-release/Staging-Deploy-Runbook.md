# Staging Deploy Runbook

Target domain: `kasirlink.nairagroup.id`

Status: **staging only — do not use production database**

## Server Requirements

- Node.js 22+ or 24+
- npm
- PM2, hPanel Node.js App, or equivalent process runner
- MySQL/MariaDB database
- hPanel Node.js App routing or reverse proxy from `kasirlink.nairagroup.id` to app port `3000`

## Required Env

Copy `.env.staging.example` to `.env` on staging server and fill real values.

```env
NODE_ENV=production
DATABASE_URL=mysql://USER:***@localhost:3306/fn_kasir_link_staging
NEXT_PUBLIC_APP_NAME=FN Kasir Link Staging
UPLOAD_STORAGE_PATH=/home/u779371263/apps/fn-kasir-link/storage/uploads
BARCODE_CAMERA_ENABLED=true
SEED_OWNER_PASSWORD=replace-with-staging-owner-password
```

## First Deploy

```bash
git clone https://github.com/tentangfajar-prog/fn-kasir-link.git
cd fn-kasir-link
npm ci
npm run prisma:generate
npm run build
npm run db:migrate:deploy
npm run prisma:seed
pm2 start ecosystem.config.cjs
pm2 save
```

## Artifact Deploy For Shared Hosting

If shared hosting cannot build Next.js because of resource limits, build locally/CI and upload `.next/standalone`, `.next/static`, `public` if present, `prisma`, and `.env` to the staging app folder. Start with:

```bash
source /opt/alt/alt-nodejs22/enable
cd /home/u779371263/apps/fn-kasir-link-staging
PORT=3000 HOSTNAME=127.0.0.1 node server.js
```

## Update Deploy

```bash
cd fn-kasir-link
git pull --ff-only
npm ci
npm run prisma:generate
npm run build
npm run db:migrate:deploy
pm2 restart fn-kasir-link-staging
```

## Reverse Proxy Example

Point `kasirlink.nairagroup.id` to staging server, then proxy to local app port `3000`.

```nginx
server {
  server_name kasirlink.nairagroup.id;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Smoke Test

Run after deploy:

- Open `/auth/login`.
- Login owner.
- Open `/dashboard`.
- Open `/warung/pos` and submit checkout test.
- Open `/brilink/transactions` and submit transaction test.
- Open closing preview for Warung and BRILink.
- Open `/laporan-keuangan`.
- Test `/absensi` status.
- Print one test receipt.

## Rollback

```bash
cd fn-kasir-link
git log --oneline -5
git checkout <previous-commit>
npm ci
npm run prisma:generate
npm run build
pm2 restart fn-kasir-link-staging
```

If migration changed schema/data, restore staging DB backup instead of manual table edits.
