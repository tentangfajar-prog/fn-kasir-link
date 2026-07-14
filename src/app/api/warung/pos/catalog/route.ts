import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungPosService } from "@/services/warung/pos/warung-pos-service";

export async function GET() {
  return withApi(async () => ok(await warungPosService.catalog(await requireAuth())));
}
