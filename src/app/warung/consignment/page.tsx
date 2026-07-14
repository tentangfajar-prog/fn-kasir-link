import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function WarungConsignmentPage() {
  return <ApiJsonForm title="Konsinyasi Warung" description="Entry konsinyasi Warung. Pembayaran dan retur tersedia lewat API per entry." endpoint="/api/warung/consignment/entries" initialJson={JSON.stringify({ partner_id: "", item_name: "", qty_received: "1", unit_cost_amount: 0, operational_date: new Date().toISOString().slice(0, 10), note: "" }, null, 2)} />;
}
