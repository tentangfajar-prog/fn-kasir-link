# Business Rules General

Status: **FINAL V1 BASELINE**

## Prinsip Umum

- Warung dan BRILink dipisah penuh.
- Owner bisa melihat semua.
- Role lain mengikuti permission.
- Semua aksi sensitif wajib Audit Log.
- Transaksi penting bersifat append-only.
- Tidak ada edit/hapus langsung untuk data penting.
- Koreksi memakai reversal atau adjustment.
- Master data yang sudah dipakai tidak boleh dihapus permanen.
- Snapshot wajib untuk data historis.
- Ledger menjadi sumber kebenaran mutasi dana.
- Stock movement menjadi sumber kebenaran stok.
- Semua transaksi uang/stok wajib atomic.
