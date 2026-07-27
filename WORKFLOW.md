# WORKFLOW.md — hoe je dit systeem gebruikt

> Compleet circuit: van nieuw product (X) naar gebouwde surface (Y) naar
> style-toevoegen (Z) naar taste-leren (terug naar het systeem). Alles loopt
> door deze pipeline; geen losse keuzes.

---

## X — Nieuw product starten

```bash
cd /home/joep/design-system
./new-project.sh mijn-product ~/Documents/mijn-product
```

Scaffolds:

```
mijn-product/
├── index.html        ← app-skeleton (fonts, tokens, icons, thema-toggle)
├── tokens.css        ← kopie (bron blijft in dit repo)
└── components/
    ├── icons.svg     ← 29 Lucide-symbolen
    └── lib.js        ← thema deep-links + switch-gedrag
```

Bouw daarna surfaces door componenten uit `components/*.html` te kopiëren.
Elk component bevat: werkende demo + `COMPONENT CSS` blok + contract-comment.

**Regel:** componenten worden **gekopiëerd**, niet geïmporteerd. Het product
bezit zijn eigen kopie (shadcn-model). Upstream-fixes haal je bewust binnen.

## De catalogus-discipline

Per component een map met **alle varianten ooit**, gesplitst in `self/`
(zelf-ontworpen, ook aangepaste externe) en `external/` (shadcn, devin, ...).

```
components/button/
├── catalog.json      manifest (enige bron: id, origin, source, status, note)
├── self/             on/onze varianten
├── external/         externe referenties
└── index.html        GEGENEREERD (ds build) — nooit handmatig
```

**Statussen:** `active` (1 per component, geselecteerd voor gebruik) en `locked`
(vast in de catalogus). Wat vast staat verandert niet stilletjes:
`ds select` en `ds remove` zijn enige mutaties. `playground/` is de
experimenteer-zone, promotie alleen via `ds add`.

### CLI (web herbouwt automatisch)

```bash
./ds list                                   # alle componenten + actieve variant
./ds button list                            # entries met status/origin/source
./ds button select primary                  # active wisselen (rest → vast)
./ds button add playground/x.html --id x [--origin self|external] [--source] [--note]
./ds button remove x --yes                  # expliciet verwijderen
./ds build                                  # web herbouwen (bij mutaties automatisch)
./ds check                                  # validatie (catalogus, sprite ids, geen em-dashes)
./ds style list                             # alle skins
./ds style add <naam> --css-file <file>     # nieuwe stijl toevoegen uit studio-export
```

### Web

`/components/` = gallery · `/<component>/` = catalogus met ACTIEF, badges,
zelf/extern per rij, iframes per variant. CLI en web lezen hetzelfde manifest.

## Y — Bouwdiscipline

1. **Eerst `taste/taste-rules.md` lezen.** Dat zijn geleerde regels. Binding.
2. **Bestaande componenten gebruiken** voor standaardpatronen. Iets nieuws
   = taste-beslissing.
3. **Check per scherm de bans** (DESIGN.md §10): geen spinners, geen emoji-iconen,
   geen em-dashes, één accent, groen alleen voor git, amber voor wacht-op-jou.
4. **Test beide thema's.** `?theme=dark` werkt overal.
5. **Test beide stijlen.** `?style=strak` schakelt naar de tweede skin.
6. **Toon in browser, niet in beschrijving.** Serveer met
   `python3 -m http.server <poort> --directory <product>` of via tailscale serve.

## Z — Nieuwe stijl (skin) toevoegen

Elke skin heeft een `data-style` block in `tokens.css` + registratie in
`styles.json`. De shell genereert de stijl-switch dynamisch uit `styles.json`.

### Flow: Studio → nieuwe skin

```
┌─────────────────────────────────────────────────────────────┐
│  1. Studio openen (/components/studio/)                       │
│  2. Schuiven naar gewenst uiterlijk (preset/swatches/sliders)│
│  3. "Kopieer tokens" → exporteert :root CSS naar clipboard  │
│  4. Zo op schijf opslaan:                                    │
│       cat > /tmp/mijn-stijl.css                              │
│       [plak met Ctrl+Shift+V]  Ctrl+D                        │
│  5. ds style add <naam> --css-file /tmp/mijn-stijl.css       │
│     → parses :root vars → schrijft [data-style="<naam>"]     │
│       in tokens.css + registreert in styles.json             │
│  6. switch is direct overal beschikbaar                      │
│     (Stijl-seg in rail, /?style=<naam> deep-link)            │
└─────────────────────────────────────────────────────────────┘
```

Handmatig: `ds style add zacht --css-file /tmp/studio-export.css`
Zonder studio: schrijf een :root block (of gewone tokens) in een file,
`ds style add` zet het om naar `[data-style="..."]`.

### Relatie met studio-presets

De studio heeft **presets** (Devin/Strak/Zacht) die accent/warmte/radius
combineren. Een **skin** is een complete token-override in tokens.css.
Je kunt een studio-preset promoten naar een skin door de export in te lezen:

```
1. Studio: preset "Zacht" laden → Kopieer tokens
2. ds style add zacht --css-file /tmp/export.css
3. Switch in rail toont "Zacht" als derde skin
```

## Home page (WIP)

De root `index.html` is architectuur-placeholder. De echte home page wordt een
theatrale, interactieve ervaring — geïnspireerd op:
- **Fable 5** announcement (cinematische product-reveal animation)
- **Kimi 3** announcement (motion-heavy intro)
- **Dans site** (rode vlinders die uit het scherm komen — depth/parallax effect)

Zie `/home/joep/design-system-prototype` voor de volgende iteratie.

## Taste-loop — terug in het systeem

```
Joep ziet iets
  → log in taste/taste-log.md (shown / reaction / signal / delta)
  → 2+ observaties van hetzelfde patroon
  → regel in taste/taste-rules.md
  → propagatie (verplicht, zelfde commit):
      DESIGN.md          als de taal verandert
      tokens.css         als tokens/primitives veranderen
      components/<x>.html als een component verandert
      surfaces/<x>.md    als een surface-brief verandert
      styles.json        als een stijl wordt toegevoegd
  → commit prefix "taste: <wat>"
```

Propagatie is **geen optie.** Een regel in taste-rules.md die nergens anders
staat, bestaat niet.

## CI

`.github/workflows/validate.yml` draait op elke push/PR:

1. **`ds build --check`** — idempotentiecheck: de gegenereerde bestanden moeten
   up-to-date zijn met de manifesten (git diff ≡ 0 na build).
2. **`ds check`** — validatie: catalogus-schema (1 active per component, bestaan
   van bestanden), sprite-referenties, em-dash vrije copy in .md bestanden
   (warning-only).

Zolang GitHub Actions minuten op private repos beperkt zijn, draai je lokaal:
```bash
./ds check && python3 ds build --check
```

## Bestandskaart

| Pad | Rol | Wanneer aanraken |
|---|---|---|
| `DESIGN.md` | gelockte taal | taste-loop of Joep-beslissing |
| `tokens.css` | tokens + primitives | elke token/primitieve-wijziging |
| `styles.json` | stijl-registratie | nieuwe skin toevoegen (ds style add) |
| `components/` | standalone componenten + catalogus | nieuw patroon of propagatie |
| `motion-spec.md` | fysica | zelden — gelockt |
| `surfaces/` | per-surface briefs | nieuwe surfaces |
| `prototype-v2.html` | referentie-app | meerdere componenten tegelijk |
| `references/` | meetlat-screenshots | twijfel over "hoe ziet goed eruit" |
| `taste/` | lerend systeem | continu |
| `new-project.sh` + `templates/` | X-scaffolder | scaffold-verbeteringen |
| `playground/` | experimenteerzone | elke oefensessie |
| `.github/workflows/` | CI | validatie-automatisering |
