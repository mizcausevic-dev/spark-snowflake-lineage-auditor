import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const markers = ["Spark Snowflake Lineage Auditor", "Lineage drift becomes visible", "spark.customer_events_gold"];
const missing = markers.filter((marker) => !html.includes(marker));

if (missing.length > 0) {
  throw new Error(`Missing static markers: ${missing.join(", ")}`);
}

console.log("smoke ok");

