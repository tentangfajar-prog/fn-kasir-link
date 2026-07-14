import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungClosingService } from "@/services/closing/warung-closing-service";

export async function GET(request: Request) {
  return withApi(async () => ok(await warungClosingService.previewClosing(await requireAuth(), Object.fromEntries(new URL(request.url).searchParams))));
}
