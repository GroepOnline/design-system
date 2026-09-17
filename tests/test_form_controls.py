import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class FormControlsTest(unittest.TestCase):
    def test_form_catalogs_exist_and_have_one_active(self):
        for name in ("field", "input", "textarea", "select", "checkbox", "radio", "switch"):
            data = json.loads((ROOT / "components" / name / "catalog.json").read_text())
            self.assertEqual(data["cat"], "forms")
            self.assertEqual(sum(e["status"] == "active" for e in data["entries"]), 1, name)
            self.assertTrue(data.get("families"), name)

    def test_input_motion_is_optional_composition_only(self):
        data = json.loads((ROOT / "components/input/catalog.json").read_text())
        ids = {e["id"] for e in data["entries"]}
        self.assertIn("search-beam", ids)
        source = (ROOT / "packages/react/index.js").read_text()
        input_block = source[source.index("export const Input"):source.index("export const Textarea")]
        self.assertNotIn("MotionSurface", input_block)
        self.assertNotIn("sg-motion-", input_block)

    def test_runtime_exports_native_form_primitives(self):
        source = (ROOT / "packages/react/index.js").read_text()
        for symbol in ("Field", "Input", "Textarea", "Select", "InputGroup", "InputAffix", "Checkbox", "Radio", "Switch"):
            self.assertIn(symbol, source)
        self.assertIn('type: "checkbox"', source)
        self.assertIn('type: "radio"', source)
        self.assertIn('role: "switch"', source)
        self.assertIn('"aria-checked": checked', source)

    def test_form_css_has_invalid_disabled_and_coarse_pointer_contracts(self):
        css = (ROOT / "tokens.css").read_text()
        for fragment in ('[aria-invalid="true"]', ':disabled', '@media (pointer: coarse)', '.choice input[type="checkbox"]', '.choice input[type="radio"]'):
            self.assertIn(fragment, css)

    def test_prefix_suffix_uses_structural_input_group(self):
        demo = (ROOT / "components/input/self/prefix-suffix.html").read_text()
        self.assertIn('class="input-group"', demo)
        self.assertIn('class="input-affix"', demo)
        self.assertNotIn('class="prefix"', demo)

    def test_switch_demo_is_interactive(self):
        demo = (ROOT / "components/switch/self/default.html").read_text()
        self.assertIn('addEventListener("click"', demo)
        self.assertIn('setAttribute("aria-checked"', demo)

    def test_generated_catalog_groups_form_families(self):
        html = (ROOT / "components/input/index.html").read_text()
        for label in ("Text", "Search", "States"):
            self.assertIn(f'family-title">{label}', html)

if __name__ == "__main__":
    unittest.main()
