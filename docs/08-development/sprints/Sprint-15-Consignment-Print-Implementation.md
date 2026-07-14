# Sprint 15 — Consignment & Print Implementation

Status: **IMPLEMENTED**

## Scope Delivered

Sprint 15 implements consignment foundation and print logging.

Included:

- `ConsignmentEntry`
- `ConsignmentPayment`
- `ConsignmentReturn`
- `ConsignmentService`
  - `createEntry`
  - `recordSale`
  - `payConsignor`
  - `returnUnsold`
- `PrintService`
  - `printDocument`
  - `recordPrintLog`
  - `getPrintableData`
- Warung and BRILink consignment API routes.
- Print API route.
- Warung and BRILink consignment UI pages.
- Financial report consignment payable integration.
- Permissions:
  - `warung.consignment.manage`
  - `brilink.consignment.manage`
  - `print.reprint`
- Self-check script:
  - `npm run check:sprint15`

## Safety Rules

- Entry does not create payable.
- Payable comes from sold unpaid quantity.
- Payment uses cash ledger OUT.
- Return is limited to unsold quantity.
- Print failure is separated from original transaction save.
- Print/reprint creates print log.

## Deliberate Limits

- POS automatic consignment sale allocation is not wired yet.
- Full cancellation/reversal for consignment payment/return is not wired yet.
- Printable HTML/PDF layout is basic data payload, not styled receipt yet.
