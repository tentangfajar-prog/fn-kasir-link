# Project Overview — FN Kasir Link

Status: **FINAL V1 BASELINE**

## Purpose

FN Kasir Link adalah aplikasi web internal untuk mengelola dua domain usaha:

```text
1. Warung / Warkop
2. BRILink
```

Sistem ini bukan POS generik. Aplikasi dibuat sesuai workflow usaha sendiri, dengan fokus pada kecepatan, keamanan dana/data, closing, stok, laporan, dan audit.

## Konsep Utama

```text
Satu aplikasi
Satu Dashboard Owner
Dua domain operasional terpisah
```

Domain:
```text
WARUNG
BRILINK
```

Keduanya dipisah dalam menu, route, permission, ledger, kas, modal, transaksi, closing, laporan operasional, dan data scope.

## Tujuan

- Kasir Warung bisa jualan cepat dari HP.
- Petugas BRILink bisa input transaksi cepat dari PC.
- Owner bisa memantau dua domain dari satu dashboard.
- Modal dan keuangan Warung/BRILink tetap dipisah.
- Semua aksi penting tercatat di Audit Log.
- Semua transaksi uang/stok memakai ledger dan snapshot.

## Success Criteria

V1 berhasil jika:
- Kasir Warung tidak bisa melihat BRILink.
- Petugas BRILink tidak bisa melihat Warung.
- POS berjalan dengan stok akurat.
- BRILink berjalan dengan Cash/Saldo akurat.
- Closing Warung dan Closing BRILink berjalan.
- Laporan Keuangan bisa me-match Warung dan BRILink.
