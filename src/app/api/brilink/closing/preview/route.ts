import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkClosingService } from "@/services/closing/brilink-closing-service";

export async function GET(request: Request) {
  return withApi(async () => ok(await brilinkClosingService.previewClosing(await requireAuth(), Object.fromEntries(new URL(request.url).searchParams))));
}
