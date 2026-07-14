# BRILink Consignment API Contract

Status: **FINAL V1 BASELINE**  
Domain: BRILINK

## POST /brilink/consignment/entries

Create BRILink consignment stock.

Rules:
- Stock increases.
- No payable yet.
- Cash/Saldo unchanged.

## POST /brilink/consignment/sales

Sell consignment item.

Rules:
- Default payment Cash BRILink.
- Cash increases by selling price.
- Stock decreases.
- Profit recorded.
- Payable created.

## POST /brilink/consignment/payments

Pay consignor.

Rules:
- Source Cash BRILink.
- Pay sold unpaid qty.
- Not expense.

## POST /brilink/consignment/returns

Return unsold item.

Rules:
- Only unsold stock.
- No cash/saldo/profit/payable change.
