import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkCoreService } from "@/services/brilink/core/brilink-core-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await brilinkCoreService.preview(await requireAuth(), await jsonBody(request))));
}
