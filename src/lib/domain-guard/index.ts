import type { AuthContext } from "@/lib/auth";

export type Domain = "WARUNG" | "BRILINK" | "GLOBAL";

export async function requireDomain(_context: AuthContext, _domain: Domain) {
  throw new Error("Domain guard belum diimplementasikan. Sprint 01 scope.");
}
