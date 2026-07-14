import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungPurchaseService } from "@/services/warung/purchase/warung-purchase-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await warungPurchaseService.createPurchase(await requireAuth(), await jsonBody(request))));
}
