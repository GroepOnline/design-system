# ChefGroep operator evidence template

Use this template for status walls, release views, deployment provenance and
other read-only operator surfaces where the main question is whether a claim is
currently proven. It packages the composition first proven in ChefGroep Status.

The signature is an evidence vector from source to current observation. Every
segment keeps its own state. A healthy runtime must never make unknown source,
release, deployment, route or freshness layers disappear.

- `components.mjs` exports every declared component, plus `OperatorPage`.
- `interactions.mjs` owns native retry state, duplicate prevention and focus return.
- `index.html` and `states.html` are generated, responsive specimens with no live state.
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

## Compose a complete page

```js
import { DataTable, EvidenceRegion, OperatorPage } from './components.mjs';

const bodyHtml = OperatorPage({
  product: 'Status',
  homeHref: '/',
  layers: acceptedSnapshot.layers,
  snapshotState: acceptedSnapshot.state,
  description: 'Bekijk welke bronnen de huidige stand bevestigen.',
  regionsHtml: EvidenceRegion({
    id: 'runtime', title: 'Runtime', description: 'Laatste geaccepteerde probes',
    contentHtml: DataTable({
      label: 'Runtimeprobes',
      columns: [{ key: 'name', label: 'Dienst' }, { key: 'state', label: 'Stand', kind: 'status' }],
      rows: acceptedSnapshot.probes,
    }),
  }),
});
```

`acceptedSnapshot` belongs to the product, not this template. Render `bodyHtml`
inside a document that loads `tokens.css`. All fonts and the vector are local.
The marker has intrinsic dimensions and a pale backing in dark mode so its
canonical colors remain legible. It never changes color to indicate health.

`OperatorPage` composes the named home link, skip target, one h1, observation,
snapshot feedback, evidence vector, optional metrics/navigation and regions.
Use the individual exports for established product layouts. Headings derive their
unproven count from supplied layers. An empty list and unrecognized status fail
closed. Supply every required layer, including missing ones with `unknown`; the
template cannot discover an omitted backend requirement. Valid states are
`healthy`, `partial`, `degraded`, `down`, `drift`, `stale`, `waiting` and `unknown`.

`SnapshotFrame` preserves supplied content for stale, partial and refresh-error
states. Initial loading and unavailable states hide it. Snapshot freshness is
independent of individual probe health. `FreshnessStamp` requires the product's
explicit clock and expiry threshold, plus a timezone-bearing timestamp. Future,
missing and invalid times show unknown. The caller updates this component when
its clock changes; the template starts no timer.

`DataTable` accepts text, mono and status columns. It escapes data and keeps
semantic headers within a keyboard-scrollable region. `MetricStrip` takes real
non-negative integer counts; null shows unknown rather than zero. `SectionNav`
uses ordinary anchors. Text inputs are escaped; `*Html` slots accept only trusted
component output or product-owned markup.

`RetryAction` starts disabled until `bindRetry(button, { onRetry, result })` binds
it. The callback must return a promise that resolves to a safe announcement after
the product has accepted and rendered its response. While pending the helper
reserves the activity slot and prevents duplicate activation. A rejection keeps
the last content, shows a generic failure without upstream error details, and
focuses the result region. Destroy the binding when unmounting. Network
cancellation, snapshot acceptance and data preservation remain product concerns.

## Build and verify

```sh
node scripts/build-operator-template.mjs
node --test tests/operator-components.test.mjs
node scripts/build-operator-template.mjs --check
python3 scripts/verify-identity-template.py --template operator-evidence --out /home/joep/Code/GroepOnline/design-system/runtime/operator-proof
python3 scripts/design-standard-check.py
```

The browser verifier covers desktop, laptop, phone, dark and reduced-motion renders,
font loading, page overflow, keyboard scroll, skip focus, retry failure/success,
duplicate prevention, stable pending geometry and teardown. It records source
hashes, Git head/dirty state and runtime versions beside the screenshots. Inspect
the rendered evidence separately; passing checks do not establish taste or live
health. Both templates run through the existing design quality hook and CI gate.

The reference desktop and laptop cases keep the evidence vector at or above
y=350px and fully within y=520px. The conclusion keeps a display size of at least
44px. These geometry checks prevent the compact operator page from drifting into
a large landing hero. Phone layout keeps its own spacing. Theme-color metadata
selects the light/dark canvas through media queries; browser checks compare the
selected value with the actual rendered background.

Edit `specimen.mjs`, the components or styles, then regenerate. The SVG is copied
byte-for-byte from `extensions/chefgroep/assets/identity-mark.svg`. Do not edit
generated HTML or the copied vector independently.
