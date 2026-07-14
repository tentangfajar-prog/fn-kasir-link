import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function WarungPurchasesPage() {
  return <ApiJsonForm title="Pembelian Warung" description="Nota pembelian tunai/hutang. Stok, HPP, kas, hutang, dan audit diproses service layer." endpoint="/api/warung/purchases" initialJson={JSON.stringify({ partner_id: "", payment_status: "PAID_CASH", cash_source: "KAS_LACI", invoice_discount_amount: 0, operational_date: new Date().toISOString().slice(0, 10), items: [{ stock_product_id: "", qty_base: "1", unit_price_amount: 0, discount_amount: 0 }], note: "" }, null, 2)} />;
}
