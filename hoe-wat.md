# Hoe & wat: de grote gids

Een complete gids bij dit design-systeem, voor zowel mensen als AI-agents.
Niks staat hier dat niet klopt met de bronbestanden. Gebruik dit als vertrekpunt,
raadpleeg de bronnen voor details.

---

## 1. Wat is dit

Dit is **design-system v2** (ook wel "Devin-richting" genoemd). Het is geen product,
maar een **standalone design-taal + component-catalogus + toolset** waarmee je
nieuwe producten bouwt. Elk product dat hieruit ontstaat, erft dezelfde look &
feel zonder afhankelijk te worden van een runtime-package.

De kern in een paar zinnen:

- Warm off-white ondergrond (`rgb(247,246,245)`), een enkel blauw accent (`--accent`)
- shadcn/ui-componenten als basis, Lucide-iconen (29 symbols)
- Geen spinners, activiteit toont als live timers + tool-ripples
- Nederlandse copy op gebruikersvlakken
- Light- en dark-mode (Basalt) zijn first-class

De v1 was "Stroom" (teal, eigen signatuurlijn). v2 is gemeten aan Devins
product-UI (2026-07-27), met eigen motion-discipline en een zelflerend
taste-systeem.

---

## 2. De vijf tools

Dit systeem heeft vijf samenhangende gereedschappen. Catalogus, studio, docs en
taste delen dezelfde product-SSOT. Brain is de niet-bindende context-laag
(research, decisions, concept-graph).

### Catalogus, `ds` CLI + web

De CLI is het hart. Elk commando wijzigt een manifest en herbouwt de web-gallery:

```bash
./ds list                              # alle componenten + actieve variant
./ds button list                       # entries met status/origin/source van button
./ds button select primary             # active wisselen (rest wordt locked)
./ds button add playground/x.html --id x --origin self --note "..."
./ds button remove x --yes             # expliciet verwijderen
./ds build                             # web volledig herbouwen (catalogus + docs + taste + brain)
./ds brain build|check|new …           # Second Brain (zie hieronder)
```

Web (statisch gegenereerd uit manifests):

- `/`, index
- `/components/`, gallery met alle componenten, thema-toggle, mini-storybook
- `/components/button/`, cataloguspagina per component met ACTIEF-markering,
  vast-badges, self/extern-split, iframes per variant

### Studio

De studio is de visuele werkplek. Hier kun je:

- Componenten bekijken en afstellen in beide thema's
- De docs-tab raadplegen per component (gebruik/vermijd)
- Vanaf nul een nieuwe variant bouwen in `playground/` en die via de CLI promoveren

Open de studio door `python3 -m http.server 8000` te draaien
in de design-system-root en `http://localhost:8000/components/` te openen.

### Docs

Elk `.md`-bestand in de repo is onderdeel van de documentatie. De belangrijkste:

| Bestand | Wat staat erin |
|---|---|
| `DESIGN.md` | De gelockte taal: kleur, type, iconen, componenten, layout, stem, bans |
| `WORKFLOW.md` | Hoe je een nieuw product start (X), een surface bouwt (Y), en de taste-loop |
| `AGENTS.md` | Instructies voor AI-agents: invarianten, commando's, harde bans |
| `motion-spec.md` | De gelockte motion-fysica (spring 180/26, timing-curves) |
| `surfaces/*.md` | Per-surface design briefs (session, composer, palette, settings, etc.) |
| `taste/taste-rules.md` | Geleerde regels uit Joeps reacties, binding voor nieuw werk |
| `taste/taste-log.md` | Het logboek: shown/reaction/signal/delta per observatie |
| `brain/` | Obsidian Second Brain (niet-bindende context) |

### Taste, het lerende systeem

Taste is geen losse tool maar een proces. Het werkt zo:

1. Joep ziet iets → reactie in `taste/taste-log.md`
2. 2+ observaties van hetzelfde patroon → regel in `taste/taste-rules.md`
3. Propagatie (verplicht, zelfde commit): `DESIGN.md`, `tokens.css`,
   geraakte `components/`, `surfaces/`
4. Commit met prefix `taste: <wat>`

Een regel die alleen in taste-rules.md staat en nergens anders, bestaat niet.

### Brain, de Second Brain

`brain/` is een Obsidian-vault (wikilinks, graph). `brain-site/` is de
gegenereerde leeslaag. Brain overschrijft nooit product-SSOT; productregels
lopen uitsluitend via de taste-loop.

```bash
./ds brain build
./ds brain check
./ds brain new decision "titel"
./ds brain new research "titel"
```

Open in Obsidian: folder as vault → `brain/`. Leeslaag: `/brain-site/`.

---

## 3. Hoe start je iets nieuws

Een nieuw product (hier X genoemd) scaffold je met het meegeleverde script:

```bash
cd /home/joep/design-system
./new-project.sh mijn-product ~/Documents/mijn-product
```

Dit maakt:

```
mijn-product/
├── index.html          , app-skeleton (fonts, tokens, icons, thema-toggle)
├── tokens.css          , kopie van de bron (wijzigingen haal je bewust binnen)
└── components/
    ├── icons.svg       , 29 Lucide-symbols als sprite
    └── lib.js          , thema deep-links + switch-gedrag
```

### Een component toevoegen

Nieuwe componenten maak je nooit direct in de catalogus. De route:

1. **Bouw een prototype** in `playground/` (experimenteer, pas aan, voel)
2. **Promoveer naar de catalogus** met de CLI:

```bash
./ds button add playground/mijn-variant.html --id mijn-variant --origin self --note "compacte variant voor settings-rijen"
```

3. **Selecteer als actief** (als dit de standaard moet worden):

```bash
./ds button select mijn-variant
```

De CLI herbouwt de web-gallery automatisch. Je kunt de nieuwe variant meteen
bekijken op `/components/button/`.

### Een compleet nieuwe component-familie

Maak een map aan zoals de bestaande (`components/button/`), met een `catalog.json`
(gebruik een bestaand manifest als template), voeg je HTML-bestanden toe in
`self/` of `external/`, en draai `./ds build`.

---

## 4. Hoe werk je als agent ermee

### Invarianten (nooit breken)

| # | Regel | Waarom |
|---|---|---|
| 1 | **Lock-model.** Catalogus-entries zijn onveranderlijk (`locked`) tot expliciet `ds select` of `ds remove`. Nieuwe versie = nieuwe id | Anders verlies je historie en is niet te zien wat ooit gold |
| 2 | **Origin-split.** `self/` = eigen ontwerpen, `external/` = ongewijzigde referenties met `source`-veld | Zuiverheid van herkomst, zoals shadcn onderscheidt wat je zelf deed |
| 3 | **Gegenereerde bestanden.** `components/*/index.html` en `components/index.html` zijn output van `ds build`. Nooit handmatig bewerken | Anders werkt de volgende `ds build` je wijzigingen overschrijven |
| 4 | **Playground.** Experimenten alleen in `playground/`. Promotie via `ds <comp> add` | De catalogus blijft schoon; afval ontstaat niet |
| 5 | **Single-active.** Exact 1 entry per component heeft status `active`. `ds select` handhaaft dit | Anders weet niemand wat de standaard is |

### Commando's die je als agent gebruikt

```bash
# Overzicht krijgen
./ds list

# Details per component
./ds button list

# Actieve variant wisselen
./ds button select primary

# Nieuw toevoegen (na experiment in playground)
./ds button add playground/x.html --id x --origin self --note "..."

# Verwijderen
./ds button remove x --yes

# Volledige rebuild (als er handmatig iets misging)
./ds build
```

### Harde bans uit DESIGN.md (overnemen in elke surface die je bouwt)

- Geen spinners, activiteit toont als worked-row (live timer) + tool-ripples (1.1s, stopt)
- Geen emoji als icoon, gebruik Lucide SVG uit `components/icons.svg`
- Geen em-dashes in copy
- Een accent. Groen = git/PR, amber = wacht-op-jou, rood = destructief
- Geen paars, geen gradients in UI, geen glassmorphism, geen cards-in-cards
- Dark mode testen: `?theme=dark` op elke component-pagina

### Propagatie-contract (verplicht na taste-observaties)

Als je een taste-regel toevoegt, moet je in **dezelfde commit** ook
de afgeleide bestanden updaten:

```
taste-log entry → 2+ observaties → regel in taste-rules.md
  → update DESIGN.md (als de taal zelf verandert)
  → update tokens.css (als tokens/primitives veranderen)
  → update components/<x>.html (als een component verandert)
  → update surfaces/<x>.md (als een surface-brief verandert)
```

Commit-prefix: `taste: <wat>` of `component: <wat>`.

---

## 5. Hoe werk je als mens ermee

### Studio gebruiken

1. **Start de server:** `./ds serve 8765` in de design-system-root
2. **Open `http://127.0.0.1:8765/components/`**, hier zie je de gallery met alle componenten
3. **Klik op een component** voor de detailpagina met alle varianten, iframes, docs-tab
4. **Toggle thema** met de dark-mode knop of via `?theme=dark` in de URL

### Tokens kopiëren naar een product

Het systeem gebruikt geen package-manager of CDN. Kopieer wat je nodig hebt:

```bash
cp tokens.css /pad/naar/mijn-product/
cp components/icons.svg /pad/naar/mijn-product/components/
cp components/lib.js /pad/naar/mijn-product/components/
```

Elk product bezit zijn eigen kopie (shadcn-model). Upstream-fixes haal je
bewust binnen, nooit automatisch.

### Gallery bekijken zonder server

Open `components/index.html` direct in de browser. Let op: sommige features
(CSS imports, iframes) werken mogelijk niet vanwege CORS, dan heb je de
http-server nodig.

### Thema togglen in elk product

Elk product dat uit dit systeem is gescaffold heeft een thema-toggle.
Daarnaast werkt `?theme=dark` in de URL op elke component-pagina en gallery.

---

## 6. Veelgemaakte fouten

| Fout | Waarom het fout is | Wat wel |
|---|---|---|
| Handmatig `components/button/index.html` bewerken | Dat bestand is gegenereerd door `ds build`. Je wijziging wordt overschreven | Wijzig het manifest of voeg een nieuwe entry toe via `ds add` |
| Een nieuwe variant in `self/` zetten terwijl het een shadcn-kopie is | `self/` is voor eigen ontwerpen en aanpassingen. `external/` is voor ongewijzigde referenties | Zet shadcn-kopieën in `external/` met `source`-veld |
| Twee componenten tegelijk `active` maken | Het systeem verwacht exact 1 actieve variant per component. De gallery toont alleen de actieve | Gebruik `ds select`, dat handhaaft single-active |
| Emoji gebruiken als icoon in een knop | Emoji zijn geen iconen; ze hebben geen vaste stijl, schalen anders en breken de visuele taal | Gebruik een Lucide SVG uit `icons.svg` via `<use href="#i-...">` |
| Een taste-regel toevoegen zonder propagatie | Een regel die alleen in taste-rules.md staat, bestaat niet. Anderen (mens of agent) zien de consequentie niet | Werk in dezelfde commit ook DESIGN.md, tokens.css, componenten en surfaces bij |
| Een product direct via npm/CDN koppelen | Dit systeem gebruikt copy-paste (shadcn-model). Geen package.json dependency | Kopieer tokens.css, icons.svg en lib.js naar het product |
| Inter/Geist gebruiken als font | Die zijn verboden. General Sans is het interface-font, JetBrains Mono alleen voor data | Gebruik General Sans 400/500/600 voor alles behalve data |
| `ds build` overslaan na een wijziging | De web-gallery is dan niet in sync met de catalogus | Elke mutatie via de CLI herbouwt automatisch. Bij twijfel: `./ds build` |

---

## 7. FAQ

**Waarom zitten er geen spinners in het systeem?**

Spinners zeggen "ik weet niet hoe lang het duurt" en zijn passief. Dit systeem
toont activiteit met een live timer (tabular mono) en tool-ripples (18px golfje,
1.1s, eenmalig). Dat geeft de gebruiker informatie in plaats van een leeg rondje.
Zie DESIGN.md paragraph 7 en `motion-spec.md`.

**Waarom geen emoji in de UI?**

Emoji hebben geen vaste stijl, ze zien er anders uit per platform, per browser,
per versie. Ze ondersteunen geen `stroke`, geen `fill`, geen twee maten in
dezelfde taal. Dit systeem gebruikt Lucide SVG-iconen (24-viewBox, stroke 1.75,
ronde caps/joins) die overal identiek zijn. Zie DESIGN.md paragraph 5 en 12.

**Waarom maar een accentkleur?**

Eén accent (`--accent`, blauw `#317CFF` / `#5C97FF`) geeft rust en leesbaarheid.
Als alles schreeuwt, schreeuwt niks. Groen is gereserveerd voor git-status,
amber voor wacht-op-jou, rood voor destructieve acties, die zijn semantisch,
niet decoratief. Zie DESIGN.md paragraph 3.

**Hoe komt een regel in taste-rules.md?**

Taste is een zelflerend systeem. Er zijn twee observaties (uit `taste-log.md`)
nodig van hetzelfde patroon voordat het een regel wordt. Bijvoorbeeld: Joep zegt
twee keer "geen emoticons in knoppen" → dat wordt een learned rule in
taste-rules.md met een datum en verwijzing naar de observaties. Propagatie
naar DESIGN.md, tokens.css, componenten is verplicht in dezelfde commit.

**Wanneer zet ik iets in `self/` versus `external/`?**

- `self/`: eigen ontwerpen, of externe componenten die je hebt aangepast
- `external/`: ongewijzigde referenties (shadcn-bron, Devin-geobserveerd, etc.)
  met een `source`-veld dat herkomst vastlegt

De origin-split is er om later te kunnen zien: wat hebben we zelf bedacht en
wat komt ergens vandaan.

**Hoe werkt het lock-model precies?**

Elke entry in de catalogus heeft een status: `locked` (vast, verandert niet
stilletjes), `active` (de geselecteerde standaard, exact 1 per component), of
`archived` (verwijderd maar niet weg). Een entry wijzig je nooit in-place.
Een nieuwe versie krijgt een nieuwe id of je doet een expliciete
`ds remove` + `ds add`. Experimenten doe je in playground/, promotie via
`ds add`.

**Hoe test ik dark mode?**

Voeg `?theme=dark` toe aan elke component-pagina of gallery-URL.
Bijvoorbeeld: `http://127.0.0.1:8765/components/button/?theme=dark`.
Andere productsurfaces die `<html data-theme="dark">` ondersteunen doen
hetzelfde. De thema-toggle in de gallery werkt ook. Light- en dark-mode
zijn allebei first-class; test altijd beide.

**Hoe voeg ik een nieuw icoon toe?**

De Lucide-sprite staat in `components/icons.svg`. Een nieuw symbool toevoegen:

1. Kopieer het pad uit Lucide (of teken zelf, stroke 2, round caps/joins)
2. Voeg een `<symbol id="i-mijn-icoon" viewBox="0 0 24 24">...</symbol>` toe
   vóór de sluit-`</svg>`
3. Gebruik het met `<svg class="ic"><use href="#i-mijn-icoon"></use></svg>`

Zorg dat het SVG-element `fill:none;stroke:currentColor` heeft (`.ic`-klasse
doet dit al). Er zitten nu 29 symbols in de sprite.

---

## Bijlagen

- `DESIGN.md`, de volledige design language
- `WORKFLOW.md`, de pipeline van nieuw product tot taste-terugkoppeling
- `AGENTS.md`, samengevatte agent-instructies (invarianten, bans, commando's)
- `taste/taste-rules.md`, alle geleerde regels met bron
- `motion-spec.md`, de gelockte motion-fysica
