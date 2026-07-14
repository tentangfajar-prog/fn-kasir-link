# Ledger Service Pattern

Status: **FINAL V1 BASELINE**

## Purpose

Standar pembuatan ledger.

## Ledger Entry Must Include

```text
account
direction
amount
sourceType
sourceId
documentNo
operationalDate
createdBy
description
```

## Rules

- Ledger append-only.
- No direct update/delete.
- Balance cache can be updated, but ledger is source of truth.
- Reversal creates opposite ledger entry.
- Cash/Saldo/Kas cannot go negative unless special Owner adjustment permits.
