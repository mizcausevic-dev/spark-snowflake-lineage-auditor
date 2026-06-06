create or replace view analytics.lineage_asset_risk as
with scored as (
  select
    asset_id,
    owner,
    freshness_hours,
    downstream_dashboards,
    pii_columns,
    unknown_upstreams,
    failed_quality_checks,
    least(
      100,
      freshness_hours * 1.4
        + downstream_dashboards * 3.2
        + pii_columns * 8
        + unknown_upstreams * 10
        + failed_quality_checks * 11
    ) as lineage_risk_score
  from analytics.raw_lineage_export
)
select
  asset_id,
  owner,
  freshness_hours,
  downstream_dashboards,
  pii_columns,
  unknown_upstreams,
  failed_quality_checks,
  lineage_risk_score,
  case
    when lineage_risk_score >= 72 then 'blocked'
    when lineage_risk_score >= 40 then 'watch'
    else 'trusted'
  end as lineage_posture
from scored;

create or replace view analytics.board_lineage_posture as
select
  lineage_posture,
  count(*) as asset_count,
  avg(lineage_risk_score) as average_lineage_risk,
  max(lineage_risk_score) as max_lineage_risk
from analytics.lineage_asset_risk
group by lineage_posture;
