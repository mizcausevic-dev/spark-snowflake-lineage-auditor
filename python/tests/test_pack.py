import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from lineage_auditor import build_pack


class LineagePackTest(unittest.TestCase):
    def test_build_pack_flags_blocked_asset(self):
        payload = json.loads(Path("fixtures/lineage-export.json").read_text(encoding="utf-8"))
        pack = build_pack(payload)
        self.assertEqual(pack["topAsset"], "spark.customer_events_gold")
        self.assertEqual(pack["blockedAssets"], 1)
        self.assertIn("PII masking evidence", pack["recommendation"])


if __name__ == "__main__":
    unittest.main()
