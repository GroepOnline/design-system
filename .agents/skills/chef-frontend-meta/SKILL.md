---
name: chef-frontend-meta
description: Routes ChefGroep frontend work to its canonical design standard, scoped profile, product template or design audit. Use when working on frontend design, visual quality, typography, logo, motion or complete product UI.
owner: chefgroep
domain: frontend-ui
role: router
ambient: true
invocable-by:
- user
- agent
- subagent
disable-model-invocation: false
context: {}
satellites: []
---

# Frontend routing

Owner: `GroepOnline/design-system`. For ChefGroep tasks load the canonical
`design-system` skill and its selected hidden procedure. For other products,
discover their declared design owner rather than imposing ChefGroep branding.

Choose one path: creation/refinement → `locked-taste-design-run`; interface audit
→ `web-design-guidelines`; evaluation/template report → `artifact-template-design-report`.
These paths converge through `chains/chefgroep-design.json`; they are conditional,
not a list to bulk-load. Preserve an approved visual direction while repairing
logo, typography, motion and behavior. Keep runtime permissions and real state
contracts outside aesthetic inference.
