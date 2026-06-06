final case class LineageAsset(
  assetId: String,
  freshnessHours: Double,
  downstreamDashboards: Double,
  piiColumns: Double,
  unknownUpstreams: Double,
  failedQualityChecks: Double
)

object LineageRiskAuditor {
  def risk(asset: LineageAsset): Double = {
    val raw =
      asset.freshnessHours * 1.4 +
        asset.downstreamDashboards * 3.2 +
        asset.piiColumns * 8 +
        asset.unknownUpstreams * 10 +
        asset.failedQualityChecks * 11

    BigDecimal(Math.max(0, Math.min(100, raw))).setScale(2, BigDecimal.RoundingMode.HALF_UP).toDouble
  }

  def posture(asset: LineageAsset): String =
    risk(asset) match {
      case value if value >= 72 => "blocked"
      case value if value >= 40 => "watch"
      case _ => "trusted"
    }

  def main(args: Array[String]): Unit = {
    val sample = LineageAsset("spark.customer_events_gold", 31, 14, 5, 3, 2)
    println(s"asset=${sample.assetId}")
    println(s"risk=${risk(sample)}")
    println(s"posture=${posture(sample)}")
  }
}
