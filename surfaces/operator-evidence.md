# Surface brief: ChefGroep operator evidence

> v1, 2026-09-12. Derived from the verified local ChefGroep Status redesign.

## Scope

Use for status walls, release provenance, deployment convergence and other
read-only operator views where users must judge whether a current claim is
supported. Do not use for identity, consent, commerce or editorial landing pages.

Resolve design context as:

`base -> operator-dense profile -> chefgroep extension -> this surface brief -> product DESIGN.md / UX-CONTRACT.md`

## North Star

**Show the strength and freshness of the evidence before the volume of data.**
The first viewport answers what needs attention, how old the observation is and
which layer needs inspection.

The signature is an ordered evidence vector. Typical layers are source, CI,
release, deployment, runtime, routes and freshness. Products may rename or omit a
layer only when their real contract does not contain it. Unknown, stale, partial,
drift and down remain distinct.

## Visual language

- Warm, quiet paper canvas with high-contrast data regions.
- One editorial serif moment for the operational conclusion.
- Sans serif for product UI; mono for hashes, times, hosts and counts.
- Hairlines, rows and whitespace establish hierarchy. Avoid tile dashboards.
- Interaction blue is separate from green, amber and red operational state.
- Motion reveals a newly accepted observation once and settles within 420ms.

## State and truth contract

Implement loading, current, stale, partial, refresh-error and unavailable. A
background refresh keeps the last accepted snapshot readable. A failed refresh
shows a warning and retry action without erasing valid prior evidence.

The summary fails closed. Missing or malformed source fields remain unproven.
A healthy leaf probe cannot make the overall surface healthy when required layers
are absent. Status labels use text and symbol as well as color.

## Responsive and accessibility

The evidence vector and tables keep their columns and become focusable horizontal
regions on narrow screens. The page itself never overflows. Provide visible focus,
semantic table headers, machine-readable timestamps, a skip link and 44px coarse
pointer targets. Reduced motion shows the final static composition.

## Reference and implementation

Start with `templates/operator-evidence/` and its component contracts. The source
design run lives in `GroepOnline/ChefFactory` under
`deploy/chef-control-az-01/status-wall/status-wall-modern/design-runs/auth-standard-20260912/`.
The template contains no runtime state and establishes no production claim.
