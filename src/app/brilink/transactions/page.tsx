import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function BrilinkTransactionsPage() {
  return <ApiJsonForm title="Transaksi BRILink" description="Transaksi BRILink memakai tarif otomatis dan preview cash/saldo dari service layer." endpoint="/api/brilink/transactions" initialJson={JSON.stringify({ transaction_type_id: "", nominal_amount: 0, bank_category: "DEFAULT", operational_date: new Date().toISOString().slice(0, 10), reference_no: "", target_account_no: "", target_phone_no: "", target_name: "", provider_name: "", customer_name: "", note: "" }, null, 2)} />;
}
