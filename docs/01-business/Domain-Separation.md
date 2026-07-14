# Domain Separation

Status: **FINAL V1 BASELINE**

## Prinsip

```text
Satu aplikasi
Dua domain:
- WARUNG
- BRILINK
```

Warung dan BRILink dipisah dalam:

- Menu
- Route
- Permission
- Ledger
- Kas
- Modal
- Closing
- Laporan operasional
- Data scope

## Akses

Kasir Warung hanya melihat Warung.  
Petugas BRILink hanya melihat BRILink.  
Owner melihat semuanya.  
Admin sesuai permission.

## Route Protection

- `/warung/*` hanya untuk user dengan akses Warung.
- `/brilink/*` hanya untuk user dengan akses BRILink.
- Backend wajib tetap menolak akses walaupun URL diketik manual.

## Data Scope

Query backend wajib filter domain agar tidak ada kebocoran data.
