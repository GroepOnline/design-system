# Design profile: identity-spatial

This profile is an optional design overlay for identity and access surfaces. It does not prescribe one brand palette or one literal illustration. It prescribes the composition and authorship model that made the ChefGroep Auth reference successful.

## Composition

Use a spatial split rather than a generic centered card when the viewport permits it. One side carries the product-specific signature object; the other carries the actual identity or consent decision. Preserve generous negative space around both. The eye should understand “where am I entering?” before “what do I click?”.

On narrow screens, collapse to a strict single-column decision path. The signature becomes a shallow prelude or background layer and may never push the primary action below an unreasonable first viewport.

## Signature

Choose exactly one memorable spatial object derived from the domain. It may use layered planes, depth, translucency, perspective, restrained material texture or an equivalent technique. It must have semantic rationale and must not impersonate a status indicator.

Treat the object as decorative unless it genuinely controls the flow. Hide decorative geometry from assistive technology.

## Typography

Use a distinctive display family for the arrival statement and a high-legibility sans family for decisions, controls and account data. The pair should create contrast through construction, not novelty for novelty's sake. Avoid default AI stacks and avoid using the display face inside dense product rows.

## Material and color

Use a quiet field plus one dark structural tone and one warm accent family. Prefer tinted neutrals over pure white/black. Reserve the accent for the signature, focus, and a small number of meaningful moments. Danger, success and warning remain semantic and must not be conflated with the expressive accent.

Exact brand values belong to the extension or product `DESIGN.md`, not this generic profile.

## Motion

Arrival motion may reveal depth and separation, but it must be finite. Animate transforms and opacity only. Decision controls remain stable while loading. `prefers-reduced-motion` produces an immediate static composition. No consent or login step waits for animation to finish.

## Product register

Landing, sign-in and consent may be expressive. Account, sessions, security, connections and audit surfaces inherit the same typography/material DNA but switch to calm editorial grouping, compact rows and explicit states. Do not force the hero composition onto operational screens.

## Reference

ChefGroep Auth 2026-09-11 is the accepted calibration example: `references/auth-astra-2026-09-11/`. Use it to judge authorship, whitespace, hierarchy and one-signature restraint, not as a component template.

## Motion contract

The current ChefGroep reference settles within 1.2 seconds. Layers may arrive
with short staggered transforms/opacity, then stop. Buttons remain immediately
usable. Reduced motion renders the final geometry with no animated displacement.
Decorative material effects must not imply security state or obstruct controls.
