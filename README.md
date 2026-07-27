# design-system

Ons eigen design-systeem voor agent-producten. Standalone, product-onafhankelijk.

**v2 "Devin-richting"**: warm off-white, één blauw accent, shadcn-componenten,
Lucide-iconen, levende activiteit in plaats van spinners, Nederlandse copy.
Light én dark (Basalt) als first-class thema's.

## Snel kijken

```bash
cd design-system
python3 -m http.server 8765 --bind 127.0.0.1
# → /                      index
# → /components/           gallery (mini-storybook, thema-toggle)
# → /components/settings.html   instellingen-surface
# → /prototype-v2.html     volledige referentie-app
```

## Nieuw product starten (X)

```bash
./new-project.sh mijn-product ~/Documents/mijn-product
```

Daarna componenten kopiëren uit `components/` (copy-paste, zoals shadcn).
Volledige discipline in `WORKFLOW.md`.

## Inhoud

| Pad | Wat |
|---|---|
| `DESIGN.md` | de gelockte taal (kleur, type, iconen, componenten, layout, stem, bans) |
| `WORKFLOW.md` | X scaffolden, Y bouwen, taste-loop propagatie |
| `tokens.css` | custom properties + primitives (btn, gbtn, badge, switch, seg, input, setting) |
| `components/` | 10 standalone componenten + icons.svg + lib.js + gallery |
| `motion-spec.md` | motion-fysica (spring 180/26, ripple-contract) |
| `prototype-v2.html` | speelbare referentie: 3-pane sessie-UI, run/hold/done |
| `surfaces/` | per-surface design briefs |
| `references/` | Devin-product screenshots (gemeten DNA) |
| `taste/` | zelflerend taste-systeem: log → regels → propagatie |
| `new-project.sh` + `templates/` | project-scaffolder |

## Regels in één adem

Geen spinners. Geen emoji als icoon. Geen em-dashes. Eén accent (blauw).
Groen = git, amber = wacht-op-jou. Koppen weight 500. Mono alleen voor data.
Alles settle-t vroeg. Toon bewijs (diffs, PR's, before/after), vertel niet.
