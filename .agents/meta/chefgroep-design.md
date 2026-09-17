# ChefGroep design procedure

Owner: `GroepOnline/design-system`. This is the procedure behind the thin design routers.

For ChefGroep work, select `extensions/chefgroep/` by default. Select an applicable
profile; `identity-spatial` belongs to auth, invitation, consent and account entry.
For status, release, deployment and provenance views select `operator-dense`,
`surfaces/operator-evidence.md` and `templates/operator-evidence/`.
The generic Signaal core remains usable without the ChefGroep extension.
Identity component reuse comes from `templates/identity-spatial/components.mjs`;
its generated arrival/state specimens share the existing template tokens and CSS.
At the representative/visual-review nodes use
`scripts/verify-identity-template.py --out <evidence-directory>` and retain its
manifest. For operator pages use `templates/operator-evidence/components.mjs`
and its complete `OperatorPage` entry point, regenerate with
`node scripts/build-operator-template.mjs`, and add `--template operator-evidence`
to the same verifier. `templates/README.md` lists each portable file set.
These commands test templates, not the consumer's auth or operational behavior.

Resolve: current user decision → real product/security contract → product DESIGN
and UX contract → surface → extension → profile → generic defaults. Read only the
selected paths. The user-approved identity palette and decorative portal override
generic blue-only/no-gradient preferences within this surface; semantic controls
retain contrast, focus and status meaning. This does not waive accessibility.

Execute `chains/chefgroep-design.json` through `scripts/design-run.py`. The prepare
command creates a run record and a brief in a new destination, never overwrites
product code. Ground real users, jobs and states; choose one domain-derived
signature; implement a representative route; inspect desktop, phone and reduced
motion; then expand complete product states. Rendering and live behavior need
separate evidence. A screenshot cannot establish OAuth or revocation success.

Human aesthetic review is recorded as judgment with rationale. Never derive a
premium score from file counts, colors, model names or passing tests. Stop
expansion on unresolved critical usability defects; keep independent work moving.
Fix valid findings, verify affected paths, update the source report and record
limitations. Existing user authorization does not require a fresh approval ritual.
