import contextlib
import importlib.machinery
import importlib.util
import io
import json
import subprocess
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
OCX_ROOT = ROOT / "extensions" / "ocx"
loader = importlib.machinery.SourceFileLoader("ds_cli", str(ROOT / "ds"))
spec = importlib.util.spec_from_loader(loader.name, loader)
ds = importlib.util.module_from_spec(spec)
loader.exec_module(ds)

class ExtensionsTest(unittest.TestCase):
    def test_declared_extensions_validate(self):
        for ext in ("chefgroep", "dsh", "ocx"):
            result = subprocess.run(["./ds", "extension", "check", ext], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_ocx_manifest_declares_the_supported_component_subset(self):
        manifest = json.loads((OCX_ROOT / "extension.json").read_text())

        self.assertEqual(manifest["id"], "ocx")
        self.assertEqual(manifest["label"], "OCX operator surface")
        self.assertIs(manifest["optional"], True)
        self.assertEqual(
            manifest["components"],
            {
                "button": {
                    "include": ["standard", "primary", "ghost", "gbtn", "with-kbd"],
                    "preferred": "standard",
                },
                "badge": {"include": ["default"], "preferred": "default"},
            },
        )

    def test_ocx_contract_documents_exist_and_are_non_empty(self):
        manifest = json.loads((OCX_ROOT / "extension.json").read_text())
        documents = (manifest["design"], manifest["taste"], "COMPONENTS.md")

        for relative_path in documents:
            with self.subTest(document=relative_path):
                content = (OCX_ROOT / relative_path).read_text().strip()
                self.assertTrue(content)
                self.assertTrue(content.startswith("# OCX"))

    def test_ocx_button_view_filters_variants_and_marks_preferred(self):
        manifest = ds.load_manifest("button")
        fixture = {**manifest, "desc": "", "docs": {}}
        expected = {"standard", "primary", "ghost", "gbtn", "with-kbd"}

        with mock.patch.object(ds, "load_manifest", return_value=fixture), contextlib.redirect_stdout(io.StringIO()) as out:
            ds.cmd_clist("button", extension="ocx")

        rendered = out.getvalue()
        for entry_id in expected:
            self.assertIn(entry_id, rendered)
        for entry_id in {entry["id"] for entry in manifest["entries"]} - expected:
            self.assertNotIn(entry_id, rendered)
        self.assertIn("PREFERRED", rendered)
        self.assertIn(f"{len(expected)} getoond van {len(manifest['entries'])} varianten", rendered)

    def test_ocx_hides_component_families_not_in_its_subset(self):
        manifest = ds.load_manifest("settings")
        fixture = {**manifest, "desc": "", "docs": {}}

        with mock.patch.object(ds, "load_manifest", return_value=fixture), contextlib.redirect_stdout(io.StringIO()) as out:
            ds.cmd_clist("settings", extension="ocx")

        self.assertIn(f"0 getoond van {len(manifest['entries'])} varianten", out.getvalue())

    def test_shell_context_resolves_ocx_overlays(self):
        result = subprocess.run(["./s.sh", "context", "ocx"], cwd=ROOT, text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        context = dict(line.split("=", 1) for line in result.stdout.splitlines())
        self.assertEqual(context["extension"], "ocx")
        self.assertEqual(Path(context["design"]), OCX_ROOT / "DESIGN.md")
        self.assertEqual(Path(context["taste"]), OCX_ROOT / "TASTE.md")
        self.assertNotIn("warning", context)

    def test_component_list_scales_to_300_entries(self):
        entries = [{"id": f"v{i:03d}", "origin": "self", "source": None, "status": "locked", "note": ""} for i in range(300)]
        manifest = {"title": "button", "cat": "primitieven", "desc": "scale fixture", "entries": entries, "docs": {}}
        with mock.patch.object(ds, "load_manifest", return_value=manifest), contextlib.redirect_stdout(io.StringIO()) as out:
            ds.cmd_clist("button")
        self.assertIn("300 getoond van 300 varianten", out.getvalue())

    def test_core_listing_does_not_require_extensions(self):
        with mock.patch.object(ds, "EXTENSIONS", str(ROOT / "missing-extensions")), contextlib.redirect_stdout(io.StringIO()) as out:
            ds.cmd_list()
        self.assertIn(f"{len(ds.components())} componenten", out.getvalue())

    def test_unknown_shell_context_falls_back_without_failing(self):
        result = subprocess.run(["./s.sh", "context", "does-not-exist"], cwd=ROOT, text=True, capture_output=True)
        self.assertEqual(result.returncode, 0)
        self.assertIn("using base", result.stdout)
