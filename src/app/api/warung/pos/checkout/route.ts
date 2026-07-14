import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungPosService } from "@/services/warung/pos/warung-pos-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await warungPosService.checkout(await requireAuth(), await jsonBody(request))));
}
