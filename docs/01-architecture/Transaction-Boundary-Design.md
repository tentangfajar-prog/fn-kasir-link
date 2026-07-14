# Transaction Boundary Design V1

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL

## Purpose

Menentukan proses mana yang wajib atomic.

## Atomic Required

Wajib memakai database transaction:

```text
POS checkout
POS cancellation
BRILink transaction
BRILink cancellation
Pembelian
Pembelian cancellation
Pengeluaran
Pengeluaran cancellation
Bayar hutang
Bayar konsinyasi
Konsinyasi masuk
Retur konsinyasi
Stock opname posting
Retur expired
Closing Warung
Closing BRILink
Dana di Luar
Pengembalian Dana di Luar
Injeksi
Pengembalian Injeksi
Financial adjustment
Permission changes
Reset password
```

## Rule

```text
All succeed or all rollback.
```

Tidak boleh ada:

```text
Kas berubah tapi ledger gagal.
Stok berubah tapi transaksi gagal.
Closing tersimpan tapi snapshot gagal.
Fee tercatat tapi transaksi BRILink gagal.
```

## Transaction Boundary Example: Warung POS Checkout

Inside one DB transaction:

```text
Generate document number
Create warung_sales
Create warung_sale_items
Create stock_movements
Update stock cache
Create cash or non-cash ledger
Create consignment sale/payable if needed
Create audit log
```

## Transaction Boundary Example: BRILink Transaction

Inside one DB transaction:

```text
Generate BRI document number
Create brilink_transactions
Create cash ledger
Create saldo ledger
Create fee ledger
Create audit log
```

## Transaction Boundary Example: Closing Warung

Inside one DB transaction:

```text
Generate document number
Read ledger snapshot
Calculate system cash
Create closing record
Create setoran aman ledger
Create pending difference marker if needed
Create audit log
```

## Related

- Service-Layer-Design.md
- Database-Principles.md
