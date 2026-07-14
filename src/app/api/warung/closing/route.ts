import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungClosingService } from "@/services/closing/warung-closing-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await warungClosingService.createClosing(await requireAuth(), await jsonBody(request))));
}
