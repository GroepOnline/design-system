import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class MotionTaxonomyTest(unittest.TestCase):
    def test_button_catalog_has_distinct_families(self):
        data = json.loads((ROOT / "components/button/catalog.json").read_text())
        families = {entry.get("family") for entry in data["entries"]}
        self.assertTrue({"emphasis", "utility", "risk", "shortcut", "references"}.issubset(families))
        self.assertGreaterEqual(len(data.get("families", [])), 5)

    def test_motion_catalog_exposes_six_independent_primitives(self):
        data = json.loads((ROOT / "components/motion/catalog.json").read_text())
        ids = {entry["id"] for entry in data["entries"]}
        self.assertEqual(ids, {"beam", "focus-halo", "hover-sweep", "press-ripple", "toggle-glide", "status-pulse"})
        self.assertEqual(sum(entry["status"] == "active" for entry in data["entries"]), 1)

    def test_runtime_motion_is_optional_and_reduced_motion_safe(self):
        css = (ROOT / "tokens.css").read_text()
        for cls in ("sg-motion-beam", "sg-motion-halo", "sg-motion-sweep", "sg-motion-ripple", "sg-motion-glide", "sg-motion-status"):
            self.assertIn(cls, css)
        self.assertIn("prefers-reduced-motion: reduce", css)
        react = (ROOT / "packages/react/index.js").read_text()
        self.assertIn("MotionSurface", react)
        self.assertIn("attachPressRipple", react)

    def test_generated_catalog_groups_families(self):
        subprocess.run([str(ROOT / "ds"), "build"], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        button = (ROOT / "components/button/index.html").read_text()
        motion = (ROOT / "components/motion/index.html").read_text()
        for label in ("Emphasis", "Utility", "Destructive / risk", "Shortcut / command", "References"):
            self.assertIn(f'class="family-title">{label}', button)
        for label in ("Attention / focus", "Acknowledgement", "State transition", "Progress / live"):
            self.assertIn(f'class="family-title">{label}', motion)


if __name__ == "__main__":
    unittest.main()
