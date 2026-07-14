import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { brilinkCoreService } from "@/services/brilink/core/brilink-core-service";

export async function GET() {
  return withApi(async () => ok(await brilinkCoreService.getNewTransactionContext(await requireAuth())));
}
