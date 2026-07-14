# Service Method Pattern

Status: **FINAL V1 BASELINE**

## Standard Pattern

```ts
async function serviceMethod(ctx, input) {
  const validated = schema.parse(input)

  await permissionService.require(ctx, "permission.code")
  await domainGuard.require(ctx, "WARUNG")

  return prisma.$transaction(async (tx) => {
    const documentNo = await documentSequenceService.next(tx, "WARUNG", operationalDate)

    // load master data
    // validate business rules
    // create main records
    // create ledger/movements
    // create audit log

    return result
  })
}
```

## Rules

- Validate before transaction if possible.
- Re-check critical data inside transaction.
- Never trust frontend-calculated money.
- Audit is inside transaction for sensitive actions.
