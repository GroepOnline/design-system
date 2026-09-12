import importlib.util
import json
import re
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def module(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


run = module("design-run")
report = module("render-design-report")
installer = module("install-design-skills")


class DesignRunTests(unittest.TestCase):
    def test_no_stage_skipping_and_changed_evidence_invalidates_progress(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            dest = root / "run"
            proof = root / "proof.txt"
            proof.write_text("observed")
            run.prepare(dest, "Test", "identity-spatial")
            with self.assertRaisesRegex(ValueError, "Unfinished"):
                run.advance(dest, "direction", [proof], "review")
            run.advance(dest, "ground", [proof], "grounded")
            proof.write_text("changed")
            with self.assertRaisesRegex(ValueError, "evidence changed"):
                run.advance(dest, "direction", [proof], "review")
            run.advance(dest, "ground", [proof], "rechecked")
            run.advance(dest, "direction", [proof], "reviewed")
            state = run.advance(dest, "ground", [proof], "new grounding")
            self.assertEqual(state["nodes"]["direction"]["status"], "pending")

    def test_existing_destinations_are_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "keep").write_text("owned")
            with self.assertRaises(FileExistsError):
                run.prepare(root, "Test", "identity-spatial")
            self.assertEqual((root / "keep").read_text(), "owned")

    def test_report_rejects_incomplete_template_and_unsafe_links(self):
        data = json.loads(
            (ROOT / "reports/chefgroep-auth-2026-09-12/report.json").read_text()
        )
        data["sections"].pop()
        with self.assertRaisesRegex(ValueError, "complete template"):
            report.render(data)
        with self.assertRaises(ValueError):
            report.safe_link("javascript:alert(1)")
        with self.assertRaises(ValueError):
            report.safe_link("//attacker.test/file")

    def test_report_escapes_source_content(self):
        data = json.loads(
            (ROOT / "reports/chefgroep-auth-2026-09-12/report.json").read_text()
        )
        data["title"] = "<script>bad()</script>"
        output = report.render(data)
        self.assertNotIn("<script>bad()", output)
        self.assertIn("&lt;script&gt;", output)

    def test_report_assets_are_portable(self):
        with tempfile.TemporaryDirectory() as tmp:
            output_dir = Path(tmp)
            report.copy_assets(output_dir)
            css = (ROOT / "templates/design-report/report.css").read_text()
            self.assertIn("url('fonts/", css)
            self.assertNotIn("../../templates/", css)
            for name in (
                "instrument-sans-latin-wght-normal.woff2",
                "bricolage-grotesque-latin-wght-normal.woff2",
                "INSTRUMENT-SANS-LICENSE",
                "BRICOLAGE-GROTESQUE-LICENSE",
            ):
                self.assertTrue((output_dir / "fonts" / name).is_file())

    def test_report_local_figures_are_packaged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source_dir = root / "source"
            output_dir = root / "report"
            source_dir.mkdir()
            (source_dir / "figure.png").write_bytes(b"figure")
            data = {"figures": [{"src": "figure.png"}]}
            packaged = report.package_figures(data, source_dir, output_dir)
            emitted = packaged["figures"][0]["src"]
            self.assertTrue(emitted.startswith("assets/"))
            self.assertTrue((output_dir / emitted).is_file())
            self.assertEqual(data["figures"][0]["src"], "figure.png")

    def test_operator_template_local_assets_are_self_contained(self):
        template = ROOT / "templates/operator-evidence"
        html = (template / "index.html").read_text()
        refs = re.findall(r'(?:src|href)="([^"]+)"', html)
        local = [ref for ref in refs if not ref.startswith(("#", "https://"))]
        self.assertGreaterEqual(len(local), 3)
        for ref in local:
            self.assertTrue((template / ref).is_file(), ref)

    def test_installed_skill_is_self_contained(self):
        source = ROOT / ".agents/skills/design-system/SKILL.md"
        output = installer.generated_mirror(source, "design-system")
        self.assertIn("# ChefGroep design system", output)
        self.assertIn(
            "GroepOnline/design-system/.agents/skills/design-system/SKILL.md", output
        )
        self.assertNotIn(str(ROOT), output)


if __name__ == "__main__":
    unittest.main()
