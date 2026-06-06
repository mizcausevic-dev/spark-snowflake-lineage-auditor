import argparse
import json
from pathlib import Path


def score(asset: dict) -> float:
    value = (
        asset["freshnessHours"] * 1.4
        + asset["downstreamDashboards"] * 3.2
        + asset["piiColumns"] * 8
        + asset["unknownUpstreams"] * 10
        + asset["failedQualityChecks"] * 11
    )
    return round(max(0, min(100, value)), 2)


def build_pack(payload: dict) -> dict:
    findings = sorted(
        [{**asset, "lineageRiskScore": score(asset)} for asset in payload["assets"]],
        key=lambda asset: asset["lineageRiskScore"],
        reverse=True,
    )
    return {
        "estate": payload["estate"],
        "topAsset": findings[0]["assetId"],
        "blockedAssets": sum(1 for asset in findings if asset["lineageRiskScore"] >= 72),
        "recommendation": f"{findings[0]['assetId']}: {findings[0]['nextAction']}",
        "findings": findings,
    }


def to_markdown(pack: dict) -> str:
    lines = [
        "# Spark Snowflake Lineage Auditor",
        "",
        f"Estate: {pack['estate']}",
        f"Blocked assets: {pack['blockedAssets']}",
        f"Primary recommendation: {pack['recommendation']}",
        "",
    ]
    for finding in pack["findings"]:
        lines.append(f"- {finding['assetId']} | risk {finding['lineageRiskScore']} | owner {finding['owner']}")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("fixture")
    parser.add_argument("--format", choices=["json", "markdown"], default="json")
    args = parser.parse_args()
    pack = build_pack(json.loads(Path(args.fixture).read_text(encoding="utf-8")))
    if args.format == "markdown":
        print(to_markdown(pack))
    else:
        print(json.dumps(pack, indent=2))


if __name__ == "__main__":
    main()

