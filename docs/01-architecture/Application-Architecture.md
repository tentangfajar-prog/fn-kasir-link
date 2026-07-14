# Application Architecture — FN Kasir Link

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Architecture Summary

FN Kasir Link adalah modular monolith.

```text
One codebase
One database
Two separated business domains:
- WARUNG
- BRILINK
```

Global modules:

```text
Auth
Permission
Partner
Dashboard
Laporan Keuangan
Absensi
Pengaturan
Audit
Print
```

## Why Modular Monolith

V1 tidak memakai microservices karena:

- Domain masih satu usaha.
- Deployment lebih sederhana.
- Atomic transaction lebih mudah.
- Dashboard Owner perlu membaca dua domain.
- Debugging lebih jelas.
- Development lebih cepat.

## Layering

```text
UI Layer
Form Validation Layer
Action/API Layer
Service Layer
Repository/Database Layer
Audit/Logging Layer
```

## UI Layer

UI hanya menampilkan data dan mengirim input.

UI tidak boleh menghitung final:

```text
HPP
Fee
Profit
Cash movement
Saldo movement
Ledger entry
```

## Validation Layer

Gunakan schema validation untuk:

- Nominal.
- Qty.
- Date.
- Status.
- Permission-sensitive forms.
- Barcode/SKU.
- QR attendance token.

## Action/API Layer

Setiap API/action wajib:

```text
Cek auth
Cek permission
Cek domain
Validasi input
Panggil service
Return response standar
```

## Service Layer

Business rules berada di service.

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

## Route Structure

```text
/dashboard

/warung/*
/brilink/*
/laporan-keuangan
/absensi/*
/pengaturan/*
```

## Data Flow: POS Checkout

```text
UI Checkout
→ Validation
→ Auth guard
→ Permission guard
→ Domain guard
→ WarungPOSService.checkout()
→ DB transaction:
   - create sale
   - create sale items
   - create snapshots
   - create stock movements
   - create cash/non-cash ledger
   - create audit log
→ Commit
```

## Data Flow: BRILink Transaction

```text
UI Submit
→ Validation
→ Permission guard
→ BRILinkTransactionService.create()
→ Find tariff
→ Calculate cash/saldo/fee
→ Validate cash/saldo enough
→ DB transaction:
   - create transaction
   - create cash ledger
   - create saldo ledger
   - create fee ledger
   - create audit log
→ Commit
```

## Atomic Transaction Required

Required for:

- POS checkout.
- BRILink transaction.
- Pembelian.
- Pengeluaran.
- Hutang payment.
- Konsinyasi payment.
- Dana di Luar.
- Injeksi.
- Closing.
- Stock opname posting.
- Retur expired.
- Reversal.
