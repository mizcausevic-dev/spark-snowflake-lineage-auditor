# Architecture

Spark Snowflake Lineage Auditor is intentionally small but multi-language:

- `fixtures/lineage-export.json` stores synthetic lineage posture.
- `src/index.ts` scores asset-level lineage risk.
- `src/app.ts` renders the static public surface and local Express route.
- `python/lineage_auditor/pack.py` generates board-readable review packs.
- `sql/lineage_risk_views.sql` defines Snowflake-style risk views.
- `scala/LineageRiskAuditor.scala` captures Spark-style lineage scoring logic.

Production use would require authenticated warehouse/catalog access, strict PII redaction, role-based access control, and a separation between internal lineage evidence and public executive summaries.

