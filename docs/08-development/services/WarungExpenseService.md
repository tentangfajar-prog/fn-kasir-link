# WarungExpenseService

Status: **FINAL V1 BASELINE**  
Domain: WARUNG

## Purpose

Mengelola pengeluaran Warung.

## Main Methods

```ts
createExpense(ctx, input)
cancelExpense(ctx, expenseId, reason)
```

## Rules

- Karyawan default hanya Kas Laci.
- Kas Aman default Owner only.
- Kategori Lainnya wajib keterangan.
- Pengeluaran tidak mengubah HPP.
- Pengeluaran mengurangi laba operasional.
- Foto bukti opsional via Attachment.

## Atomic Flow

```text
Validate permission
Validate category
Validate cash source
Generate WRG document number
Create expense
Create cash ledger
Create audit log
Commit
```
