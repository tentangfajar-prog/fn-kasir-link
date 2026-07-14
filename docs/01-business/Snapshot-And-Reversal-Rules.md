# Snapshot and Reversal Rules

Status: **FINAL V1 BASELINE**

## Snapshot

Transaksi wajib menyimpan snapshot:

- Nama produk/item
- Harga jual
- HPP
- Tarif
- Komposisi
- Metode pembayaran
- Partner
- User/role
- Satuan dan konversi
- Harga setor konsinyasi

## Reversal

Data penting tidak diedit langsung. Jika salah:

```text
Transaksi asli tetap ada
Sistem membuat transaksi pembalik
Status asli menjadi Dibatalkan
Audit Log dibuat
```

Laporan lama tetap As-Closed. Laporan Adjusted menampilkan dampak koreksi.
