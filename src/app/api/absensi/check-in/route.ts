import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { attendanceService } from "@/services/absensi/attendance-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await attendanceService.checkIn(await requireAuth(), await jsonBody(request))));
}
