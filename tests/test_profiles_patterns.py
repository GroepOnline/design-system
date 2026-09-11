import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class ProfilesPatternsTest(unittest.TestCase):
    def test_profiles_have_design_and_taste(self):
        for profile in [p for p in (ROOT / "profiles").iterdir() if p.is_dir()]:
            data = json.loads((profile / "profile.json").read_text())
            self.assertTrue(data.get("optional"), profile.name)
            self.assertTrue((profile / data["design"]).is_file(), profile.name)
            self.assertTrue((profile / data["taste"]).is_file(), profile.name)

    def test_patterns_reference_real_components_and_variants(self):
        catalogs = {}
        for cat in (ROOT / "components").glob("*/catalog.json"):
            data = json.loads(cat.read_text())
            catalogs[data["component"]] = {e["id"] for e in data["entries"]}
        profiles = {p.name for p in (ROOT / "profiles").iterdir() if p.is_dir()}
        for manifest in (ROOT / "patterns").glob("*/pattern.json"):
            data = json.loads(manifest.read_text())
            self.assertTrue(data.get("optional"), data["id"])
            for profile in data.get("profiles", []):
                self.assertIn(profile, profiles, data["id"])
            for component, variants in data["components"].items():
                self.assertIn(component, catalogs, data["id"])
                for variant in variants:
                    self.assertIn(variant, catalogs[component], f"{data['id']}:{component}:{variant}")
            example = data.get("example")
            self.assertTrue(example, data["id"])
            self.assertTrue((manifest.parent / example).is_file(), data["id"])

    def test_context_order_is_base_profile_extension(self):
        out = subprocess.check_output([str(ROOT / "s.sh"), "context", "dsh", "operator-dense"], text=True)
        keys = [line.split("=", 1)[0] for line in out.splitlines()]
        self.assertLess(keys.index("base_design"), keys.index("profile_design"))
        self.assertLess(keys.index("profile_design"), keys.index("extension_design"))

    def test_unknown_context_fails_open(self):
        result = subprocess.run([str(ROOT / "s.sh"), "context", "missing-ext", "missing-profile"], text=True, capture_output=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn("warning_profile=", result.stdout)
        self.assertIn("warning_extension=", result.stdout)

    def test_generated_indexes_exist(self):
        self.assertTrue((ROOT / "profiles/index.html").is_file())
        self.assertTrue((ROOT / "patterns/index.html").is_file())

    def test_component_gallery_matches_catalog_truth(self):
        catalogs = list((ROOT / "components").glob("*/catalog.json"))
        total_components = len(catalogs)
        total_variants = sum(len(json.loads(p.read_text())["entries"]) for p in catalogs)
        html = (ROOT / "components/index.html").read_text()
        self.assertIn(f"{total_components} componenten · {total_variants} varianten", html)
        self.assertIn('id="componentFilter"', html)
        self.assertIn('id="categoryFilter"', html)
        self.assertIn('./studio/index.html', html)

if __name__ == "__main__":
    unittest.main()
