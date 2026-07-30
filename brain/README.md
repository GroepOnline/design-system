---
type: vault-meta
tags: [meta]
---

# README

Obsidian Second Brain voor dit design-system. Bron: `brain/**/*.md`. Leeslaag: `brain-site/` (gegenereerd, gecommit).

## Openen

Obsidian → Open folder as vault → `/home/joep/design-system/brain`

Vault-naam: **brain**. De lege `~/Documents/Obsidian Vault` is install-default; negeren.

### Obsidian CLI (lokaal, Obsidian moet draaien)

```bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
obsidian vaults
obsidian vault=brain files
obsidian vault=brain search query="Lock-model"
obsidian vault=brain read path="Home.md"
obsidian vault=brain open path="Home.md"
```

Zonder `XDG_RUNTIME_DIR`: "Unable to find Obsidian". CI/agents: geen Obsidian CLI - `./ds brain *` of file-writes.

## Wat wel / niet

| Wel | Niet |
|---|---|
| Research, decisions, concept-links | Productregels die DESIGN.md overschrijven |
| Graph van invarianten | Vervanging van `taste/` of docs |
| Context voor agents en Joep | Joep Brain / fleet sync / agent-taste generators |

## Commando's

```bash
./ds brain build
./ds brain check
./ds brain new decision "titel"
./ds brain new research "titel"
./ds build
```

## Structuur

- [[Home]] - MOC
- Indexes: [[Design Language]], [[Components]], [[Surfaces]], [[Taste]], [[Concepts]], [[Decisions]], [[Research]]
- Templates: [[New Decision]], [[New Research]]
- Concepts - zes notes uit AGENTS.md
