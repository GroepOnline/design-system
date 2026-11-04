"""A later CI day must not change committed generated pages."""
import ast
from pathlib import Path
import unittest


class BuildClockTest(unittest.TestCase):
    def test_wall_clock_dates_are_only_used_for_explicit_source_mutations(self):
        source = (Path(__file__).resolve().parents[1] / "ds").read_text()
        dated_functions = {
            function.name
            for function in ast.parse(source).body
            if isinstance(function, ast.FunctionDef)
            and any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
                    and node.func.id == "_today" for node in ast.walk(function))
        }
        self.assertEqual(dated_functions, {"cmd_add", "cmd_brain_new"})
        self.assertNotIn("{today}", source)
