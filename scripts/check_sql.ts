import { readFileSync } from "node:fs";

const sql = readFileSync("sql/lineage_risk_views.sql", "utf8").toLowerCase();
const required = ["create or replace view", "lineage_risk_score", "board_lineage_posture", "analytics.raw_lineage_export"];
const missing = required.filter((marker) => !sql.includes(marker));

if (missing.length > 0) {
  throw new Error(`SQL contract missing: ${missing.join(", ")}`);
}

console.log("sql contract ok");

