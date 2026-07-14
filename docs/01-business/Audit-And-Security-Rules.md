# Audit and Security Rules

Status: **FINAL V1 BASELINE**

## Audit Wajib

Audit Log wajib untuk:

- Login/logout
- User management
- Reset password
- Permission changes
- Transaksi
- Pembatalan
- Pembelian
- Pengeluaran
- Pembayaran hutang
- Pembayaran konsinyasi
- Stock opname
- Retur expired
- Dana di Luar
- Injeksi
- Closing
- Adjustment
- Cetak ulang
- Master data changes

Audit Log tidak bisa diedit atau dihapus dari UI.

## Security

Sistem harus mencegah:

- Owner terakhir dihapus/dinonaktifkan.
- Admin menaikkan dirinya jadi Owner.
- Admin memberi dirinya permission sensitif.
- Non-Owner mengubah permission Owner.
- User lintas domain membaca data yang bukan haknya.
