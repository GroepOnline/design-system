---
type: concept
invariant: 1
enforced_in: AGENTS.md §Invarianten; ds select/remove; catalog.json status
tags: [concept]
---

# Lock-model

Catalogus-entries zijn onveranderlijk (`locked`) tot expliciete `ds select` (maakt ACTIEF) of `ds remove`. Nooit een entry-file in-place overschrijven; nieuwe versie = nieuwe id of expliciete remove+add.

## Waar afgedwongen

- `AGENTS.md` §Invarianten #1
- `./ds <comp> select|remove`
- `components/<naam>/catalog.json` (`status`: active|locked)

## Links

- [[Concepts]]

- [[Origin-split]]
- [[Single-active]]
- [[Gegenereerde bestanden]]
- [[Components]]
