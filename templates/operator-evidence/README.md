# ChefGroep operator evidence template

Use this template for status walls, release views, deployment provenance and
other read-only operator surfaces where the main question is whether a claim is
currently proven. It packages the composition first proven in ChefGroep Status.

The signature is an evidence vector from source to current observation. Every
segment keeps its own state. A healthy runtime must never make unknown source,
release, deployment, route or freshness layers disappear.

- `index.html` is a static, responsive specimen with no simulated live state.
- `tokens.css` owns the portable template tokens and dark theme.
- `component-contracts.json` defines reusable behavior and state ownership.
- `fonts/` contains self-hosted type assets and the retained license notice.

Copy the relevant composition into the product and bind it to its real API
contract. Keep the product's runtime tokens local. Loading, current, stale,
partial, refresh-error and unavailable must all be implemented and tested. A
static template, a green build or a screenshot does not prove production health.

Origin: `GroepOnline/ChefFactory`, ChefGroep Status design run of 2026-09-12.
The consumer keeps its own deployment, source provenance and accessibility
evidence. Identity and consent surfaces use `templates/identity-spatial/`.
