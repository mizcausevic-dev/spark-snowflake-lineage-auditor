export interface LineageAsset {
  assetId: string;
  owner: string;
  freshnessHours: number;
  downstreamDashboards: number;
  piiColumns: number;
  unknownUpstreams: number;
  failedQualityChecks: number;
  nextAction: string;
}

export interface LineageInput {
  asOf: string;
  estate: string;
  assets: LineageAsset[];
}

export interface LineageFinding extends LineageAsset {
  lineageRiskScore: number;
  posture: "trusted" | "watch" | "blocked";
  boardNarrative: string;
}

export interface LineageSummary {
  asOf: string;
  estate: string;
  aggregateLineageRisk: number;
  blockedAssets: number;
  primaryRecommendation: string;
  findings: LineageFinding[];
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const round = (value: number): number => Math.round(value * 100) / 100;

export function scoreAsset(asset: LineageAsset): LineageFinding {
  const lineageRiskScore = round(
    clamp(
      asset.freshnessHours * 1.4 +
        asset.downstreamDashboards * 3.2 +
        asset.piiColumns * 8 +
        asset.unknownUpstreams * 10 +
        asset.failedQualityChecks * 11
    )
  );
  const posture = lineageRiskScore >= 72 ? "blocked" : lineageRiskScore >= 40 ? "watch" : "trusted";
  const boardNarrative =
    posture === "blocked"
      ? `${asset.assetId} should not feed executive reporting until ownership, freshness, and PII evidence close.`
      : posture === "watch"
        ? `${asset.assetId} needs visible lineage proof before the next decision packet.`
        : `${asset.assetId} is trusted with current lineage and quality evidence.`;

  return { ...asset, lineageRiskScore, posture, boardNarrative };
}

export function buildLineageSummary(input: LineageInput): LineageSummary {
  if (!input.assets.length) {
    throw new Error("At least one lineage asset is required.");
  }
  const findings = input.assets.map(scoreAsset).sort((a, b) => b.lineageRiskScore - a.lineageRiskScore);
  const aggregateLineageRisk = round(
    findings.reduce((sum, asset) => sum + asset.lineageRiskScore, 0) / findings.length
  );
  const blockedAssets = findings.filter((asset) => asset.posture === "blocked").length;
  const top = findings[0];
  return {
    asOf: input.asOf,
    estate: input.estate,
    aggregateLineageRisk,
    blockedAssets,
    primaryRecommendation: `${top.assetId}: ${top.nextAction}`,
    findings
  };
}

