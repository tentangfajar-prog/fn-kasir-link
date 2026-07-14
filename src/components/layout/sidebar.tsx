import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/warung", label: "Warung" },
  { href: "/warung/products", label: "Produk Warung" },
  { href: "/warung/sellable-items", label: "Item Jual Warung" },
  { href: "/warung/stock-opname", label: "Stock Opname Warung" },
  { href: "/warung/purchases", label: "Pembelian Warung" },
  { href: "/warung/debts", label: "Hutang Supplier Warung" },
  { href: "/warung/expenses", label: "Pengeluaran Warung" },
  { href: "/warung/cash-transfer", label: "Pindah Kas Warung" },
  { href: "/warung/finance", label: "Keuangan Warung" },
  { href: "/brilink", label: "BRILink" },
  { href: "/brilink/transactions", label: "Transaksi BRILink" },
  { href: "/brilink/tariffs", label: "Tarif BRILink" },
  { href: "/brilink/temporary-funds", label: "Dana di Luar & Injeksi" },
  { href: "/laporan-keuangan", label: "Laporan Keuangan" },
  { href: "/absensi", label: "Absensi" },
  { href: "/pengaturan", label: "Pengaturan" },
  { href: "/users", label: "User" },
  { href: "/permissions", label: "Permission" },
  { href: "/partners", label: "Partner" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white p-4 md:block">
      <div className="mb-8">
        <p className="text-sm text-slate-500">Owner Dashboard</p>
        <h1 className="text-xl font-bold">FN Kasir Link</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
