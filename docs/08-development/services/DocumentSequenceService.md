# DocumentSequenceService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Membuat nomor dokumen atomik.

Format:

```text
WRG-YYYYMMDD-000001
BRI-YYYYMMDD-000001
```

## Main Method

```ts
next(tx, domain, date)
```

## Rules

- Lock sequence row by domain + date.
- Increment last number.
- Generate document number.
- Number not reused.
- Gap is allowed if transaction fails after allocation.

## Tables

```text
document_sequences
```

## Error Cases

```text
DOCUMENT_SEQUENCE_LOCK_FAILED
INVALID_DOCUMENT_DOMAIN
```
