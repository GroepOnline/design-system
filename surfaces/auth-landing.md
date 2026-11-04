# Surface-brief: ChefGroep Auth identity product

> v4 locked, 2026-09-11. Explicitly approved visual direction from the live `chefgroep-auth` design run. Supersedes the v3 dot-matrix / Instrument Serif / centered Authentik-card brief. Do not revive v3 without an explicit new decision.

## Scope

Applies to the shared `GroepOnline/chefgroep-auth` product and both identity planes:

- `auth.chefgroep.nl`: public identity plane.
- `auth.chefgroep.online`: internal ChefGroep identity plane.

The codebase may be shared. Security domains and authorization remain separate. Visual sameness never implies permission inheritance.

Resolve design context as:

`base -> identity-spatial profile -> chefgroep extension -> this surface brief -> product DESIGN.md / UX-CONTRACT.md`

The product repo owns runtime tokens, implementation and deployment. This design-system repo owns the reusable visual/taste contract and calibration evidence.

## North Star

**A well-designed place to arrive.** Auth is not a form card with branding around it. The page should make the user feel that they are crossing a deliberate boundary into ChefGroep, while remaining precise about identity, account, client and permission.

The accepted signature is a sculptural **access portal**: translucent/mineral planes around a warm copper core. It represents entry and separation. It is decorative, not a health, trust or verification indicator.

Calibration evidence: `references/auth-astra-2026-09-11/landing-desktop.png` and `landing-mobile.png`.

## Locked visual language

- Canvas `#EAF1EC`; paper `#F8FAF6`; ink `#103D3B`; muted `#566D67`; brand `#176857`; copper `#AE4E32`; line `#C5D3CA`.
- Display type: **Bricolage Grotesque Variable**.
- Body/product type: **Instrument Sans Variable**.
- One signature object per arrival viewport. No secondary illustration competition.
- Asymmetric desktop composition with generous negative space.
- Copper is sparse and expressive. It is not the danger/success semantic color.
- Use tinted surfaces rather than pure white/black.
- Controls stay visually stable during loading.
- Decorative portal geometry is outside the accessibility tree.

These values may only change through an explicit ChefGroep auth taste/design update, not because a later implementation agent prefers another aesthetic.

## Sign-in composition

Desktop/laptop:

1. Sparse ChefGroep header with plane context and one clear top-level action if needed.
2. Left visual field: access portal plus one short human sentence about identity/access.
3. Right decision field: environment eyebrow, direct headline, concise explanation, real access/security note, one dominant sign-in action, one quiet explanation/link.
4. Footer remains low-noise and product-like.

Do not wrap the whole decision in a floating centered card. The page itself is the identity surface.

Internal copy should make the internal boundary explicit without turning the page into an infrastructure console. Public copy should not expose internal architecture names.

## Connect / consent

Use the same spatial/material world, but the decision owns the screen. Surface real data only:

- client identity;
- MCP/resource identity;
- selected ChefGroep account;
- requested scopes with clear meaning;
- expiry when relevant;
- allow and refuse actions.

Never fabricate “verified”, “trusted”, “safe” or green success language. If the server knows verification state, label it precisely. A required permission cannot be silently deselected. Expired and already-used links have distinct recovery states.

## Authenticated product routes

`/account`, `/connections`, `/sessions`, `/security` and audit/history surfaces remain visibly part of the same identity product but change register:

- calm paper surfaces instead of cinematic hero staging;
- editorial page headings;
- strong grouping and separators;
- compact but comfortable rows;
- explicit loading, empty, error, partial and success states;
- destructive/revoke actions visually separated from safe primary actions;
- account and permission facts come from server contracts, never inferred from email/domain alone.

Do not repeat the portal as a giant hero on every internal route. The signature establishes the world once; operational UI earns restraint.

## Motion

Arrival motion may reveal the portal's depth with transform/opacity only. It is finite. Hover/focus feedback may be subtle. All primary actions are immediately available.

`prefers-reduced-motion` produces a static portal and immediate content. No auth decision waits for animation. No infinite ambient motion around consent or security controls.

## Responsive

At narrow widths, collapse to one column. The decision and primary action remain early in the page. The portal may become smaller, shallower or a backdrop, but must never force horizontal scrolling or consume most of the first viewport.

Verify at minimum one small phone width and one laptop/desktop width. Check 200% zoom when the product accessibility contract requires it.

## Behavior contract

The surface must be implemented with a product `UX-CONTRACT.md` or maintained equivalent. At minimum it defines:

- server-owned identity/membership/permission decisions;
- sign-in return-path policy;
- account-choice behavior;
- consent state machine;
- revoke semantics;
- CSRF/same-origin requirements for writes;
- failure/retry behavior;
- Dutch locale/date/time policy where applicable;
- WCAG 2.2 AA, focus and keyboard behavior;
- loading/empty/error/success states.

The visual direction may never weaken these behaviors.

## Explicit anti-references

Forbidden as a new direction for this surface unless Joep explicitly unlocks the taste:

- v3 5×5 dot-matrix bloom as the auth brand anchor;
- Instrument Serif as the auth headline face;
- generic Authentik restyle as the final product architecture;
- centered OAuth card on an otherwise empty page;
- AI-purple or blue mesh gradients;
- generic glassmorphism, neon networks, bento-card landing blocks;
- fake trust badges, fake user counts, fabricated testimonials or sample account status;
- more than one major hero gimmick;
- decorative motion loops competing with the identity decision.

## Implementation process

Use `.agents/skills/locked-taste-design-run/SKILL.md`. The first representative route must be rendered and reviewed against the locked references before the agent expands the rest of the surface. Every serious run records model/effort, skills, references, input brief, screenshots and commit in its provenance manifest.
