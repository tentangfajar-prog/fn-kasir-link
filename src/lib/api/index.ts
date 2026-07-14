import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";

export async function jsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function ok(data: unknown = null, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ ok: false, error: { code: "VALIDATION_ERROR", issues: error.issues } }, { status: 422 });
  if (error instanceof AppError) {
    const status = error.code === "UNAUTHENTICATED" ? 401 : error.code === "FORBIDDEN" ? 403 : 400;
    return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status });
  }
  console.error(error);
  return NextResponse.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan sistem." } }, { status: 500 });
}

export function withApi(handler: () => Promise<Response>) {
  return handler().catch(fail);
}
