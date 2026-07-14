# Frontend Component Strategy

Status: **FINAL V1 BASELINE**

## Component Stack

```text
Tailwind CSS
shadcn/ui
Custom domain components
```

## Component Groups

```text
layout/
forms/
tables/
filters/
charts/
dialogs/
print-preview/
domain/warung/
domain/brilink/
domain/dashboard/
```

## Core Components

- AppShell
- Sidebar
- Topbar
- PermissionGate
- DomainGuardNotice
- SmartSearchFilter
- DataTable
- StatusBadge
- ConfirmDialog
- MoneyInput
- QuantityInput
- DateRangeFilter
- ChartCard
- SummaryCard
- StickyCart
- CheckoutSheet

## Rules

- Components must support mobile and desktop where needed.
- POS components prioritize HP.
- BRILink components prioritize PC.
- Sensitive actions must use ConfirmDialog.
