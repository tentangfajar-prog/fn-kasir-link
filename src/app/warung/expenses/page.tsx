import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function WarungExpensesPage() {
  return <ApiJsonForm title="Pengeluaran Warung" description="Catat pengeluaran dari Kas Laci/Kas Aman. Ledger dan audit dibuat otomatis." endpoint="/api/warung/expenses" initialJson={JSON.stringify({ category_id: "", amount: 0, cash_source: "KAS_LACI", operational_date: new Date().toISOString().slice(0, 10), note: "" }, null, 2)} />;
}
