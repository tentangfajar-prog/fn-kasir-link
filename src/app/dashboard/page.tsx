import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function DashboardPage() {
  return <ApiJsonForm title="Dashboard Owner" description="Ringkasan Owner read-only dari ledger dan transaksi." endpoint="/api/dashboard/summary" method="GET" />;
}
