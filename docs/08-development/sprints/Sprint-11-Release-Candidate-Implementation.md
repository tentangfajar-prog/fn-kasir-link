# Sprint 11 — Release Candidate Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 11 adds internal release-candidate gates and documentation.

Included:

- `scripts/sprint11-self-check.ts`
- `npm run check:sprint11`
- `npm run check:rc`
- RC readiness report:
  - `docs/10-release/RC-01-Readiness-Report.md`

## Gate Coverage

The Sprint 11 self-check validates:

- All sprint self-check scripts exist in package scripts.
- Critical service files exist.
- Git remote does not contain GitHub token.
- Tracked files do not contain GitHub PAT pattern.
- Tracked files do not contain known server password pattern.
- Warung/BRILink permission separation remains enforced.
- Basic security headers remain configured.

## RC Command

```bash
npm run check:rc
```

Runs Prisma generate, typecheck, build, lint, and Sprint 01–11 self-checks.

## Deliberate Limits

Sprint 11 does not deploy production and does not mark the app production-ready.

Known remaining product gaps are listed in `docs/10-release/RC-01-Readiness-Report.md`.
