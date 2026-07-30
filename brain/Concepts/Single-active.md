---
type: concept
invariant: 5
enforced_in: AGENTS.md §Invarianten; ds select; ds check
tags: [concept]
---

# Single-active

Exact 1 entry per component heeft status `active`. `ds select` handhaaft dit automatisch.

## Waar afgedwongen

- `AGENTS.md` §Invarianten #5
- `./ds <comp> select <id>`
- `./ds check` (errors bij 0 of >1 active)

## Links

- [[Concepts]]

- [[Lock-model]]
- [[Components]]
