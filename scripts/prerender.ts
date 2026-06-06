import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { LineageInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/lineage-export.json", "utf8")) as LineageInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");

