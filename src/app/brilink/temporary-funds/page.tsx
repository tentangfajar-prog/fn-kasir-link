import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function BrilinkTemporaryFundsPage() {
  return <ApiJsonForm title="Dana di Luar & Injeksi BRILink" description="Dana sementara keluar/masuk. Pengembalian cicil tersedia lewat API return." endpoint="/api/brilink/temporary-funds/dana-luar" initialJson={JSON.stringify({ borrower_name: "", nominal_amount: 0, source_account: "CASH", operational_date: new Date().toISOString().slice(0, 10), notes: "" }, null, 2)} />;
}
