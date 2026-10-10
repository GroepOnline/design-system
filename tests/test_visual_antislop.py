import importlib.machinery
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
loader = importlib.machinery.SourceFileLoader("design_system_antislop", str(ROOT / "ds"))
spec = importlib.util.spec_from_loader(loader.name, loader)
ds = importlib.util.module_from_spec(spec)
loader.exec_module(ds)

class VisualAntiSlopTests(unittest.TestCase):
    def test_rejects_purple_cyan_gradient(self):
        css = ".x{background:linear-gradient(90deg,#8b5cf6,#22d3ee)}"
        self.assertTrue(ds._visual_antislop_reasons(css))

    def test_rejects_ambient_accent_gradient(self):
        css = ".x{background:radial-gradient(circle,var(--accent-soft),transparent)}"
        self.assertIn("accent used as atmospheric gradient", ds._visual_antislop_reasons(css))

    def test_allows_flat_semantic_focus_ring(self):
        css = ".x:focus{box-shadow:0 0 0 3px var(--accent-soft);border-color:var(--accent)}"
        self.assertEqual([], ds._visual_antislop_reasons(css))

    def test_allows_neutral_material_gradient(self):
        css = ".x{background:linear-gradient(#fff,#f7f6f5)}"
        self.assertEqual([], ds._visual_antislop_reasons(css))

if __name__ == "__main__":
    unittest.main()
