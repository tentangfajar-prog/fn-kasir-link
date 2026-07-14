import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { attendanceService } from "@/services/absensi/attendance-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  return withApi(async () => ok(await attendanceService.correctAttendance(await requireAuth(), (await params).id, await jsonBody(request))));
}
