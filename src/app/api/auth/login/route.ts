import { NextResponse } from "next/server";
import { authService } from "@/services/auth/auth-service";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { fail, jsonBody } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const result = await authService.login(await jsonBody(request));
    const session = await createSession(result.user.id);
    const response = NextResponse.json({ ok: true, data: { user: result.ctx.user, must_change_password: result.mustChangePassword } });
    response.cookies.set(SESSION_COOKIE, session.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: session.expiresAt, path: "/" });
    return response;
  } catch (error) {
    return fail(error);
  }
}
