import { ok, withApi } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  return withApi(async () => ok(await requireAuth()));
}
