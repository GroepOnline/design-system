---
type: decision
tags: [decision, brain]
---

# Decision - Brain als vijfde tool

- **Datum**: 2026-07-30
- **Context**: Design-system had catalogus, studio, docs, taste. Geen plek voor waarom, research en concept-graph zonder DESIGN.md te vervuilen.
- **Keuze**: `brain/` als Obsidian Second Brain + `brain-site/` via `./ds brain build` (ook in `./ds build`). Agent-gedrag-taste (Command Code-generalisatie) bewust niet in dit repo.
- **Gevolgen**:
  - Leeslaag op `/brain-site/` (git = sync tussen machines)
  - Productregels blijven via [[Taste-propagatie]]
  - Geen Obsidian CLI in CI; lokaal optioneel met `vault=brain`
- **Productregel?** nee

## Links

- [[Decisions]]
- [[Home]]
- [[Concepts]]
- [[Gegenereerde bestanden]]
- [[Taste-propagatie]]
- [[Lock-model]]
