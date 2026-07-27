# design-system

Eigen design language voor agent-producten. Standalone — ooit ontstaan tijdens de
OpenWork-rebuild-audit, nu een los systeem dat op elk product toepasbaar is.

**v2 "Devin-richting"**: warm off-white, één blauw accent, shadcn-componenten,
Lucide-iconen, levende activiteitsindicator in plaats van spinners, Nederlandse copy.

## Snel kijken

```bash
cd design-system
python3 -m http.server 8765 --bind 127.0.0.1
# → http://127.0.0.1:8765/            (index)
# → http://127.0.0.1:8765/prototype-v2.html?state=holding
```

## Inhoud

| Pad | Wat |
|---|---|
| `DESIGN.md` | de gelockte taal (kleur, type, iconen, componenten, layout, stem, bans) |
| `tokens.css` | implementatie als CSS custom properties + primitives |
| `motion-spec.md` | motion-fysica (spring 180/26, ripple-contract) |
| `prototype-v2.html` | speelbare referentie: 3-pane sessie-UI, run/hold/done states |
| `prototype-v1-stroom.html` | archief: v1 teal "Stroom"-richting |
| `surfaces/` | per-surface design briefs |
| `references/` | Devin-product screenshots (gemeten DNA) + eigen states |
| `taste/` | zelflerend taste-systeem: log → regels → DESIGN.md |

## Regels in één adem

Geen spinners. Geen emoji als icoon. Geen em-dashes. Eén accent (blauw).
Groen = git, amber = wacht-op-jou. Koppen weight 500. Mono alleen voor data.
Alles settle-t vroeg. Toon bewijs (diffs, PR's, before/after), vertel niet.
