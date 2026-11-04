# Specimen library

`library/` is the high-volume research layer. It is deliberately separate from `components/`, which remains the small curated/production catalog.

- `registry.json`: generated browse registry. Never edit manually.
- `imported.jsonl`: idempotent external metadata imports with provenance; source code remains on-demand.
- `sources.json`: discovery/ingest sources.
- `index.html`: product-style browser for the full registry.
- `specimen.html`: live renderer/inspector target.
- `scripts/build-library.py`: deterministic seed + import merger.

Current seed matrix: 1,440 component specimens, 120 compositions, 240 motion studies, 120 transitions and 60 Three.js/WebGL studies. Generated volume is exploratory, not an assertion that 1,980 designs were individually curated.

Use `./ds library stats`, `./ds library sources`, `./ds library search <query>`, `./ds library view <id|@registry/item>`, `./ds library import --priority high` and `./ds library build`. `./ds check` fails if the library falls below 1,000 items, contains duplicate IDs or loses one of the required domains.

External registry metadata enters through `imported.jsonl` with explicit source/provenance and `license_status=review-required`. `ds library view` fetches source on demand without vendoring it. Promotion to `components/` remains a separate reviewed action.
