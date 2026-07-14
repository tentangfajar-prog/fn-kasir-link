import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { PERMISSIONS, ROLE_PERMISSION_CODES } from "../src/services/permissions/permission-catalog";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
const trackedFiles = execSync("git ls-files", { encoding: "utf8" }).trim().split("\n");
const remoteUrl = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const requiredFiles = [
  "src/services/auth/auth-service.ts",
  "src/services/permissions/permission-service.ts",
  "src/services/warung/pos/warung-pos-service.ts",
  "src/services/warung/finance/warung-finance-service.ts",
  "src/services/warung/purchase/warung-purchase-service.ts",
  "src/services/brilink/core/brilink-core-service.ts",
  "src/services/brilink/temporary-funds/brilink-temporary-fund-service.ts",
  "src/services/reports/dashboard-service.ts",
  "src/services/reports/financial-report-service.ts",
  "src/services/absensi/attendance-service.ts",
  "next.config.ts",
  ".env.example",
  "docker-compose.example.yml",
];

for (let sprint = 1; sprint <= 11; sprint += 1) {
  const key = `check:sprint${String(sprint).padStart(2, "0")}`;
  assert.equal(typeof packageJson.scripts[key], "string", `missing ${key}`);
}

for (const file of requiredFiles) assert.equal(trackedFiles.includes(file), true, `missing ${file}`);
assert.equal(remoteUrl, "https://github.com/tentangfajar-prog/fn-kasir-link.git");
assert.equal(remoteUrl.includes(["github", "pat", ""].join("_")), false);

const permissionCodes = new Set(PERMISSIONS.map((permission) => permission.code));
assert.equal(permissionCodes.has("warung.access"), true);
assert.equal(permissionCodes.has("brilink.access"), true);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.access"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.access"), false);
assert.equal(ROLE_PERMISSION_CODES.PETUGAS_BRILINK.includes("warung.pos.use"), false);
assert.equal(ROLE_PERMISSION_CODES.KASIR_WARUNG.includes("brilink.transaction.create"), false);

const trackedText = trackedFiles.filter((file) => !file.endsWith(".png") && !file.endsWith(".jpg") && !file.endsWith(".jpeg") && !file.endsWith(".gif") && !file.endsWith(".webp"));
const tokenPattern = ["github", "pat", ""].join("_");
const knownServerPassword = ["Nurulaini20", "@$"].join("");
for (const file of trackedText) {
  const text = readFileSync(file, "utf8");
  assert.equal(text.includes(tokenPattern), false, `token pattern leaked in ${file}`);
  assert.equal(text.includes(knownServerPassword), false, `server password leaked in ${file}`);
}

const nextConfig = readFileSync("next.config.ts", "utf8");
assert.match(nextConfig, /X-Frame-Options/);
assert.match(nextConfig, /X-Content-Type-Options/);
assert.match(nextConfig, /Referrer-Policy/);
assert.match(nextConfig, /Permissions-Policy/);

console.log("Sprint 11 release candidate self-check OK");
