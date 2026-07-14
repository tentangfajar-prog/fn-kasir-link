# Service Layer Design V1 — FN Kasir Link

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Purpose

Dokumen ini menjelaskan desain service layer FN Kasir Link V1.

Service layer adalah tempat semua aturan bisnis penting dijalankan.

UI tidak boleh memutuskan:

```text
HPP
Fee
Profit
Cash movement
Saldo movement
Stock movement
Permission final
Document number
Ledger entry
Snapshot
Audit Log
```

UI hanya mengirim input. Service layer yang memutuskan hasil final. Browser tidak diberi hak menjaga uang, karena browser bahkan kadang kalah oleh cache dan extension aneh. 🧾

---

## Core Principles

Setiap service yang mengubah dana, stok, closing, permission, atau data sensitif wajib mengikuti pola:

```text
Validate input
Check permission
Check domain
Open database transaction
Load master data
Validate business rules
Generate document number
Create main document
Create detail records
Create ledger / stock movements
Create snapshots
Create audit log
Commit
Return result
```

Jika satu langkah gagal:

```text
Rollback semua
```

Tidak boleh ada data setengah matang.

---

## Service Categories

Service utama V1:

```text
PermissionService
DomainGuardService
DocumentSequenceService
AuditService
PrintService

WarungPOSService
WarungProductStockService
WarungPurchaseService
WarungExpenseService
WarungDebtService
WarungConsignmentService
WarungClosingService

BRILinkTransactionService
BRILinkTariffService
BRILinkTemporaryFundService
BRILinkConsignmentService
BRILinkClosingService

DashboardService
FinancialReportService
AttendanceService
SettingsService
```

---

## Service Rule: No Business Logic in UI

Contoh yang **tidak boleh** dilakukan UI:

```text
Menghitung fee BRILink final
Mengurangi stok langsung
Menghitung HPP baru
Mengubah saldo cash
Membuat nomor dokumen
Menentukan profit final
Membuat ledger entry
```

UI boleh menampilkan preview, tapi preview harus berasal dari backend/service.

Contoh:

```text
BRILink preview Cash/Saldo
```

tetap dihitung oleh:

```text
BRILinkTransactionService.preview()
```

bukan dihitung bebas di frontend.

---

## Standard Service Method Pattern

```ts
async function action(input, context) {
  await permissionService.require(context.user, "permission.code")
  await domainGuard.require(context.user, "WARUNG")

  const validated = schema.parse(input)

  return await prisma.$transaction(async (tx) => {
    const docNo = await documentSequenceService.next(tx, "WARUNG")

    // validate business rules
    // create records
    // create ledger/movements
    // create audit log

    return result
  })
}
```

---

## Context Object

Setiap service menerima context:

```ts
type RequestContext = {
  userId: string
  userName: string
  roleCode: string
  permissions: string[]
  domainAccess: ("WARUNG" | "BRILINK")[]
  ipAddress?: string
  deviceInfo?: string
}
```

Context dipakai untuk:

```text
Permission
Domain scope
Audit Log
Snapshot user
Created by
```

---

## Transaction Boundary

Database transaction harus mencakup seluruh proses yang saling bergantung.

Contoh POS:

```text
Create sale
Create sale items
Create stock movements
Create cash/non-cash ledger
Create consignment payable if any
Create audit log
```

Semua harus satu transaction.

Kalau audit gagal, transaksi juga gagal?  
Rekomendasi V1:

```text
Untuk aksi sensitif, audit log menjadi bagian transaction.
```

Artinya jika audit gagal, transaksi batal. Audit bukan hiasan. Audit adalah bagian dari kebenaran sistem.

---

## Related Documents

- docs/01-architecture/Transaction-Boundary-Design.md
- docs/08-development/services/Service-Index.md
- docs/06-api/API-Principles.md
- docs/05-database/Database-Principles.md
