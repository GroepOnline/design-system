import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class RuntimePackagesTest(unittest.TestCase):
    def test_token_package_is_generated_from_canonical_css(self):
        subprocess.run(["python3", "scripts/build-runtime-packages.py"], cwd=ROOT, check=True)
        self.assertEqual((ROOT / "tokens.css").read_text(), (ROOT / "packages/tokens/tokens.css").read_text())

    def test_package_manifests_are_product_agnostic(self):
        for path, expected in [("packages/tokens/package.json", "@signaal/tokens"), ("packages/react/package.json", "@signaal/react")]:
            data = json.loads((ROOT / path).read_text())
            self.assertEqual(data["name"], expected)
            self.assertTrue(data["private"])

    def test_react_surface_has_no_product_specific_wiring(self):
        source = (ROOT / "packages/react/index.js").read_text().lower()
        for forbidden in ("dsh-", "chefgroep", "deepseek", "commander", "opencodex"):
            self.assertNotIn(forbidden, source)

if __name__ == "__main__":
    unittest.main()
