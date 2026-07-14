export type AuthContext = {
  userId: string;
  role: "OWNER" | "ADMIN" | "KASIR_WARUNG" | "PETUGAS_BRILINK";
};

export async function requireAuth(): Promise<AuthContext> {
  throw new Error("Auth belum diimplementasikan. Sprint 01 scope.");
}
