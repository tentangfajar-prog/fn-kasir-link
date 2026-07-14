import { NextResponse, type NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function forbidden() {
  return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Akses ditolak." } }, { status: 403 });
}

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/") || !MUTATING_METHODS.has(request.method)) return NextResponse.next();
  if (request.headers.get("sec-fetch-site") === "cross-site") return forbidden();

  const origin = request.headers.get("origin");
  if (!origin) return NextResponse.next();

  const originHost = new URL(origin).host;
  const requestHost = request.headers.get("host");
  return originHost === requestHost ? NextResponse.next() : forbidden();
}

export const config = {
  matcher: "/api/:path*",
};
