# Reversal Service Pattern

Status: **FINAL V1 BASELINE**

## Purpose

Standar pembatalan transaksi.

## Pattern

```text
Load original
Validate cancellable
Validate related payments not blocking
Generate reversal document
Create reversal record
Reverse ledger entries
Reverse stock movements
Mark original as dibatalkan
Create audit log
Commit
```

## Rules

- Original record remains.
- No hard delete.
- Reason required.
- If already closing, reversal uses cancellation operational date.
- As-Closed report remains unchanged.
- Adjusted report shows reversal impact.
