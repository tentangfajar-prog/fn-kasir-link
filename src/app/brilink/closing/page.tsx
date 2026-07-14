import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function BrilinkClosingPage() {
  return <ApiJsonForm title="Closing BRILink" description="Closing menyimpan snapshot cash, saldo, fee, dana luar, injeksi, selisih, dan audit." endpoint="/api/brilink/closing" initialJson={JSON.stringify({ operational_date: new Date().toISOString().slice(0, 10), actual_cash_amount: 0, actual_saldo_amount: 0, note: "" }, null, 2)} />;
}
