# API Index V1 — FN Kasir Link

Status: **FINAL V1 BASELINE**  
Domain: GLOBAL  
Last Updated: 2026-07-14

## Purpose

Dokumen ini menjadi index API/action contract untuk FN Kasir Link V1.

Arsitektur menggunakan **Next.js modular monolith**, sehingga implementasi bisa berbentuk:

```text
Internal REST-like API
atau
Server Actions
```

Namun kontrak tetap ditulis seperti API agar jelas untuk developer dan AI coding.

## Global API Rules

Semua API/action wajib:

```text
Auth check
Permission check
Domain scope check
Input validation
Business service execution
Database transaction jika mengubah uang/stok
Ledger/movement creation
Snapshot creation
Audit Log jika aksi penting
Human-readable error
```

## Response Standard

Success:

```json
{
  "success": true,
  "message": "Data berhasil disimpan.",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "Pesan manusiawi.",
  "details": {},
  "field_errors": {}
}
```

## Main Contract Files

```text
contracts/auth/Auth-API.md
contracts/global/User-Permission-API.md
contracts/global/Partner-API.md
contracts/global/Settings-API.md

contracts/warung/POS-API.md
contracts/warung/Product-Stock-API.md
contracts/warung/Purchase-Expense-Debt-API.md
contracts/warung/Consignment-API.md
contracts/warung/Closing-API.md

contracts/brilink/Transaction-API.md
contracts/brilink/Tariff-API.md
contracts/brilink/Dana-Luar-Injeksi-API.md
contracts/brilink/Consignment-API.md
contracts/brilink/Closing-API.md

contracts/dashboard/Dashboard-Chart-API.md
contracts/laporan/Laporan-Keuangan-API.md
contracts/absensi/Absensi-API.md
contracts/system/Audit-Print-API.md
```

## Permission Format

```text
domain.module.action
```

Examples:

```text
warung.pos.use
warung.purchase.create
warung.debt.pay
brilink.transaction.create
brilink.tariff.manage
financial_report.owner.view
attendance.qr.display
settings.permission.manage
```

## Domain Scope

```text
WARUNG
BRILINK
GLOBAL
ABSENSI
SYSTEM
```

Non-Owner user must be scoped properly. UI hiding is not enough. Backend must block access, because apparently users can type URLs. What a shocking discovery.
