# DashboardService

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Menyediakan data dashboard Owner.

## Main Methods

```ts
getOwnerSummary(ctx, filter)
getWarungDashboard(ctx, filter)
getBrilinkDashboard(ctx, filter)
getDailyChart(ctx, filter)
getMonthlyChart(ctx, filter)
```

## Rules

- Owner default.
- Admin if permission.
- BRILink revenue = Fee Net + Profit Konsinyasi BRILink.
- Nominal BRILink transaction is not omzet.
- Chart supports combined and split domain.
- Chart drilldown returns report link + filters.

## Data Sources

- Warung sales/ledger.
- BRILink fee ledger.
- Consignment sales.
- Closing snapshots.
- Reporting summaries if available.
