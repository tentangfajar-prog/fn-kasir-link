# Seed Data Plan V1

Status: **FINAL V1 BASELINE**

## Purpose

Seed data awal untuk development/staging.

## Required Seeds

### Roles

```text
Owner
Admin
Kasir Warung
Petugas BRILink
```

### Owner User

```text
username: owner
must_change_password: true
```

### Permissions

Group:

```text
dashboard.*
warung.*
brilink.*
financial_report.*
attendance.*
settings.*
audit.*
print.*
```

### Warung

Units:

```text
PCS, Dus, Pack, Renceng, Gram, KG, ML, Liter, Botol, Sachet, Porsi, Cup, Bungkus
```

Categories:

```text
Makanan, Minuman, Kopi, Rokok, Snack, Seduh, Paket, Konsinyasi, Lainnya
```

Payment methods:

```text
Tunai, QRIS, DANA, SPay, Transfer
```

Expense categories:

```text
Gas, Galon, Listrik, Ongkir, Transport, Parkir, Plastik, Kebersihan, Peralatan, Lainnya
```

### BRILink

Transaction types:

```text
Transfer
Setor Tunai
Tarik Tunai
Top Up
```

Templates:

```text
Cash In Nominal + Fee, Saldo Out Nominal
Cash Out Nominal, Cash In Fee, Saldo In Nominal
```

### Settings

```text
timezone: Asia/Jakarta
currency: IDR
attendance QR TTL: 60 seconds
barcode enabled: false
POS receipt enabled: true
BRILink receipt enabled: true
```

## Seed Rules

- Seed data must be idempotent.
- Do not create duplicate roles/permissions.
- Do not seed real passwords in production.
