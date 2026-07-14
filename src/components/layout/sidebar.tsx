import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/warung", label: "Warung" },
  { href: "/brilink", label: "BRILink" },
  { href: "/laporan-keuangan", label: "Laporan Keuangan" },
  { href: "/absensi", label: "Absensi" },
  { href: "/pengaturan", label: "Pengaturan" },
  { href: "/users", label: "User" },
  { href: "/permissions", label: "Permission" },
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
