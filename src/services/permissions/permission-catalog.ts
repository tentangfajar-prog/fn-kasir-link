import type { Domain } from "@prisma/client";

export type PermissionDefinition = {
  code: string;
  name: string;
  domain: Domain;
  module: string;
  sensitive?: boolean;
};

export const PERMISSIONS: PermissionDefinition[] = [
  { code: "dashboard.view", name: "Lihat Dashboard", domain: "GLOBAL", module: "dashboard" },
  { code: "warung.access", name: "Akses Warung", domain: "WARUNG", module: "warung" },
  { code: "warung.product.manage", name: "Kelola Produk Warung", domain: "WARUNG", module: "warung.product", sensitive: true },
  { code: "warung.stock.view", name: "Lihat Stok Warung", domain: "WARUNG", module: "warung.stock" },
  { code: "warung.stock.opname", name: "Stock Opname Warung", domain: "WARUNG", module: "warung.stock", sensitive: true },
  { code: "warung.pos.use", name: "Gunakan POS Warung", domain: "WARUNG", module: "warung.pos" },
  { code: "warung.sale.cancel", name: "Batalkan Penjualan Warung", domain: "WARUNG", module: "warung.pos", sensitive: true },
  { code: "warung.closing.create", name: "Closing Warung", domain: "WARUNG", module: "warung.closing", sensitive: true },
  { code: "brilink.access", name: "Akses BRILink", domain: "BRILINK", module: "brilink" },
  { code: "brilink.transaction.create", name: "Buat Transaksi BRILink", domain: "BRILINK", module: "brilink.transaction" },
  { code: "brilink.closing.create", name: "Closing BRILink", domain: "BRILINK", module: "brilink.closing", sensitive: true },
  { code: "laporan-keuangan.view", name: "Lihat Laporan Keuangan", domain: "GLOBAL", module: "laporan-keuangan" },
  { code: "absensi.view", name: "Lihat Absensi", domain: "GLOBAL", module: "absensi" },
  { code: "settings.user.view", name: "Lihat User", domain: "GLOBAL", module: "settings.user" },
  { code: "settings.user.create", name: "Buat User", domain: "GLOBAL", module: "settings.user", sensitive: true },
  { code: "settings.partner.manage", name: "Kelola Partner", domain: "GLOBAL", module: "settings.partner", sensitive: true },
  { code: "settings.system.manage", name: "Kelola Setting Sistem", domain: "GLOBAL", module: "settings.system", sensitive: true },
  { code: "settings.user.reset_password", name: "Reset Password User", domain: "GLOBAL", module: "settings.user", sensitive: true },
  { code: "settings.permission.manage", name: "Kelola Permission", domain: "GLOBAL", module: "settings.permission", sensitive: true },
  { code: "audit.view", name: "Lihat Audit Log", domain: "GLOBAL", module: "audit", sensitive: true },
];

export const ROLE_PERMISSION_CODES: Record<string, string[]> = {
  OWNER: PERMISSIONS.map((permission) => permission.code),
  ADMIN: [
    "dashboard.view",
    "warung.access",
    "warung.product.manage",
    "warung.stock.view",
    "brilink.access",
    "laporan-keuangan.view",
    "absensi.view",
    "settings.user.view",
    "settings.partner.manage",
  ],
  KASIR_WARUNG: ["warung.access", "warung.stock.view", "warung.pos.use"],
  PETUGAS_BRILINK: ["brilink.access", "brilink.transaction.create"],
};
