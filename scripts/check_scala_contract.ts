import { readFileSync } from "node:fs";

const scala = readFileSync("scala/LineageRiskAuditor.scala", "utf8");
const required = ["object LineageRiskAuditor", "final case class LineageAsset", "def risk", "def posture"];
const missing = required.filter((marker) => !scala.includes(marker));

if (missing.length > 0) {
  throw new Error(`Scala contract missing: ${missing.join(", ")}`);
}

console.log("scala contract ok");

