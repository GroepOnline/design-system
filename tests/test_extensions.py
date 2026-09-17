import contextlib
import importlib.machinery
import importlib.util
import io
import subprocess
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
loader = importlib.machinery.SourceFileLoader("ds_cli", str(ROOT / "ds"))
spec = importlib.util.spec_from_loader(loader.name, loader)
ds = importlib.util.module_from_spec(spec)
loader.exec_module(ds)

class ExtensionsTest(unittest.TestCase):
    def test_declared_extensions_validate(self):
        for ext in ("chefgroep", "dsh"):
            result = subprocess.run(["./ds", "extension", "check", ext], cwd=ROOT, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

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
