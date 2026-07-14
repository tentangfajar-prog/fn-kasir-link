import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { attendanceService } from "@/services/absensi/attendance-service";

export async function GET() {
  return withApi(async () => ok(await attendanceService.displayQr(await requireAuth())));
}
