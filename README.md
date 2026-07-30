# design-system

Standalone design language + componentencatalogus + tools. Geen product;
de taal en het systeem waar producten mee gebouwd worden. v2 richt zich op de
Devin-producttaal (gemeten aan hun live site), met eigen motion-discipline en
Nederlandse copy-stem.

**Live (tailnet):** `https://joep.tail86a8f2.ts.net:8443/`

## De vijf tools

| Tool | Waar | Wat |
|---|---|---|
| **catalogus** | `components/` + `./ds` | alle varianten ooit: self + external. Lock-model: vast tot expliciete select/remove |
| **studio** | `/components/studio/` | visueel afstellen zonder code: presets (incl. **Vanaf nul**), accent, warmte, radius, tekstgrootte. Tabs: Afstellen + **Docs** (de taal lezen terwijl je stelt). Export: Kopieer tokens |
| **docs** | `/docs/` | alle .md-documenten gerenderd als lees-laag. De .md blijft de bron |
| **taste** | `/taste-site/` | het lerende smaak-systeem: bindende regels + observatie-log. Onderhoud via de `joep-design-taste` skill, gekoppeld aan alles via het propagatie-contract |
| **brain** | `/brain-site/` + `brain/` | niet-bindende context: research, decisions, concept-graph (Obsidian vault). Productregels lopen nog steeds via taste |

## Snelstart

```bash
./ds list                    # overzicht van alles
./ds button list             # één component in detail
./ds build                   # web herbouwen (catalogus + docs + taste + brain)
./ds brain new decision "…"  # decision-note in de vault
./new-project.sh mijn-app    # nieuw product scaffolden vanuit dit systeem
```

Nieuw component of variant:

```bash
# 1. experimenteer in playground/ (vrij, relatieve paden ok)
# 2. promoveer naar de catalogus
./ds button add playground/mijn-knop.html --id mijn-knop --origin self --note "wat en waarom"
# 3. selecteer als dé knop
./ds button select mijn-knop
```

## Mappen

| Pad | Rol |
|---|---|
| `ds` | CLI + web-generator (python3, geen deps) |
| `tokens.css` | tokens + primitives + typografie-schaal + icon-maten |
| `components/<naam>/` | catalog.json (bron) + self/ + external/ + index.html (gegenereerd) |
| `components/icons.svg` | 31 Lucide symbols |
| `playground/` | experimentzone — kan de catalogus nooit corrupt maken |
| `docs/` | gerenderde .md-pagina's (gegenereerd) |
| `taste-site/` | taste-regels + log als site (gegenereerd uit taste/*.md) |
| `brain/` | Obsidian Second Brain (bron) |
| `brain-site/` | brain-notes als site (gegenereerd) |
| `.agents/` | agent-skills + hooks (canoniek; `.cursor/` wijst hierheen) |
| `.commandcode/taste/taste.md` | gegenereerde agent-taste uit `kater-dev-tools` |
| `.cursor/rules/taste.mdc` | gegenereerde Cursor agent-taste uit `kater-dev-tools` |
| `CLAUDE.md` | gegenereerde Claude taste-sectie uit `kater-dev-tools` |
| `templates/` + `new-project.sh` | scaffold voor nieuwe producten |
| `references/` | meetlat-screenshots (Devin-product, eigen states) |
| `surfaces/` | per-surface ontwerpbriefs |
| `prototype-v2.html` | volledige referentie-app (3-pane sessie) |

## Regels in het kort

- Geen spinners (activiteit = worked-row + ripples), geen emoji-iconen (Lucide),
  geen em-dashes, één accent, groen/amber/rood gereserveerd, light én dark
  first-class. Volledig: `DESIGN.md` §10-13.
- Catalogus is **vast**: entries veranderen nooit stilletjes. Selecteren en
  verwijderen zijn de enige mutaties, altijd via `ds`.
- Gegenereerde bestanden (`components/*/index.html`, `docs/`, `taste-site/`,
  `brain-site/`) nooit handmatig bewerken.

Meer: `hoe-wat.md` (grote gids) · `AGENTS.md` (agent-contract) ·
`WORKFLOW.md` (processen) · `DESIGN.md` (de taal)
