---
name: artifact-template-design-report
description: Creates a complete source-grounded ChefGroep design evaluation and reusable template report in the design-system repo. Use when evaluating a product design, packaging a reusable reference or preserving the retained vendor Design Report with explicit evidence limits.
owner: chefgroep
domain: frontend-ui
role: satellite
ambient: true
invocable-by:
- user
- agent
- subagent
disable-model-invocation: false
context: {}
---

# ChefGroep Design Report

Read `templates/design-report/provenance.json`, `report.schema.json` and the
retained `external/reference.docx`. Preserve the vendor reference byte-for-byte.
The ChefGroep HTML adaptation is an explicit redesign authorized in the 2026-09-12
standard request, not a claim of pixel-identical DOCX reproduction.

Populate `report.json` from the current brief, product contracts, source and actual
renders. Retain the reference's executive summary, at-a-glance, introduction,
key findings, conditions, evidence patterns, implications, recommendations,
conclusion, appendix, notes and sources. No lorem ipsum, invented approval,
performance measurements, production claims or causal proof from model identity.

Use `python3 scripts/render-design-report.py <report.json> --output <report.html>`.
The renderer must copy its local font files and license notices beside the HTML;
verify the report by serving its output directory directly, so hidden repo-root
asset dependencies fail during review.
Render in the supported browser and inspect desktop, phone and print. Keep source,
reference hashes and verification alongside the artifact. Export PDF only with a
real available renderer; do not relabel HTML or claim DOCX fidelity without a
native document rendering workflow. Missing optional export tooling does not stop
the source report, template, design fixes or remaining authorized work.

Separate user taste acceptance, observed rendering, source checks, live behavior
and recommendations. State unverified authenticated states explicitly. Run
`scripts/design-standard-check.py`; a passing structural check is not taste proof.
