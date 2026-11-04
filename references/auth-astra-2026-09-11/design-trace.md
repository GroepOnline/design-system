# Design-relevant trace: ChefGroep Auth, 2026-09-11

This is a sanitized reconstruction of the observable design process. It deliberately excludes encrypted/private model reasoning, credentials, OAuth secrets and unrelated infrastructure output.

## 1. Brief and constraints

The root task established unusually strong product constraints before visual work began:

- Extract auth into a standalone `GroepOnline/chefgroep-auth` capability.
- Treat public and internal identity as separate security domains while sharing one product codebase.
- Build the auth frontend as a full product, not a bare OAuth screen.
- Landing, connect, account, sessions, security and connected apps must belong to one coherent product UI.
- Aim for top-SaaS craft, strong motion and typography, and explicitly avoid generic AI output.
- Do not keep the old Signaal treatment as the visual constraint for the new auth product.
- Use real account/consent/session/connection contracts and do not invent live data.
- Prove the OpenAI OAuth/MCP contract before finalizing integration behavior.

That brief mattered. The frontend was designed after the agent had already spent substantial time understanding the actual identity, consent and revoke model.

## 2. Agent provenance

- Session id: `01a08f07-19e2-7592-a4c7-ecfef830f2f0`
- Origin: `codex_chatgpt_ios_remote`
- Models observed in the same session: `azure-us/gpt-6-astra-dz`, later `azure-us/gpt-6-astra`
- Effort: `ultra`
- Multi-agent version: `v2`
- Root workspace at session start: `ChefFactory`
- The frontend implementation itself was produced by the root agent. Earlier exploration lanes existed for the broader auth migration, but the visual system and successful screen were authored in the root thread.

## 3. Design skill chain actually consulted

The session consulted these design/frontend skills or their routed equivalents:

1. `~/.agents/skills/chef-frontend-meta/SKILL.md`
   Routing layer for ChefGroep frontend and design work.
2. `~/.agents/skills/design-taste-frontend/SKILL.md`
   Anti-slop landing/redesign guidance and design-read discipline.
3. `~/.agents/skills/frontend-design-ui-ux/SKILL.md`
   Locked design-language and UX-spec discipline.
4. `/home/joep/.codex/plugins/cache/openai-curated-remote/frontend-design-premium/1.4.0/skills/frontend-design/SKILL.md`
   Upstream visual-design base loaded by the premium skill.
5. `/home/joep/.codex/plugins/cache/openai-curated-remote/frontend-design-premium/1.4.0/skills/frontend-design-premium/SKILL.md`
   Production behavior, durable `DESIGN.md`, cross-screen consistency and verification.
6. `/home/joep/.codex/plugins/cache/openai-curated-remote/pstack-plugin/0.2.0/skills/typescript-best-practices/SKILL.md`
7. `/home/joep/.codex/plugins/cache/openai-curated-remote/pstack-plugin/0.2.0/skills/principle-type-system-discipline/SKILL.md`

Design references explicitly read during the implementation phase:

- `frontend-design-premium/references/canonical-ui-resolution.md`
- `frontend-design-premium/references/design-context-lifecycle.md`
- `frontend-design-premium/references/auth-patterns.md`
- `frontend-design-premium/references/token-mapping.md`

The broader run also used browser, Cloudflare, TypeScript, auth and deployment procedures. Those supported reality-checking but are not part of the visual taste recipe.

## 4. Observable sequence

### Product and runtime grounding

Before choosing the visual direction, the root agent verified the actual Authentik runtime, current identity providers, OpenAI OAuth/MCP behavior, consent semantics and revoke behavior. It imported the legacy identity runtime into `chefgroep-auth` as migration/recovery material instead of treating it as the new design source.

This prevented the frontend from being designed around imaginary auth states.

### Durable contracts before screen expansion

The agent created project-root `DESIGN.md` and `UX-CONTRACT.md` before finishing the application screens.

`DESIGN.md` committed to:

- a generous spatial identity product;
- mineral green / deep petrol / copper material language;
- Bricolage Grotesque Variable for display;
- Instrument Sans Variable for body/product copy;
- a sculptural access portal made from translucent planes and a copper core;
- expressive, asymmetric landing/login composition;
- calmer editorial product surfaces after entry;
- no fabricated metrics, quotes, statuses or profile examples.

`UX-CONTRACT.md` fixed the behavior model:

- server owns identity, memberships, grants, sessions and permissions;
- frontend renders versioned contracts rather than inferring rights;
- consent exposes client, resource, account and requested permissions;
- revocation is pessimistic and reports success only after server commit;
- Dutch UI, `nl-NL`, `Europe/Amsterdam`;
- loading, empty, error and success states;
- WCAG 2.2 AA, visible focus, reduced motion and minimum control sizing.

### Visual thesis

The root agent then stated the direction explicitly in the session:

> “Voor de interface kies ik een eigen ChefGroep-richting: mineraalgroen, diep petrol, koperaccenten en expressieve typografie. Een ruimtelijke ‘toegangspoort’ vormt het visuele anker.”

That sentence is the pivot. The design was no longer “make an auth page look premium”; it had one product-specific metaphor and a constrained material language.

### Implementation

The agent created React/Vite application components and runtime tokens. The `/sign-in` implementation contains the exact successful copy and composition:

- left: sculptural portal plus “Jouw toegang begint met wie jij bent.”
- right: “ChefGroep intern”, “Goed je weer te zien.”, explanatory copy, internal-access note and one full-width sign-in action;
- sparse header/footer framing rather than a centered auth card;
- all visual primitives tied to semantic CSS variables.

The portal is built from CSS layers and perspective, not a generic stock illustration. It is decorative and excluded from the accessibility tree.

### Real-render verification

The development Worker was deployed and the root agent captured a 1440×1000 desktop render, then a 390×844 mobile render. Those screenshots are frozen next to this file. The agent inspected the desktop image before continuing and checked mobile horizontal overflow.

## 5. Why this run worked

The strongest causal hypothesis is the combination, not the model alone:

`strong product brief → real domain proof → visual thesis → durable DESIGN/UX contracts → premium frontend skill → one representative render → browser inspection`

The run avoided the usual failure mode of asking a model to repeatedly “make it nicer” while the visual system is still undefined.

Specific strengths:

- The domain metaphor came from the product: entry, separation, permission and identity became the portal.
- One signature object carries the memorability. The rest is restrained.
- Visual values were decided before every screen invented its own style.
- Product behavior constrained visual fantasy. Consent and security remained readable and honest.
- The agent inspected the actual rendered artifact instead of treating successful compilation as design proof.

## 6. What should not be copied blindly

- Do not conclude that “Astra ultra” alone causes this quality. The session had unusually rich context and a long, expensive execution path.
- Do not copy the portal into products where entry/separation is not the core metaphor.
- Do not copy the exact palette or type pair outside ChefGroep identity unless the surface inherits the ChefGroep locked extension.
- Do not turn every screen into a cinematic landing page. Authenticated management screens deliberately become calmer.
- Do not import the old v3 auth brief’s dot-matrix / serif / centered-card direction back into this product. That direction is superseded for ChefGroep Auth.

## 7. Efficiency correction for future runs

The original session carried a very large context because it also performed repository extraction, OAuth protocol proof, deployment debugging and infrastructure work. Reproducing the visual quality should not require reproducing that token bill.

The new `locked-taste-design-run` skill separates the reusable design path:

1. read product/runtime evidence;
2. read design-system base + selected profile + extension;
3. lock a one-sentence visual thesis and one signature;
4. write/reconcile `DESIGN.md` and `UX-CONTRACT.md`;
5. implement one representative screen;
6. render desktop + mobile + reduced motion;
7. compare against the locked reference and anti-references;
8. expand only after the first screen passes;
9. write a provenance manifest automatically.

This keeps the part that produced the quality while avoiding the unrelated multi-hour auth investigation on every frontend task.
