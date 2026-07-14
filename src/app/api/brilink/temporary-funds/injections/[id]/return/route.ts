import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkTemporaryFundService } from "@/services/brilink/temporary-funds/brilink-temporary-fund-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  return withApi(async () => ok(await brilinkTemporaryFundService.returnInjection(await requireAuth(), (await params).id, await jsonBody(request))));
}
