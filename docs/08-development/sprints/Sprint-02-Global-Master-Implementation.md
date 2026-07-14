# Sprint 02 Implementation Notes — Global Master

Status: **IN PROGRESS**

## Scope implemented

- Global master schema:
  - Partner
  - Setting
  - DocumentSequence
  - Attachment
  - PrintLog
- Partner rules:
  - supplier / consignment / both
  - active / inactive
  - soft-delete field prepared
  - audit for create/update/deactivate
- Settings rules:
  - scope GLOBAL / WARUNG / BRILINK / ABSENSI / PRINT / SYSTEM
  - key-value JSON only
  - sensitive key detector
  - audit for updates
- DocumentSequenceService:
  - atomic upsert + increment
  - domain-specific document prefix
- Permission additions:
  - settings.partner.manage
  - settings.system.manage
- Seed additions:
  - app.name setting
  - WRG-/BRI- document sequences
- Placeholder pages:
  - /partners
  - /settings

## Still intentionally not implemented

- UI forms for partner/settings.
- Route handlers for Partner/Settings API.
- Transaction modules using partner snapshot.
- Ledger.
- POS checkout.
- BRILink transaction.
- Closing.
- Dashboard chart.

## Notes

Global master only prepares safe base data and services. Business transaction flows remain blocked until later sprints.
