import { AppError } from "@/lib/errors";
import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { printService } from "@/services/print/print-service";

type PrintableType = "warung_sale" | "brilink_transaction" | "warung_closing" | "brilink_closing" | "consignment_payment";
type Params = { params: Promise<{ entityType: string; entityId: string }> };

const printableTypes = new Set<string>(["warung_sale", "brilink_transaction", "warung_closing", "brilink_closing", "consignment_payment"]);

export async function POST(request: Request, { params }: Params) {
  return withApi(async () => {
    const url = new URL(request.url);
    const { entityType, entityId } = await params;
    if (!printableTypes.has(entityType)) throw new AppError("INVALID_PRINTABLE_TYPE", "Jenis dokumen cetak tidak valid.");
    return ok(await printService.printDocument(await requireAuth(), entityType as PrintableType, entityId, url.searchParams.get("format") ?? "html"));
  });
}
