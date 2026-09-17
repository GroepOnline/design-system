import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

class SurfacePrimitivesTest(unittest.TestCase):
    def test_catalogs_exist_and_have_one_active(self):
        names = ['dialog','sheet','popover','menu','tooltip','tabs','breadcrumb','pagination','alert','toast','progress','skeleton','empty-state']
        for name in names:
            data = json.loads((ROOT/'components'/name/'catalog.json').read_text())
            self.assertEqual(sum(e['status']=='active' for e in data['entries']), 1, name)
            self.assertGreaterEqual(len(data['entries']), 2, name)

    def test_native_overlay_semantics(self):
        dialog = (ROOT/'components/dialog/self/default.html').read_text()
        popover = (ROOT/'components/popover/self/default.html').read_text()
        self.assertIn('<dialog', dialog)
        self.assertIn('showModal()', dialog)
        self.assertIn(' popover ', popover)
        self.assertIn('popovertarget=', popover)

    def test_navigation_semantics(self):
        tabs = (ROOT/'components/tabs/self/line.html').read_text()
        crumb = (ROOT/'components/breadcrumb/self/default.html').read_text()
        page = (ROOT/'components/pagination/self/default.html').read_text()
        self.assertIn('role="tablist"', tabs)
        self.assertIn('role="tab"', tabs)
        self.assertIn('aria-selected=', tabs)
        self.assertIn('aria-current="page"', crumb)
        self.assertIn('aria-current="page"', page)

    def test_feedback_semantics(self):
        toast = (ROOT/'components/toast/self/default.html').read_text()
        progress = (ROOT/'components/progress/self/bar.html').read_text()
        self.assertIn('role="status"', toast)
        self.assertIn('<progress', progress)
        self.assertIn('max="100"', progress)

    def test_runtime_exports_surface_primitives(self):
        js = (ROOT/'packages/react/index.js').read_text()
        dts = (ROOT/'packages/react/index.d.ts').read_text()
        for name in ['Dialog','Sheet','Popover','Menu','MenuItem','Tooltip','TabList','Tab','Breadcrumb','Pagination','Toast','Progress','Skeleton']:
            self.assertIn(f'export const {name}', js, name)
            self.assertIn(f'export const {name}', dts, name)

    def test_reduced_motion_covers_new_animated_surfaces(self):
        css = (ROOT/'tokens.css').read_text()
        rcss = (ROOT/'packages/react/styles.css').read_text()
        self.assertIn('@media (prefers-reduced-motion: reduce)', css)
        self.assertIn('.skel-row::after { animation: none', css)
        self.assertIn('@media(prefers-reduced-motion:reduce)', rcss)
        self.assertIn('.sg-skeleton::after{animation:none', rcss)

if __name__ == '__main__': unittest.main()
