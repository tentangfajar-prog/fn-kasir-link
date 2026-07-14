# Document Numbering

Status: **FINAL V1 BASELINE**

Nomor dokumen:

```text
WRG-YYYYMMDD-000001
BRI-YYYYMMDD-000001
```

Aturan:

- WRG untuk domain Warung.
- BRI untuk domain BRILink.
- Nomor dokumen dibuat atomik.
- Nomor reset per hari per domain.
- UUID tetap menjadi ID internal.
- Jenis dokumen disimpan di field terpisah.
- Gap nomor diperbolehkan jika transaksi gagal setelah nomor dialokasikan.
