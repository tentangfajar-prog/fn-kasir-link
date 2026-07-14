# Sprint 00 Task — Foundation

Status: **READY FOR GCLAU**

## Goal

Set up the technical foundation for FN Kasir Link.

## Scope

Create the initial Next.js project and skeleton structure.

## Required Stack

```text
Next.js
TypeScript
PostgreSQL
Prisma
Tailwind CSS
shadcn/ui
Zod
```

## Tasks

### 1. Initialize Project

- Create Next.js project.
- Enable TypeScript.
- Configure package manager.
- Add base scripts.

### 2. Configure Styling

- Install/configure Tailwind CSS.
- Install/configure shadcn/ui.
- Add basic UI components:
  - Button
  - Card
  - Dialog
  - Sheet
  - Dropdown
  - Input
  - Tabs

### 3. Configure Prisma

- Install Prisma and Prisma Client.
- Create Prisma folder.
- Add database config.
- Add `.env.example`.
- Do not run production migration yet.

### 4. Create Folder Structure

Follow:

```text
docs/01-architecture/Folder-Structure.md
```

Create:

```text
src/app
src/components
src/lib
src/services
src/types
```

### 5. Create Layout Skeleton

Create:

```text
AppShell
Sidebar
Topbar
```

Sidebar Owner placeholder:

```text
Dashboard
Warung
BRILink
Laporan Keuangan
Absensi
Pengaturan
```

### 6. Create Route Placeholders

Create placeholder pages:

```text
/dashboard
/warung
/warung/panel
/warung/pos
/brilink
/brilink/panel
/brilink/transaksi-baru
/laporan-keuangan
/absensi
/pengaturan
```

Each page should show:

```text
Page title
Short description
Status: placeholder
```

### 7. Add Guard Placeholders

Create placeholder files for:

```text
src/lib/auth
src/lib/permissions
src/lib/domain-guard
```

Do not implement full auth yet.

### 8. Add Documentation Reference

Add a developer note in root README or docs saying:

```text
Read START-HERE-FOR-GCLAU.md before development.
```

## Out of Scope

Do not implement:

```text
POS checkout
BRILink transaction
Database tables fully
Auth logic full
Permission engine full
Dashboard chart
Closing
Absensi QR
Print
```

## Acceptance Criteria

Sprint 00 is complete when:

- App runs locally.
- Tailwind works.
- shadcn/ui works.
- Prisma config exists.
- `.env.example` exists.
- Folder structure exists.
- AppShell renders.
- Sidebar and Topbar render.
- Basic routes load.
- No business feature is implemented yet.

## Handoff Summary Required

When done, Gclau must report:

```text
Files created
Commands used
How to run locally
Known limitations
Next sprint recommendation
```
