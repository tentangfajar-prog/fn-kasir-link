import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { dashboardService } from "@/services/reports/dashboard-service";

export async function GET(request: Request) {
  return withApi(async () => ok(await dashboardService.getMonthlyChart(await requireAuth(), Object.fromEntries(new URL(request.url).searchParams))));
}
