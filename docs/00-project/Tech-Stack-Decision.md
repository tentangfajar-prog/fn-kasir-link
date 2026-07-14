# Tech Stack Decision — FN Kasir Link

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Purpose

Dokumen ini mengunci baseline stack teknologi untuk FN Kasir Link V1.

Stack dipilih untuk:

- Web app internal.
- POS Warung mobile-first.
- BRILink desktop-first.
- Dashboard dan chart.
- Permission granular.
- Database relational kompleks.
- Ledger append-only.
- Audit Log.
- Pengembangan cepat namun tetap rapi.

## Final Stack V1

```text
Frontend / Full-stack Framework: Next.js
Language: TypeScript
Database: PostgreSQL
ORM: Prisma
Styling: Tailwind CSS
UI Components: shadcn/ui
Validation: Zod
Chart: Recharts or compatible chart layer
Deployment: Docker-ready VPS
```

## Stack Rationale

### Next.js

Dipakai sebagai framework utama web app untuk dashboard, POS, BRILink, laporan, absensi, dan pengaturan.

### TypeScript

Dipakai untuk mengurangi bug tipe data, terutama pada nominal uang, qty stok, status transaksi, permission, dan payload API.

### PostgreSQL

Dipakai sebagai database utama karena cocok untuk data relational, ledger, transaksi atomik, indexing, dan laporan.

### Prisma

Dipakai sebagai ORM dan migration tool agar schema, migration, dan query TypeScript lebih terstruktur.

### Tailwind CSS

Dipakai untuk styling responsive, terutama POS HP dan BRILink PC.

### shadcn/ui

Dipakai sebagai base component system untuk form, table, dialog, tab, sheet, dropdown, toast, dan dashboard components.

### Zod

Dipakai untuk validasi input frontend/backend.

## Version Pinning

Dokumen ini tidak mengunci nomor versi package.

Versi package dikunci nanti di:

```text
package.json
lockfile
docker-compose.yml
```

## Non-Goals Stack V1

Tidak dipakai di V1:

```text
Native mobile app
Microservices
GraphQL
NoSQL sebagai database utama
Full ERP framework
Offline-first architecture
```

## Decision

Stack final:

```text
Next.js + TypeScript + PostgreSQL + Prisma + Tailwind CSS + shadcn/ui + Zod
```
