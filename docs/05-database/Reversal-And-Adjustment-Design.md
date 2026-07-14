# Reversal and Adjustment Design

Status: **FINAL V1 BASELINE**

Reversal:
- Transaksi asli tetap ada.
- Sistem membuat pembalik.
- Status asli menjadi Dibatalkan.
- Audit Log wajib.

Adjustment:
- Default Owner only.
- Alasan wajib.
- Membuat ledger entry baru.
- Tidak mengubah snapshot closing lama.
