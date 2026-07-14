# Codex Task Guide

Status: **DRAFT BASELINE**

## Purpose

Panduan membuat task untuk AI coding/Codex agar tidak asal membangun fitur tanpa membaca aturan domain.

## Required Context for Every Task

Setiap task harus menyebut:

```text
Domain: WARUNG / BRILINK / GLOBAL
Related docs
Permission required
Database tables involved
Audit Log required or not
Ledger required or not
Snapshot required or not
Atomic transaction required or not
```

## Task Template

```markdown
# Task: <title>

## Domain
WARUNG / BRILINK / GLOBAL

## Goal
What to build.

## Related Docs
- docs/...
- docs/...

## Requirements
- ...

## Permission
- ...

## Database
- ...

## Acceptance Criteria
- ...

## Tests
- ...
```

## Example

```markdown
# Task: Implement Warung POS Checkout

## Domain
WARUNG

## Related Docs
- docs/03-workflows/warung/Warung-POS-Workflow.md
- docs/06-api/contracts/warung/POS-API.md
- docs/05-database/tables/Warung-Tables.md

## Requirements
- Validate stock.
- Create sale.
- Create sale items.
- Create stock movements.
- Create cash/non-cash ledger.
- Create Audit Log.

## Atomic
Yes.

## Acceptance Criteria
- No stock minus.
- No partial sale.
- Ledger matches total.
```
