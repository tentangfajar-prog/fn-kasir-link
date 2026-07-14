import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function BrilinkConsignmentPage() {
  return <ApiJsonForm title="Konsinyasi BRILink" description="Entry konsinyasi BRILink. Pembayaran memakai Cash BRILink lewat service layer." endpoint="/api/brilink/consignment/entries" initialJson={JSON.stringify({ partner_id: "", item_name: "", qty_received: "1", unit_cost_amount: 0, operational_date: new Date().toISOString().slice(0, 10), note: "" }, null, 2)} />;
}
