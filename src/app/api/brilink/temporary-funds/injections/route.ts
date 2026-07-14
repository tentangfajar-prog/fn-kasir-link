import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkTemporaryFundService } from "@/services/brilink/temporary-funds/brilink-temporary-fund-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await brilinkTemporaryFundService.createInjection(await requireAuth(), await jsonBody(request))));
}
