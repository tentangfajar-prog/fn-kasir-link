import { NextResponse } from "next/server";
import { revokeSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.split("=")[1];
  if (token) await revokeSession(token);
  const response = NextResponse.json({ ok: true, data: null });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0, path: "/" });
  return response;
}
