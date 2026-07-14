import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function WarungPosPage() {
  return <ApiJsonForm title="POS Warung" description="Checkout POS Warung. Harga, stok, HPP, ledger, dan audit dihitung service layer." endpoint="/api/warung/pos/checkout" initialJson={JSON.stringify({ items: [{ sellable_item_id: "", qty: 1, manual_price_amount: null }], payment_method_id: "", operational_date: new Date().toISOString().slice(0, 10), note: "" }, null, 2)} />;
}
