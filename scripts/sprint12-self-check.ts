import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync("find src/app/api -name route.ts | sort", { encoding: "utf8" }).trim().split("\n");
const schema = readFileSync("prisma/schema.prisma", "utf8");
const auth = readFileSync("src/lib/auth/index.ts", "utf8");
const api = readFileSync("src/lib/api/index.ts", "utf8");
const needed = [
  "src/app/api/auth/login/route.ts",
  "src/app/api/auth/logout/route.ts",
  "src/app/api/auth/me/route.ts",
  "src/app/api/warung/pos/checkout/route.ts",
  "src/app/api/brilink/transactions/route.ts",
  "src/app/api/absensi/check-in/route.ts",
  "src/app/api/dashboard/summary/route.ts",
  "src/app/api/laporan-keuangan/summary/route.ts",
];

for (const file of needed) assert.equal(files.includes(file), true, `missing ${file}`);
assert.match(schema, /model ApiSession /);
assert.match(auth, /SESSION_COOKIE/);
assert.match(auth, /httpOnly|requireAuth|createSession/);
assert.match(api, /ZodError/);
assert.match(api, /UNAUTHENTICATED/);

for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (!file.includes("/auth/login/") && !file.includes("/auth/logout/")) assert.match(text, /requireAuth/, `${file} must require auth`);
  assert.doesNotMatch(text, /github_pat_/);
}

console.log("Sprint 12 API route wiring self-check OK");
