import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungPurchaseService } from "@/services/warung/purchase/warung-purchase-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  return withApi(async () => ok(await warungPurchaseService.payDebt(await requireAuth(), (await params).id, await jsonBody(request))));
}
