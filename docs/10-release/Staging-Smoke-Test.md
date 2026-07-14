# Staging Smoke Test

Run after staging deploy.

## Auth

- [ ] Owner can login.
- [ ] Logout clears session.
- [ ] Change password works.

## Permission Separation

- [ ] Kasir Warung cannot access BRILink routes.
- [ ] Petugas BRILink cannot access Warung routes.
- [ ] Admin/Owner can access both domains.

## Warung

- [ ] POS catalog loads.
- [ ] POS checkout creates sale, stock movement, ledger, audit.
- [ ] Expense creates ledger and audit.
- [ ] Purchase updates stock/HPP and creates cash/debt effect.
- [ ] Closing creates snapshot.

## BRILink

- [ ] Transaction context loads.
- [ ] Transaction preview calculates fee/cash/saldo.
- [ ] Transaction creates ledger and audit.
- [ ] Dana di luar/injeksi create and return work.
- [ ] Closing creates snapshot.

## Reports

- [ ] Dashboard summary loads.
- [ ] Laporan summary loads.
- [ ] Closing differences appear.
- [ ] Consignment payable appears.

## Absensi

- [ ] QR display works.
- [ ] Check-in validates GPS radius.
- [ ] Check-out validates GPS radius.
- [ ] Correction creates audit.

## Print

- [ ] Print endpoint returns printable payload.
- [ ] Print log row created.
