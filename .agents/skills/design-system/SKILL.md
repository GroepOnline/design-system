---
name: design-system
description: Maintains the ChefGroep design standard, profiles, reusable product templates and verified design reports in GroepOnline/design-system. Use when creating ChefGroep UI, changing the design system or reusing the Auth quality reference.
owner: chefgroep
domain: frontend-ui
role: satellite
---

# ChefGroep design system

Canonical checkout: `/home/joep/Code/GroepOnline/design-system/repo`; task worktrees
live under the same project's `worktrees/`. Resolve the working repository rather
than assuming the deleted `~/design-system` directory exists.

Read the repository AGENTS.md and `.agents/meta/chefgroep-design.md`, then resolve
`./s.sh context chefgroep <profile>`. For identity use `identity-spatial` and
`surfaces/auth-landing.md`. Reuse the renderers in
`templates/identity-spatial/components.mjs`; `specimen.mjs` composes arrival and
state/account examples. `interactions.mjs` implements native dialog lifecycle and first-invalid-field focus; every declared component must have a callable export. Change component source, then run
`node scripts/build-identity-template.mjs`. The design quality hook checks these
artifacts and the component contracts. Before visual review run
`python3 scripts/verify-identity-template.py --out <evidence-directory>` for
rendered phone/desktop, motion, focus, pending geometry and recovery evidence.
ChefGroep's default quality floor applies to every route;
its literal portal is specific to identity. For operational proof surfaces use
`operator-dense`, `surfaces/operator-evidence.md` and the portable
`templates/operator-evidence/components.mjs` renderers. `OperatorPage` composes
the complete operational page; `interactions.mjs` owns retry UI. The shared entry
guide is `templates/README.md`. Regenerate with `node scripts/build-operator-template.mjs`
and verify with `python3 scripts/verify-identity-template.py --template operator-evidence --out <evidence-directory>`.
The existing quality hook checks both templates' declared exports and generated
specimens. Use `locked-taste-design-run` to build
and `artifact-template-design-report` to evaluate and package a reference.

The catalog and `tokens.css` own the generic core. Profiles/extensions own scoped
choices. Generated index/docs pages come from `ds`; never edit them directly.
Catalog variants retain immutable lineage and are added/selected through `ds`.
Runtime consumers own their shipped copies and record source hashes.

Before commit: `python3 scripts/check-frontend.py`, `./s.sh quality`, affected
regressions, `python3 ds build`, then verify generated output is reproducible.
Record material design changes in CHANGELOG.md and verified observations in
LEARNED.md; do not write background memory. Preserve concurrent worktrees.
