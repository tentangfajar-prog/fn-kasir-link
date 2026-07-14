import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungFinanceService } from "@/services/warung/finance/warung-finance-service";

export async function GET(request: Request) {
  return withApi(async () => {
    const url = new URL(request.url);
    return ok(await warungFinanceService.dailySummary(await requireAuth(), Object.fromEntries(url.searchParams)));
  });
}
