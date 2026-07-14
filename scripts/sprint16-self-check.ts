import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { scripts: Record<string, string> };
const runbook = readFileSync("docs/10-release/Production-Runbook.md", "utf8");
const smoke = readFileSync("docs/10-release/Staging-Smoke-Test.md", "utf8");
const envExample = readFileSync(".env.production.example", "utf8");
const remoteUrl = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
const tokenPattern = ["github", "pat", ""].join("_");

assert.equal(existsSync("scripts/production-preflight.ts"), true);
assert.equal(typeof packageJson.scripts["preflight:production"], "string");
assert.equal(packageJson.scripts["check:rc"].includes("preflight:production"), true);
assert.match(runbook, /Do not use `prisma db push` in production/);
assert.match(runbook, /prisma migrate deploy/);
assert.match(runbook, /Backup production database/);
assert.match(smoke, /Kasir Warung cannot access BRILink/);
assert.match(smoke, /Petugas BRILink cannot access Warung/);
assert.match(envExample, /DATABASE_URL=/);
assert.match(envExample, /SESSION_SECRET=/);
assert.equal(remoteUrl.includes(tokenPattern), false);

console.log("Sprint 16 production prep self-check OK");
