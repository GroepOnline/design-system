# Upstreams

External UI sources are research and component supply, never runtime authorities.
Each JSON manifest pins one immutable upstream commit and records how that source may be used per renderer.

Rules:

- Pin a full commit SHA. Never track `main` silently.
- Keep external provenance when a variant is promoted into `components/*/external/`.
- A curated entry records `upstream`, `sourceRef`, `sourcePath`, `license`, `take`, `reject`, and renderer policy.
- Curated external studies stay locked. ChefGroep adaptations are new `self-modified` variants.
- New upstream versions are explicit manifest changes and require review.
- `autoSelect` stays false. An imported reference cannot become the active ChefGroep component automatically.
- React sources may feed web and MCP App renderers. Native ChefApp remains Rust/GTK and consumes shared semantics/tokens only.

Commands:

```bash
./ds upstream list
./ds upstream show opensourceui
./ds upstream check
```
