# Sprint 09 — Dashboard & Reports Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 09 implements read-only dashboard and financial report services. No operational mutation is created in this sprint.

Included:

- `DashboardService`
  - `getOwnerSummary`
  - `getWarungDashboard`
  - `getBrilinkDashboard`
  - `getDailyChart`
  - `getMonthlyChart`
- `FinancialReportService`
  - `getSummary`
  - `getAssetLiquidity`
  - `getMatchingKasModal`
  - `getDebtAndPayables`
  - `getTemporaryFunds`
  - `getConsignmentCombined` placeholder result
  - `getClosingDifferences` placeholder result
- Report filter validation.
- Daily/monthly chart filter validation.
- Drilldown target metadata for charts.
- Self-check script:
  - `npm run check:sprint09`

## Data Sources

Warung:

- `WarungSale`
- `WarungSaleItem`
- `WarungExpense`
- `WarungPurchase`
- `WarungStockProduct`
- `WarungSupplierDebt`
- `WarungCashLedger`

BRILink:

- `BrilinkTransaction`
- `BrilinkFeeLedger`
- `BrilinkCashLedger`
- `BrilinkSaldoLedger`
- `BrilinkDanaLuar`
- `BrilinkInjection`

## Rules Kept

- Dashboard/report services are read-only.
- Warung and BRILink ledgers stay separated.
- Combined view only aggregates final monitoring output.
- BRILink revenue uses fee ledger, not nominal transaction.
- Kas/asset liquidity uses ledger balances.

## Deliberate Limits

Not included in Sprint 09:

- Route handlers/API implementation.
- Final chart UI.
- Reporting cache tables/views.
- Closing difference real data, because closing sprint is later.
- Consignment real data, because consignment is not implemented yet.
