import { ok, withApi, jsonBody } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { authService } from "@/services/auth/auth-service";

export async function POST(request: Request) {
  return withApi(async () => {
    const ctx = await requireAuth();
    await authService.changePassword(ctx, await jsonBody(request));
    return ok(null);
  });
}
