import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
NAMES=['accordion','disclosure','combobox','command-palette','toggle-group','chip','slider']

class InteractionPrimitivesTest(unittest.TestCase):
    def test_catalogs_are_generic_and_active(self):
        for name in NAMES:
            data=json.loads((ROOT/'components'/name/'catalog.json').read_text())
            self.assertEqual(data['cat'],'interaction')
            self.assertEqual(sum(e['status']=='active' for e in data['entries']),1)
            raw=json.dumps(data)
            self.assertNotIn('ChefGroep',raw); self.assertNotIn('DSH',raw)
    def test_runtime_exports_semantic_primitives(self):
        text=(ROOT/'packages/react/index.js').read_text()
        for name in ['Accordion','AccordionItem','AccordionTrigger','AccordionPanel','Disclosure','Combobox','Listbox','Option','CommandPalette','ToggleGroup','ToggleItem','Chip','Slider']:
            self.assertIn(f'export const {name}',text)
        self.assertIn('role: "combobox"',text); self.assertIn('role: "listbox"',text); self.assertIn('"aria-pressed": pressed',text)
    def test_native_disclosure_and_slider_semantics(self):
        self.assertIn('<details', (ROOT/'components/accordion/self/default.html').read_text())
        self.assertIn('<summary>', (ROOT/'components/disclosure/self/default.html').read_text())
        self.assertIn('type="range"', (ROOT/'components/slider/self/default.html').read_text())
    def test_interaction_motion_is_not_required(self):
        css=(ROOT/'tokens.css').read_text()
        block=css.split('/* ---- interaction primitives ---- */',1)[1]
        self.assertNotIn('sg-motion-',block)
    def test_quality_matrix_covers_interaction(self):
        data=json.loads((ROOT/'quality/visual-contracts.json').read_text())
        self.assertTrue(any(x.get('category')=='interaction' for x in data['cases']))

if __name__=='__main__': unittest.main()
