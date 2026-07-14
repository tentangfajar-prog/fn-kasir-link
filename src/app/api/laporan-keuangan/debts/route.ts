import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { financialReportService } from "@/services/reports/financial-report-service";

export async function GET(request: Request) {
  return withApi(async () => ok(await financialReportService.getDebtAndPayables(await requireAuth(), Object.fromEntries(new URL(request.url).searchParams))));
}
