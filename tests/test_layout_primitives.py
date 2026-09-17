import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
LAYOUT=['stack','cluster','grid','page','section','split-pane','app-shell']

class LayoutPrimitivesTest(unittest.TestCase):
    def test_layout_catalogs_are_generic_and_active(self):
        for name in LAYOUT:
            data=json.loads((ROOT/'components'/name/'catalog.json').read_text())
            self.assertEqual(data['cat'],'layout')
            self.assertEqual(sum(e['status']=='active' for e in data['entries']),1)
            self.assertNotIn('ChefGroep',json.dumps(data))
            self.assertNotIn('DSH',json.dumps(data))
    def test_runtime_exports_layout_primitives(self):
        text=(ROOT/'packages/react/index.js').read_text()
        for name in ['Stack','Cluster','Grid','Page','Section','SplitPane','AppShell','AppShellRail','AppShellMain']:
            self.assertIn(f'export const {name}',text)
    def test_layout_css_has_responsive_contract(self):
        css=(ROOT/'tokens.css').read_text()
        self.assertIn('/* ---- layout primitives ---- */',css)
        self.assertIn('@media(max-width:620px)',css)
        self.assertIn('.layout-split.aside{grid-template-columns:',css)
    def test_quality_matrix_covers_layout(self):
        data=json.loads((ROOT/'quality/visual-contracts.json').read_text())
        self.assertTrue(any(x.get('category')=='layout' for x in data['cases']))

if __name__=='__main__': unittest.main()
