import { readFileSync } from "node:fs";
import { buildLineageSummary, type LineageInput } from "./index.js";

const file = process.argv[2] ?? "fixtures/lineage-export.json";
const input = JSON.parse(readFileSync(file, "utf8")) as LineageInput;
console.log(JSON.stringify(buildLineageSummary(input), null, 2));

