import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { consignmentService } from "@/services/consignment/consignment-service";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  return withApi(async () => ok(await consignmentService.payConsignor(await requireAuth(), "BRILINK", (await params).id, await jsonBody(request))));
}
