import { readFileSync } from "node:fs";
import { buildLineageSummary, type LineageInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/lineage-export.json", "utf8")) as LineageInput;
const summary = buildLineageSummary(input);

console.log(`estate=${summary.estate}`);
console.log(`risk=${summary.aggregateLineageRisk}`);
console.log(`blocked=${summary.blockedAssets}`);
console.log(`recommendation=${summary.primaryRecommendation}`);

