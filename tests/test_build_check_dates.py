import importlib.machinery
import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).parents[1]
loader = importlib.machinery.SourceFileLoader("design_system_cli", str(ROOT / "ds"))
spec = importlib.util.spec_from_loader(loader.name, loader)
ds = importlib.util.module_from_spec(spec)
loader.exec_module(ds)


class GeneratedDateNormalizationTests(unittest.TestCase):
    def test_generated_chrome_dates_are_normalized(self):
        before = '<div class="gen">gegenereerd door ds build op 2026-08-25</div>\n'
        after = '<div class="gen">gegenereerd door ds build op 2026-08-30</div>\n'
        self.assertEqual(ds._normalize_generated_wall_clock(before), ds._normalize_generated_wall_clock(after))

    def test_titleblock_and_modeline_dates_are_normalized(self):
        before = '<div class="titelblok">design-system v2 · 2026-08-25</div>\n<span class="ml-opt">ds build 2026-08-25</span>\n'
        after = '<div class="titelblok">design-system v2 · 2026-08-30</div>\n<span class="ml-opt">ds build 2026-08-30</span>\n'
        self.assertEqual(ds._normalize_generated_wall_clock(before), ds._normalize_generated_wall_clock(after))

    def test_document_content_dates_remain_semantic(self):
        before = '<p>Decision effective 2026-08-25</p>\n'
        after = '<p>Decision effective 2026-08-30</p>\n'
        self.assertNotEqual(ds._normalize_generated_wall_clock(before), ds._normalize_generated_wall_clock(after))

    def test_non_date_generated_content_remains_semantic(self):
        before = '<div class="gen">gegenereerd door ds build op 2026-08-25 · 12 docs</div>\n'
        after = '<div class="gen">gegenereerd door ds build op 2026-08-30 · 13 docs</div>\n'
        self.assertNotEqual(ds._normalize_generated_wall_clock(before), ds._normalize_generated_wall_clock(after))


if __name__ == "__main__":
    unittest.main()
