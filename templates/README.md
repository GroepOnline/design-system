# ChefGroep product templates

Start from the page's job. Both templates use the Auth quality standard: deliberate
type, complete states, named components, finite motion and browser verification.
They preserve their own approved visual register.

| Page job | Template | Entry point | Portable files |
| --- | --- | --- | --- |
| Arrival, sign-in, consent, account, sessions, security, connected apps | `identity-spatial` | `SiteShell` with `LandingHero` or `PageTitle` | `components.mjs`, `interactions.mjs`, `tokens.css`, `product.css`, `identity-mark.svg`, `fonts/` |
| Status, source/release/deployment provenance, health observations | `operator-evidence` | `OperatorPage` | `components.mjs`, `interactions.mjs`, `tokens.css`, `identity-mark.svg`, `fonts/` |

Import components from the selected template's `components.mjs`. Copy the listed
files into the owning product and record the design-system revision plus SHA-256
hashes. Keep the font licenses. Consumers own routing, API adapters, authorization,
state acceptance and deployment. No cross-repository filesystem or runtime import
is required.

The `*Html` composition arguments are trusted slots. Escape API/user text through
component arguments; do not put it into a trusted slot. An exported component is
a presentation contract, not a server permission or health check.

Use the [identity guide](identity-spatial/README.md) or
[operator guide](operator-evidence/README.md) for composition examples and checks.
The generated specimens show all declared states and label example data. They
are not live products or proof that the consumer integrated every state.

For a new page class, resolve the existing profile and surface before adding a
template. Extend a component only when it has a repeated semantic job; preserve
existing callers. Add callable exports and behavior tests together. The design
quality hook rejects declared components without matching implementations and
generated examples that differ from their source.
