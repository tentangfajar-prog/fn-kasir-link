# Sprint 14 — Closing & Reversal Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 14 implements closing snapshot foundation and reversal record foundation.

Included:

- `WarungClosing`
- `BrilinkClosing`
- `ReversalRecord`
- `WarungClosingService`
  - `previewClosing`
  - `createClosing`
  - `printClosing`
- `BrilinkClosingService`
  - `previewClosing`
  - `createClosing`
  - `printClosing`
- Closing API routes for Warung and BRILink.
- Closing UI pages for Warung and BRILink.
- Financial report closing differences now reads closing records.
- Self-check script:
  - `npm run check:sprint14`

## Safety Rules

- Closing creates immutable snapshot rows.
- Differences are stored and reported.
- Differences do not silently auto-adjust ledger.
- Closing writes audit log.
- Warung and BRILink closing records stay separate.

## Deliberate Limits

- Reversal foundation schema exists, but full transaction cancel/reversal flows are intentionally not wired for all modules in this sprint.
- This avoids unsafe partial reversal of stock/ledger/payment chains.
- Full reversal coverage should be module-by-module with dedicated tests.
