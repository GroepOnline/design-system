import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAMILIES = ["avatar", "avatar-stack", "metric", "key-value", "status", "code", "diff", "timeline", "data-grid"]

class DataDisplayTest(unittest.TestCase):
    def test_catalogs_exist_and_have_one_active(self):
        for name in FAMILIES:
            data = json.loads((ROOT / "components" / name / "catalog.json").read_text())
            self.assertGreaterEqual(len(data["entries"]), 2, name)
            self.assertEqual(sum(e.get("status") == "active" for e in data["entries"]), 1, name)

    def test_runtime_exports_all_data_primitives(self):
        js = (ROOT / "packages/react/index.js").read_text()
        for symbol in ["Avatar", "AvatarStack", "Metric", "KeyValue", "Status", "CodeBlock", "Diff", "Timeline", "DataGrid"]:
            self.assertIn(f"export ", js)
            self.assertIn(symbol, js)

    def test_dense_data_remains_scroll_safe(self):
        css = (ROOT / "packages/react/styles.css").read_text()
        self.assertIn(".sg-data-grid-wrap", css)
        self.assertIn("overflow-x:auto", css)
        self.assertIn("font-variant-numeric:tabular-nums", css)

    def test_semantic_demos_use_native_structures(self):
        grid = (ROOT / "components/data-grid/self/default.html").read_text()
        timeline = (ROOT / "components/timeline/self/default.html").read_text()
        code = (ROOT / "components/code/self/block.html").read_text()
        self.assertIn("<table", grid)
        self.assertTrue("<ol" in timeline or "<ul" in timeline)
        self.assertIn("<pre", code)
        self.assertIn("<code", code)

    def test_runtime_remains_product_agnostic(self):
        text = "\n".join((ROOT / p).read_text() for p in ["packages/react/index.js", "packages/react/index.d.ts", "packages/react/styles.css"])
        for forbidden in ["ChefGroep", "DSH", "OpenCodex", "Commander"]:
            self.assertNotIn(forbidden, text)

if __name__ == "__main__":
    unittest.main()
