# ChefGroep Auth Astra design reference

This directory freezes the visual evidence from the ChefGroep Auth design run of 2026-09-11. It is a calibration reference, not a runtime dependency.

## Provenance

- Product repo: `GroepOnline/chefgroep-auth`
- Codex session: `01a08f07-19e2-7592-a4c7-ecfef830f2f0`
- Session source: `codex_chatgpt_ios_remote`
- Root model at the start of the run: `azure-us/gpt-6-astra-dz`
- Root model later in the same session, including the frontend implementation turn: `azure-us/gpt-6-astra`
- Reasoning effort: `ultra`, verified in Codex `turn_context`
- Frontend implementation was written by the root Codex agent. The successful screen was not delegated to a frontend subagent.
- Original Codex session log on Joep: `/home/joep/.codex/sessions/2026/09/11/rollout-2026-09-11T07-53-22-01a08f07-19e2-7592-a4c7-ecfef830f2f0.jsonl`
- Auth design contract at capture time: `/home/joep/Code/GroepOnline/chefgroep-auth/repo/DESIGN.md`
- Auth behavior contract at capture time: `/home/joep/Code/GroepOnline/chefgroep-auth/repo/UX-CONTRACT.md`

The original JSONL contains encrypted/private reasoning and unrelated auth/security execution details. Do not commit that raw file. `design-trace.md` contains the design-relevant observable trace only: user/assistant statements, tool actions, artifacts and references needed to reproduce the design process.

## Frozen renders

- `landing-desktop.png`, SHA-256 `347ae2aad7f60b927135a5b60fffd389613263cc2d53b6ef26b7bcbf403517e3`
- `landing-mobile.png`, SHA-256 `5cd49abe5d5c162754db0bfa5231671b5c6d4e22c3491c57e1c49bdd93f07974`

These screenshots were produced by the run itself after the development Worker was deployed and inspected in the browser. They are reference evidence for composition, hierarchy, materiality and responsive behavior. They are not pixel templates to clone into unrelated products.

## What is locked from this reference

The reusable lesson is the process and design grammar: understand the product first, commit to one visual thesis, write durable visual and behavioral contracts, make one domain-specific signature object, implement a representative screen end to end, inspect the real render, then expand. For ChefGroep identity surfaces, the accepted visual thesis itself is also locked in `extensions/chefgroep/` and `surfaces/auth-landing.md`.
