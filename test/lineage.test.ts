import { describe, expect, it } from "vitest";
import fixture from "../fixtures/lineage-export.json" with { type: "json" };
import { buildLineageSummary, scoreAsset, type LineageInput } from "../src/index.js";

describe("spark snowflake lineage auditor", () => {
  it("scores the customer event table as blocked", () => {
    const finding = scoreAsset((fixture as LineageInput).assets[0]);
    expect(finding.posture).toBe("blocked");
    expect(finding.lineageRiskScore).toBe(100);
  });

  it("summarizes the estate into one recommendation", () => {
    const summary = buildLineageSummary(fixture as LineageInput);
    expect(summary.blockedAssets).toBe(1);
    expect(summary.findings[0].assetId).toBe("spark.customer_events_gold");
    expect(summary.primaryRecommendation).toContain("PII masking evidence");
  });
});

