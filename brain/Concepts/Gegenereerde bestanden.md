---
type: concept
invariant: 3
enforced_in: AGENTS.md §Invarianten; ds build; CI build idempotentie; .agents/hooks/guard-generated.sh
tags: [concept]
---

# Gegenereerde bestanden

`components/*/index.html`, `components/index.html`, `docs/`, `taste-site/`, `brain-site/` zijn output van `ds build`. Nooit handmatig bewerken - wijzig bron of generator (`ds`).

## Waar afgedwongen

- `AGENTS.md` §Invarianten #3
- `./ds build` / `build_*` in `ds`
- CI: regenerate-en-diff
- Hook `.agents/hooks/guard-generated.sh` weigert Write-edits in de output

## Links

- [[Concepts]]

- [[Lock-model]]
- [[Home]]
