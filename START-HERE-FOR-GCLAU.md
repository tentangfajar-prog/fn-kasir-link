# START HERE FOR GCLAU — FN Kasir Link

Status: **FINAL HANDOFF V1**  
Project: **FN Kasir Link**

## Mission

You are assisting the Owner to build FN Kasir Link.

Do not start coding randomly.

First, read the documentation in this repository and follow Sprint 00 only.

This project is not a generic POS.

It is a custom internal web application for managing two separated operational domains:

```text
WARUNG
BRILINK
```

The most important rule:

```text
Warung and BRILink must be separated in menu, route, permission, ledger, cash, capital, closing, report, and data scope.
```

## Read These Files First

Read in this order:

```text
README.md
docs/00-project/Project-Overview.md
docs/00-project/Scope-V1.md
docs/00-project/Decision-Log.md
docs/00-project/Tech-Stack-Decision.md
docs/01-business/Domain-Separation.md
docs/01-business/Roles-And-Permissions.md
docs/01-business/Financial-Principles.md
docs/01-architecture/Application-Architecture.md
docs/01-architecture/Folder-Structure.md
docs/01-architecture/Service-Layer-Design.md
docs/08-development/Sprint-Plan.md
docs/08-development/Coding-Standards.md
docs/08-development/services/Service-Index.md
```

## Tech Stack

Use:

```text
Next.js
TypeScript
PostgreSQL
Prisma
Tailwind CSS
shadcn/ui
Zod
```

Architecture:

```text
Modular monolith
One physical database
Domain-separated WARUNG and BRILINK
```

## Start With Sprint 00 Only

Do not implement business features yet.

Do not implement POS yet.

Do not implement BRILink transaction yet.

Do not implement dashboard chart yet.

Sprint 00 is foundation only.

## Sprint 00 Goal

Create the project foundation:

```text
Next.js + TypeScript
Tailwind CSS
shadcn/ui
Prisma
PostgreSQL config
Folder structure
AppShell
Sidebar
Topbar
Basic routes
Environment example
Documentation committed to repo
```

## Required Routes

Create route placeholders only:

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

## Do Not Build Yet

Do not build these in Sprint 00:

```text
POS checkout
BRILink transaction
Product stock logic
Ledger
Closing
Charts
Reports
Absensi QR
Permission engine full implementation
```

Only skeleton.

## Final Output Expected From Sprint 00

```text
App runs locally.
Layout appears.
Sidebar appears.
Topbar appears.
Basic routes exist.
Prisma configured.
PostgreSQL connection ready.
Folder structure follows docs.
No business feature implemented yet.
```

## Critical Project Rules

1. Kasir Warung must not see BRILink.
2. Petugas BRILink must not see Warung.
3. Owner can see everything.
4. Admin follows permission.
5. Business rules must live in service layer, not UI.
6. Money and stock workflows must be atomic.
7. Ledger must be append-only.
8. Audit Log is required for sensitive actions.
9. Reversal, not direct edit, is used for correction.
10. Dashboard must not count BRILink transaction nominal as omzet.

## If You Are Unsure

Do not invent business rules.

Read:

```text
docs/00-project/Decision-Log.md
```

If still unclear, ask the Owner before changing scope.
