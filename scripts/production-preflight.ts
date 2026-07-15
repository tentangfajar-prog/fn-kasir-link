import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
const remoteUrl = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const trackedFiles = execSync("git ls-files", { encoding: "utf8" }).trim().split("\n");
const tokenPattern = ["github", "pat", ""].join("_");

assert.equal(existsSync(".env.example"), true);
assert.equal(existsSync(".env.production.example"), true);
assert.equal(existsSync("docker-compose.example.yml"), true);
assert.equal(existsSync("docs/10-release/Production-Runbook.md"), true);
assert.equal(existsSync("docs/10-release/Staging-Deploy-Runbook.md"), true);
assert.equal(existsSync(".env.staging.example"), true);
assert.equal(packageJson.scripts["check:rc"].includes("check:sprint16"), true);
assert.equal(packageJson.scripts["check:rc"].includes("preflight:staging"), true);
assert.equal(remoteUrl.includes(tokenPattern), false);
assert.equal(packageJson.scripts["start"], "node .next/standalone/server.js");
assert.equal(packageJson.scripts["db:migrate:deploy"], "prisma migrate deploy");
assert.equal(packageJson.scripts["db:push"], undefined, "production builds must not expose db:push; use db:push:dev locally");
assert.equal(existsSync("prisma/migrations/20260714223000_initial/migration.sql"), true);
assert.equal(existsSync("src/proxy.ts"), true);

for (const file of trackedFiles) {
  if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif") || file.endsWith(".webp")) continue;
  const text = readFileSync(file, "utf8");
  assert.equal(text.includes(tokenPattern), false, `token pattern leaked in ${file}`);
}

console.log("Production preflight OK");
