# Dashboard & Chart API Contract

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## GET /dashboard/owner-summary

Returns cards for Ringkasan Utama, Warung, BRILink.

Query:

```text
period
date_from
date_to
```

Rules:
- Owner default.
- Admin if permission.
- BRILink revenue = Fee Net + Profit Konsinyasi BRILink.

## GET /dashboard/charts/daily

Query:

```text
metric=pendapatan|profit|fee|transaction_count
mode=combined|split_domain
month=2026-07
compare_with_previous=true
```

Returns line chart data for current month vs previous month.

## GET /dashboard/charts/monthly

Query:

```text
metric=pendapatan|profit
mode=combined|split_domain
year=2026
```

Returns January–December bar chart data.

## Drilldown

Chart point must produce a report link with filters:

```json
{
  "target": "/warung/laporan",
  "filters": {
    "date": "2026-07-14"
  }
}
```
