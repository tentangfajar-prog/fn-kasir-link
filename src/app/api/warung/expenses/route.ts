import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { warungFinanceService } from "@/services/warung/finance/warung-finance-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await warungFinanceService.createExpense(await requireAuth(), await jsonBody(request))));
}
