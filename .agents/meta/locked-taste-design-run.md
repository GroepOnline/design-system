# Locked Taste Design Run

Use this skill when a frontend must be distinctive and reproducible across agents, not merely “made nicer”. It encodes the process that produced the accepted ChefGroep Auth design on 2026-09-11 without requiring that session's entire infrastructure context.

## Required skill chain

Resolve and load only what is applicable, in this order:

1. `chef-frontend-meta` as the routing layer when available.
2. This repo's `taste/SKILL.md` plus root `DESIGN.md` and `taste/taste-rules.md`.
3. The selected profile and extension. For ChefGroep Auth: `profiles/identity-spatial/` then `extensions/chefgroep/`.
4. The target surface brief, for example `surfaces/auth-landing.md`.
5. `frontend-design-ui-ux` when the product does not yet have a locked design/UX contract or the brief explicitly approves a new direction.
6. Upstream `frontend-design` plus `frontend-design-premium` together for production UI implementation. For the reference run, premium version 1.4.0 was used.
7. Premium references that match the task. For auth, at minimum: `canonical-ui-resolution.md`, `design-context-lifecycle.md`, `auth-patterns.md`, `token-mapping.md`, and the premium verification checklist.
8. Language/framework discipline such as `typescript-best-practices` and `principle-type-system-discipline` when the implementation uses TypeScript.

Do not bulk-load unrelated design plugins. More skills are not more taste.

## Phase 1: ground reality before aesthetics

Read the current request, product/domain contracts, maintained architecture/security decisions, existing runtime UI, design-system context and at least one relevant sibling flow. For auth or permissions, prove which state the server owns and what the frontend may safely display.

Write a compact evidence note privately before visual planning:

`users → job → real states → security/permission boundaries → existing design constraints → what may change`

Never invent live metrics, identities, verification, permissions, testimonials or statuses to make a mockup look complete.

## Phase 2: resolve taste before code

Resolve design context in deterministic order:

`base → profile → extension → surface → product DESIGN.md → explicit current-task decision`

A more specific explicit contract wins over a generic taste preference. A locked surface may not be silently reinterpreted by a later agent.

State one sentence internally that names the visual thesis and its semantic reason. Then answer one hard question:

**What is the one memorable signature, and what does it mean in this product?**

If the answer is generic decoration, redesign before coding. One signature only. The rest of the page earns restraint.

## Phase 3: lock durable contracts

Before expanding multiple screens, create or reconcile:

- product-root `DESIGN.md` for durable visual identity, tokens, type, signature, registers, anti-references and runtime token ownership;
- product-root `UX-CONTRACT.md` or maintained equivalent for state, navigation, permission, feedback, recovery, locale and accessibility behavior when the product is multi-screen or security-sensitive.

Do not create two competing token sources. Document whether runtime CSS/theme tokens or `DESIGN.md` values are canonical and map one to the other.

When changing an already locked direction, record the explicit approval and update design system + runtime in the same workstream.

## Phase 4: build one representative route first

Choose the route with the highest combination of identity, behavior and visual risk. Implement it end to end with real components and real state contracts. Do not scaffold ten half-designed pages first.

For identity surfaces this is usually sign-in or consent. The representative route must include its real loading/error state and responsive behavior, not only a static happy-path screenshot.

Treat every meaningful UI element as a reusable component or deliberate primitive where recurrence is likely. Do not turn “everything is a component” into wrappers with no ownership or behavior.

## Phase 5: visual proof gate

Build and run the actual product. Capture at minimum:

- one laptop/desktop viewport;
- one small phone viewport;
- reduced-motion behavior when motion is present;
- the main interaction/open state relevant to the page.

Inspect the renders, not only DOM/code. Compare against the locked reference for hierarchy, authorship, spacing, signature restraint and anti-patterns. Do not compare unrelated pixels mechanically.

Reject and fix before expansion if any of these are true:

- it could plausibly be a generic AI/SaaS template;
- the signature has no domain meaning;
- more than one visual gimmick competes for attention;
- the first viewport hides or weakens the primary decision;
- mobile is merely the desktop squeezed narrower;
- a visual claim implies server state that is not proven;
- the route drifted from the locked profile/extension/surface.

## Phase 6: expand as a system

Only after the representative route passes, expand sibling routes. Reuse the established tokens, type roles, controls, feedback and state behavior. Change register when the task changes: expressive arrival does not justify cinematic operational tables.

If a new requirement genuinely conflicts with the lock, stop that aesthetic change and surface the conflict. Do not quietly fork the taste inside one screen.

For status, release and deployment views, use `surfaces/operator-evidence.md` and
`templates/operator-evidence/`. Preserve the evidence vector as a truth contract;
do not transplant the Auth portal into an operator surface.

## Phase 7: verification

Run project formatter/lint, typecheck, tests, build, premium static audit when configured, browser interaction checks, keyboard/focus checks, narrow viewport, reduced motion and relevant failure states. A successful build is not visual proof and a screenshot is not behavioral proof. Both are required.

## Phase 8: provenance manifest

Every serious design run must leave a small machine-readable or Markdown manifest containing:

- timestamp;
- repo, branch and commit/head;
- root agent/session id when available;
- model and reasoning effort when observable;
- original brief or source link;
- exact design skills and versions/paths used;
- profile, extension and surface selected;
- external/local references consulted;
- product `DESIGN.md` and `UX-CONTRACT.md` paths;
- desktop/mobile screenshot paths and hashes;
- verification commands/results;
- explicit taste decisions changed during the run.

Never copy encrypted/private chain-of-thought into provenance. Observable tool actions, inputs, outputs and assistant/user messages are enough.

## ChefGroep Auth calibration

The accepted calibration run is documented in `references/auth-astra-2026-09-11/`. Its quality came from the pipeline, not from “Astra” as a magic design style. Preserve the pipeline; only use the exact ChefGroep Auth visual language when the `chefgroep` extension and auth surface select it.
