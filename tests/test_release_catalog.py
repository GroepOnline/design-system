import json
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

class ReleaseCatalogTest(unittest.TestCase):
    def test_release_plan_is_single_version_authority(self):
        plan=json.loads((ROOT/'packages/release.json').read_text())
        self.assertFalse(plan['publish'])
        for spec in plan['packages']:
            pkg=json.loads((ROOT/spec['path']/'package.json').read_text())
            self.assertEqual(pkg['version'],plan['version'])
            self.assertTrue(pkg['private'])
            for dep, ver in pkg.get('dependencies',{}).items():
                if dep.startswith('@signaal/'):
                    self.assertEqual(ver,plan['version'])

    def test_catalog_index_matches_source_truth(self):
        idx=json.loads((ROOT/'catalog-index.json').read_text())
        manifests=list((ROOT/'components').glob('*/catalog.json'))
        self.assertEqual(idx['counts']['components'],len(manifests))
        expected=sum(len(json.loads(p.read_text())['entries']) for p in manifests)
        self.assertEqual(idx['counts']['variants'],expected)
        self.assertEqual(idx['counts']['profiles'],len(list((ROOT/'profiles').glob('*/profile.json'))))
        self.assertEqual(idx['counts']['patterns'],len(list((ROOT/'patterns').glob('*/pattern.json'))))

    def test_global_search_json_is_machine_readable(self):
        out=subprocess.run([str(ROOT/'ds'),'search','beam','--json'],cwd=ROOT,check=True,capture_output=True,text=True).stdout
        rows=json.loads(out)
        self.assertTrue(rows)
        self.assertTrue(any(r['component']=='motion' and r['variant']=='beam' for r in rows))
        self.assertTrue(all({'component','variant','category','origin'} <= set(r) for r in rows))

    def test_pattern_search_limits_component_set(self):
        pattern=json.loads((ROOT/'patterns/command-surface/pattern.json').read_text())
        out=subprocess.run([str(ROOT/'ds'),'search','--pattern','command-surface','--json'],cwd=ROOT,check=True,capture_output=True,text=True).stdout
        rows=json.loads(out)
        self.assertTrue(rows)
        self.assertTrue({r['component'] for r in rows} <= set(pattern['components']))

if __name__=='__main__': unittest.main()
