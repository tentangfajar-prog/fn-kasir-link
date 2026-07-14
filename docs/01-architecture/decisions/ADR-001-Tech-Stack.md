# ADR-001 — Tech Stack

Status: **ACCEPTED**  
Date: 2026-07-14

## Context

FN Kasir Link needs a stack for:

- POS mobile-first.
- BRILink desktop-first.
- Dashboard and reports.
- Relational database.
- Permission and audit.
- Fast but disciplined development.

## Decision

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

## Consequences

Positive:

- Strong TypeScript ecosystem.
- Good fit for dashboard and form-heavy app.
- Relational data model supported.
- UI components can be customized.
- Modular monolith is straightforward.

Trade-offs:

- Service layer discipline is required.
- Prisma migrations must be managed carefully.
- Backend permission checks must be enforced consistently.
