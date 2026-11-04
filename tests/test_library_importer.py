import importlib.util
import unittest
from pathlib import Path

ROOT=Path(__file__).parents[1]
SPEC=importlib.util.spec_from_file_location("library_importer",ROOT/"scripts"/"import-shadcn-library.py")
MOD=importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)

class LibraryImporterTests(unittest.TestCase):
    def test_classifies_motion(self):
        self.assertEqual(MOD.classify("primitives-texts-typing","ui","A typing text animation."),("motion","typing","animated"))

    def test_classifies_composition(self):
        self.assertEqual(MOD.classify("hero-01","block","Landing hero section"),("compositions","hero","still"))

    def test_classifies_three(self):
        self.assertEqual(MOD.classify("shader-card","ui","WebGL shader 3D card"),("3d","shader","animated"))

    def test_external_ids_do_not_collapse_normalized_names(self):
        source={"id":"demo","directory_handle":"@demo"}
        remote=[{"arg":"@demo/foo.bar","type":"ui","desc":""},{"arg":"@demo/foo-bar","type":"ui","desc":""}]
        rows=MOD.make_rows(source,remote,2)
        self.assertEqual(len(rows),2)
        self.assertEqual(len({row["id"] for row in rows}),2)
        self.assertTrue(all("imported_at" not in row["provenance"] for row in rows))

if __name__=="__main__":
    unittest.main()
