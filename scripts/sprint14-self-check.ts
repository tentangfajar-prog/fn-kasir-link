import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema = readFileSync("prisma/schema.prisma", "utf8");
const warung = readFileSync("src/services/closing/warung-closing-service.ts", "utf8");
const brilink = readFileSync("src/services/closing/brilink-closing-service.ts", "utf8");
const report = readFileSync("src/services/reports/financial-report-service.ts", "utf8");
const sidebar = readFileSync("src/components/layout/sidebar.tsx", "utf8");

assert.match(schema, /model WarungClosing /);
assert.match(schema, /model BrilinkClosing /);
assert.match(schema, /model ReversalRecord /);
assert.match(warung, /warung\.closing/);
assert.match(warung, /warungCashLedger\.create/);
assert.match(warung, /differenceAmount/);
assert.match(warung, /AuditService/);
assert.match(brilink, /brilink\.closing/);
assert.match(brilink, /cashDifferenceAmount/);
assert.match(brilink, /saldoDifferenceAmount/);
assert.match(brilink, /AuditService/);
assert.match(report, /warungClosing/);
assert.match(report, /brilinkClosing/);
assert.match(sidebar, /Closing Warung/);
assert.match(sidebar, /Closing BRILink/);

console.log("Sprint 14 closing reversal self-check OK");
