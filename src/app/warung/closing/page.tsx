import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function WarungClosingPage() {
  return <ApiJsonForm title="Closing Warung" description="Closing menyimpan snapshot, setoran aman, selisih, dan audit. Selisih tidak auto-adjust ledger." endpoint="/api/warung/closing" initialJson={JSON.stringify({ operational_date: new Date().toISOString().slice(0, 10), actual_cash_laci_amount: 0, note: "" }, null, 2)} />;
}
