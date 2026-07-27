# WORKFLOW.md — hoe je dit systeem gebruikt

> Het complete circuit: van nieuw product (X) naar gebouwde surface (Y) naar
> taste-leren (terug naar het systeem). Geen losse keuzes meer — alles loopt
> door deze pipeline.

---

## X — Nieuw product starten (template)

```bash
cd /home/joep/design-system
./new-project.sh mijn-product ~/Documents/mijn-product
```

Dat scaffolds:

```
mijn-product/
├── index.html          ← app-skeleton (fonts, tokens, icons, thema-toggle)
├── tokens.css          ← kopie (de bron blijft dit repo)
└── components/
    ├── icons.svg       ← 29 Lucide-symbols
    └── lib.js          ← thema deep-links + switch-gedrag
```

Daarna: bouw surfaces door componenten uit `components/*.html` te kopiëren.
Elk componentbestand bevat: werkende demo + `COMPONENT CSS` blok + contract-comment.

**Regel:** componenten worden gekopieerd, niet geïmporteerd. Het product bezit zijn
eigen kopie (zoals shadcn). Upstream-fixes haal je bewust binnen, nooit automatisch.

## De catalogus-discipline (kern van het systeem)

Per component een map met **alle varianten ooit**, gesplitst in `self/` (zelf-ontworpen,
ook aangepaste externe) en `external/` (shadcn, devin-observed, ...). Bron: `catalog.json`.

```
components/button/
├── catalog.json      manifest: id, origin, source, status, note
├── self/             onze varianten
├── external/         externe referenties
└── index.html        GEGENEREERD (ds build) — nooit handmatig bewerken
```

**Statussen:** `active` (geselecteerd voor gebruik, 1 per component) en `locked`
(vast in de catalogus). Wat vast staat verandert nooit stilletjes: alleen
`ds select` of `ds remove` raakt het. Een oefensessie kan het systeem niet
verneuken, want experimenten leven in `playground/` en komen er alleen in via
een expliciete `ds add`.

### CLI (reactief, herbouwt web automatisch)

```bash
./ds list                                # alle componenten + actieve variant
./ds button list                         # entries met status/origin/source
./ds button select primary               # active wisselen (rest -> vast)
./ds button add playground/x.html --id x --origin self --note "..."
./ds button remove x --yes               # expliciet verwijderen
./ds build                               # web herbouwen (gaat automatisch bij mutaties)
```

### Web (gegenereerd uit dezelfde manifests)

`/components/` = gallery uit catalog.json-bestanden. `/components/button/` = de
button-catalogus met ACTIEF-markering, vast-badges, zelf/extern-split, iframes
per variant. CLI en web spreken dezelfde taal omdat het manifest de enige bron is.

## Y — Bouwen (de discipline)

1. **Lees eerst `taste/taste-rules.md`.** Dat zijn de geleerde regels. Binding.
2. **Gebruik alleen bestaande componenten** voor standaardpatronen. Iets nieuws
   verzinnen is een taste-beslissing, geen vrijbrief.
3. **Check per scherm de bans** (DESIGN.md §10): geen spinners, geen emoji-iconen,
   geen em-dashes, één accent, groen alleen voor git, amber alleen voor wacht-op-jou.
4. **Test beide thema's.** `?theme=dark` werkt op elke component-pagina en op de
   gallery (`components/index.html`).
5. **Toon het Joep in de browser**, niet als beschrijving. Serveer:
   `python3 -m http.server <poort> --directory <product>` of via tailscale serve.

## Taste-loop — wijzigingen komen terug in het systeem

```
Joep ziet iets
  → reactie in taste/taste-log.md (shown / reaction / signal / delta)
  → 2+ observaties van hetzelfde patroon
  → regel in taste/taste-rules.md
  → propagatie (verplicht, zelfde commit):
      DESIGN.md          als de taal zelf verandert
      tokens.css         als tokens/primitives veranderen
      components/<x>.html als een component verandert
      surfaces/<x>.md    als een surface-brief verandert
  → commit met prefix "taste: <wat>"
```

**Propagatie is geen optie.** Een regel die alleen in taste-rules.md staat en
nergens anders, bestaat niet.

## Bestandskaart

| Pad | Rol | Wanneer aanraken |
|---|---|---|
| `DESIGN.md` | gelockte taal | alleen via taste-loop of expliciete Joep-beslissing |
| `tokens.css` | tokens + primitives (btn/gbtn/badge/switch/seg/input/setting) | bij elke token- of primitive-wijziging |
| `components/` | standalone componenten + gallery | nieuw patroon of taste-propagatie |
| `motion-spec.md` | fysica | zelden — motion is gelockt |
| `surfaces/` | per-surface briefs | bij nieuwe surfaces |
| `prototype-v2.html` | volledige referentie-app | als meerdere componenten tegelijk veranderen |
| `references/` | meetlat-screenshots (Devin) | bij twijfel over "hoe ziet goed eruit" |
| `taste/` | het lerende systeem | continu |
| `new-project.sh` + `templates/` | X-scaffolder | als de scaffold zelf verbetert |

## Verbeteren van het systeem zelf

- Nieuwe component nodig? Maak `components/<naam>.html` (standalone, met
  COMPONENT CSS-blok + contract-comment), voeg toe aan gallery-grid in
  `components/index.html`, commit.
- Nieuwe primitive (zoals .switch)? Eerst in `tokens.css`, dan gebruiken in
  componenten. Nooit andersom.
- Prototype eerst: twijfelgeval → bouw in `prototype-v2.html`, laat Joep voelen,
  pas dan component eruit extraheren.
