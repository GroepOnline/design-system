import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
class ButtonInteractionTest(unittest.TestCase):
    def test_six_independent_interaction_variants_exist(self):
        m=json.loads((ROOT/"components/button/catalog.json").read_text())
        wanted={"beam-cta","sweep-cta","ripple-press","hold-confirm","split-action","command-ack"}
        by={e["id"]:e for e in m["entries"]}
        self.assertTrue(wanted <= set(by))
        self.assertEqual({by[x]["interaction"] for x in wanted},{"beam","sweep","ripple","hold","menu","ack"})
    def test_interactions_package_has_no_dependencies(self):
        p=json.loads((ROOT/"packages/interactions/package.json").read_text())
        self.assertNotIn("dependencies",p)
        self.assertFalse(p["sideEffects"])
    def test_motion_is_not_uniform_across_buttons(self):
        css=(ROOT/"tokens.css").read_text()
        for token in (".btn-beam",".btn-sweep",".btn-ripple",".btn-hold",".btn-split",".btn-command"):
            self.assertIn(token,css)
        self.assertIn("prefers-reduced-motion",css)
    def test_demos_import_helpers_only_where_needed(self):
        base=ROOT/"components/button/self"
        self.assertIn("attachPressRipple",(base/"ripple-press.html").read_text())
        self.assertIn("attachHoldConfirm",(base/"hold-confirm.html").read_text())
        self.assertIn("attachCommandAck",(base/"command-ack.html").read_text())
        self.assertNotIn("@signaal/interactions",(base/"beam-cta.html").read_text())
    def test_hold_confirm_supports_keyboard(self):
        js=(ROOT/"packages/interactions/index.js").read_text()
        self.assertIn('event.key === " "',js)
        self.assertIn('event.key === "Enter"',js)
        self.assertIn('addEventListener("keydown"',js)
if __name__=="__main__": unittest.main()
