# Decision Log — FN Kasir Link

Status: **FINAL V1 BASELINE**

## Keputusan Utama

1. FN Kasir Link adalah satu aplikasi dengan dua domain operasional: Warung dan BRILink.
2. Dashboard Owner menjadi pusat monitoring dua domain.
3. Warung dan BRILink dipisah dalam menu, route, permission, ledger, kas, modal, closing, laporan, dan data scope.
4. Sidebar Owner final: Dashboard, Warung, BRILink, Laporan Keuangan, Absensi, Pengaturan.
5. Kasir Warung tidak boleh melihat BRILink.
6. Petugas BRILink tidak boleh melihat Warung.
7. Admin mengikuti permission dari Owner.
8. Permission memakai Role Template + Permission Checklist + User Override.
9. Data penting bersifat append-only.
10. Koreksi transaksi memakai reversal/pembatalan, bukan edit/hapus langsung.
11. Audit Log wajib untuk aksi sensitif.
12. Nomor dokumen: WRG-YYYYMMDD-000001 dan BRI-YYYYMMDD-000001.
13. Warung memiliki Kas Laci dan Kas Aman.
14. Setoran Warung adalah Kas Laci → Kas Aman, bukan pengeluaran.
15. BRILink memiliki Cash dan Saldo.
16. Saldo BRILink tidak dipisah per rekening di V1.
17. Modal Warung dan Modal BRILink dipisah.
18. Dana di Luar dan Injeksi hanya domain BRILink.
19. Dana di Luar dan Injeksi berada dalam satu menu: Dana di Luar & Injeksi.
20. POS Warung mobile-first, search-first, dan barcode-ready.
21. Barcode mendukung scanner fisik dan kamera HP, diatur di Pengaturan.
22. Transaksi BRILink desktop-first dan memakai dropdown searchable.
23. Fee BRILink mengikuti master tarif dan tidak bisa diedit saat transaksi.
24. Closing Warung dan BRILink boleh dilakukan oleh user berizin.
25. Closing yang sudah disimpan tidak bisa diedit/hapus.
26. Selisih closing tampil di laporan dan tidak otomatis mengubah ledger.
27. Laporan Keuangan khusus Owner untuk matching Warung + BRILink.
28. Dashboard memiliki 3 tab: Ringkasan Utama, Warung, BRILink.
29. Chart dashboard: line chart harian bulan ini vs bulan lalu, bar chart bulanan 1 tahun.
30. BRILink tidak dihitung sebagai omzet dari nominal transaksi. Pendapatan BRILink = Fee Net + Profit Konsinyasi BRILink.
31. Absensi memakai login + QR dinamis + GPS + radius.
32. QR Absensi hanya di aplikasi, bukan QR statis cetak.
