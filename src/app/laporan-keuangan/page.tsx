import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function LaporanKeuanganPage() {
  return <ApiJsonForm title="Laporan Keuangan" description="Laporan read-only aset, hutang, dana luar, injeksi, dan profit dari ledger." endpoint="/api/laporan-keuangan/summary" method="GET" />;
}
