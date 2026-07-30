---
name: brain-note-hygiene
description: Notes schrijven voor de design-system brain-vault zodat de graph en ds brain check schoon blijven. Gebruik bij het aanmaken of bewerken van brain/**/*.md, bij unresolved wikilinks, orphans, ontbrekende frontmatter of dubbele note-titels.
domain: memory-brain
surfaces:
- design-system
- Obsidian
triggers:
- wikilink
- orphan
- frontmatter
- brain check
- note hygiene
avoid_when:
- taste-rules of DESIGN.md copy (andere regels)
risk: mutating
last_reviewed: '2026-07-30'
---

# Brain note hygiene

Doel: `./ds brain check` geeft 0 warnings en Obsidian meldt 0 unresolved links
en 0 orphans.

## Frontmatter (verplicht)

Elke note start met een frontmatter-blok:

```markdown
---
type: index | concept | decision | research | template | home | vault-meta
tags: [index]
---
```

Concept-notes voegen toe waar de invariant afgedwongen wordt:

```markdown
---
type: concept
invariant: 1
enforced_in: AGENTS.md §Invarianten; ds select/remove; catalog.json status
tags: [concept]
---
```

## Naamgeving

- Title Case bestandsnaam, die tegelijk de wikilink-naam is
- Decisions en research krijgen een datum-prefix: `2026-07-30 Titel.md`
- Nooit twee notes met dezelfde basename; Obsidian maakt de link dan ambigu en
  `ds brain check` meldt `duplicate note title`
- Templates heten `New Decision.md` en `New Research.md`, juist om te botsen
  met niets anders

## Links

- Verwijs met `[[Note Title]]`, niet met paden of markdown-links
- Elke note eindigt met een `## Links`-sectie naar minstens de eigen index en
  een verwante note
- Nieuwe note ook opnemen in de bijhorende index (`Indexes/Decisions.md`,
  `Indexes/Research.md`, `Indexes/Concepts.md`), anders orphan
- Verwijs naar repo-bestanden als code, niet als wikilink: `../DESIGN.md`,
  `components/button/catalog.json`

## Copy

- Geen em-dashes; gebruik " - " of herformuleer. `ds brain check` meldt ze
- Nederlands, direct, geen buzzwords
- Geen emoji als icoon

## Loop na elke wijziging

```bash
./ds brain check      # verwacht: 0 warnings
./ds brain build      # leeslaag bijwerken
git diff --stat       # brain-site/ hoort mee te gaan in dezelfde commit
```

Als Obsidian open staat, verifieer met:

```bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
obsidian vault=brain reload
obsidian vault=brain unresolved
obsidian vault=brain orphans
```
