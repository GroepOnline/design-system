"""The verification gate must not race build-check by rewriting tracked state."""
from contextlib import redirect_stdout
import importlib.machinery
import importlib.util
import io
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

loader = importlib.machinery.SourceFileLoader("design_system_gate", str(Path(__file__).resolve().parents[1] / "ds"))
spec = importlib.util.spec_from_loader(loader.name, loader)
ds = importlib.util.module_from_spec(spec)
loader.exec_module(ds)


class BrainGateReadOnlyTest(unittest.TestCase):
    def test_gate_does_not_rewrite_scorecard(self):
        with TemporaryDirectory() as directory:
            scorecard = Path(directory) / "scorecard.json"
            before = b'{"ts":"2026-11-01T00:00:00Z","fixture":true}\n'
            scorecard.write_bytes(before)
            with patch.object(ds, "BRAIN_SCORECARD", str(scorecard)), redirect_stdout(io.StringIO()):
                ds.cmd_brain(["gate"])
            self.assertEqual(scorecard.read_bytes(), before)
