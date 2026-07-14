# Coding Standards — FN Kasir Link

Status: **FINAL V1 BASELINE**

## Language

Use TypeScript.

## Rules

- Business rules live in service layer.
- UI must not calculate final HPP, fee, profit, or ledger movement.
- Backend must enforce permission and domain scope.
- Use schema validation for inputs.
- Use database transaction for atomic money/stock workflows.
- Use integer for money values.
- Use decimal for quantity where needed.
- Use UUID for internal IDs.
- Use document number for human-facing references.

## Naming

Permission:

```text
domain.module.action
```

Examples:

```text
warung.pos.use
brilink.transaction.create
settings.permission.manage
```

## Services

Recommended services:

```text
PermissionService
AuditService
DocumentSequenceService
WarungPOSService
WarungPurchaseService
WarungClosingService
BRILinkTransactionService
BRILinkTemporaryFundService
FinancialReportService
AttendanceService
PrintService
```

## Error Messages

Human-readable. No raw stack traces in UI.

## Audit

Every sensitive service action must call AuditService.
