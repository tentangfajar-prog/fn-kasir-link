# Roles and Permissions

Status: **FINAL V1 BASELINE**

## Role Default

```text
Owner
Admin
Kasir Warung
Petugas BRILink
```

## Model Permission

```text
Role Template
+
Permission Checklist
+
User Override
=
Final Permission
```

Deny lebih kuat daripada Allow.

## Owner

Akses penuh. Tidak boleh ada kondisi Owner terakhir terhapus atau dinonaktifkan.

## Admin

Bisa bantu operasional dan master data non-kritis sesuai permission.

## Kasir Warung

Default hanya domain Warung.

## Petugas BRILink

Default hanya domain BRILink.

## Permission Sensitif

Contoh:
- Batalkan transaksi
- Stock opname
- Bayar hutang
- Bayar konsinyasi
- Ubah tarif BRILink
- Akses Kas Aman
- Adjustment closing
- Role & permission
- Reset password
- Audit log

Permission sensitif wajib diberi warning UI dan masuk Audit Log saat diubah.
