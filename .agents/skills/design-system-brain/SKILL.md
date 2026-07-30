---
name: design-system-brain
description: Werken met de design-system Second Brain in brain/ (Obsidian vault) en de brain-site leeslaag. Gebruik bij research, decisions, concept-notes, ds brain build|check|new, of vragen over de vault in dit repo. Niet joep-brain (bc-scan-arm) en niet de UI taste-loop.
domain: memory-brain
surfaces:
- design-system
- Obsidian
triggers:
- brain
- vault
- obsidian
- decision note
- research note
- ds brain
avoid_when:
- joep-brain / bc-scan-arm personal memory
- UI-regels wijzigen (dat is de taste-loop)
risk: mutating
last_reviewed: '2026-07-30'
---

# Design-system Brain

`brain/` is de Obsidian-vault van dit repo: niet-bindende context (waarom,
research, decisions, concept-graph). `brain-site/` is de gegenereerde leeslaag.

## Autoriteit (nooit omzeilen)

| Laag | Pad | Bindend |
|---|---|---|
| Product-waarheid | `DESIGN.md`, `tokens.css`, `taste/`, `components/*/catalog.json` | ja |
| Second Brain | `brain/**/*.md` | nee |

Een `brain/Decisions/`-note overschrijft nooit `DESIGN.md`, `tokens.css` of
`catalog.json` direct. Wordt een decision een productregel, dan gaat die
alsnog via taste-log naar taste-rules naar DESIGN.md. Zie skill
`brain-decision-capture`.

## Commando's

```bash
./ds brain build                  # brain/**/*.md naar brain-site/
./ds brain check                  # wikilinks, frontmatter, em-dash, dubbele titels
./ds brain new decision "titel"   # uit Templates/New Decision.md
./ds brain new research "titel"   # uit Templates/New Research.md
./ds build                        # volledige rebuild, brain-site inbegrepen
```

`ds brain new` en `ds brain build` schrijven zelf de leeslaag. Na elke
handmatige note-wijziging hoort `./ds brain build` te lopen zodat `git diff`
schoon blijft (CI doet regenerate-en-diff).

## Structuur

```
brain/
├── Home.md              MOC, linkt alle indexes
├── Indexes/             Design Language, Components, Surfaces, Taste,
│                        Concepts, Decisions, Research
├── Concepts/            6 notes: de 5 invarianten + Taste-propagatie
├── Decisions/           besluiten met datum-prefix
├── Research/            onderzoek met datum-prefix
└── Templates/           New Decision, New Research
```

Nieuwe note hoort in een bestaande map en moet vanuit de bijhorende index
gelinkt worden, anders wordt het een orphan in de graph.

## Obsidian CLI (alleen lokaal, GUI moet open)

```bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
obsidian vault=brain files
obsidian vault=brain search query="Lock-model"
obsidian vault=brain unresolved
obsidian vault=brain orphans
```

Zonder `XDG_RUNTIME_DIR` volgt "Unable to find Obsidian" (socket staat in
`/run/user/$UID/.obsidian-cli.sock`). Gebruik de CLI nooit in CI of in
geautomatiseerde flows: daar gelden `./ds brain *` en directe file-writes.

## Grenzen

- Geen sync naar `joep-brain` (bc-scan-arm) tenzij Joep expliciet ingest vraagt
- Geen tweede kopie van DESIGN-DNA in de vault; verwijs naar `references/` en `DESIGN.md`
- `brain-site/` is gegenereerd: nooit handmatig bewerken
- Geen community plugins toevoegen zonder review; `plugins/*/data.json` staat in `.gitignore`
