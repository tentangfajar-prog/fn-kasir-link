# FN Kasir Link

Aplikasi web internal untuk dua domain operasional terpisah: Warung dan BRILink.

> Developer note: baca `START-HERE-FOR-GCLAU.md` sebelum development.

## Sprint 00

Foundation only:

- Next.js + TypeScript
- Tailwind CSS
- shadcn/ui base config/components
- Prisma + PostgreSQL config
- AppShell, Sidebar, Topbar
- Route placeholders

## Run locally

```bash
npm install --include=dev
cp .env.example .env
# optional local PostgreSQL:
# cp docker-compose.example.yml docker-compose.yml && docker compose up -d
npm run prisma:generate
npm run dev
```

Buka `http://localhost:3000`.

## Scope boundary

Sprint 00 belum membangun POS checkout, transaksi BRILink, ledger, closing, chart dashboard, absensi QR, atau permission engine penuh.
