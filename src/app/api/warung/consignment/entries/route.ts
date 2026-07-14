import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { consignmentService } from "@/services/consignment/consignment-service";

export async function POST(request: Request) {
  return withApi(async () => ok(await consignmentService.createEntry(await requireAuth(), "WARUNG", await jsonBody(request))));
}
