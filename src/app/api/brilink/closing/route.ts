import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkClosingService } from "@/services/closing/brilink-closing-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await brilinkClosingService.createClosing(await requireAuth(), await jsonBody(request))));
}
