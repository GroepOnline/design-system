# DESIGN.md -- v3 "Signaal"

> De design language. Standalone systeem, niet gekoppeld aan één product.
> v1 was "Stroom" (teal). v2 mat de Devin-producttaal als kalibratie.
> **v3 (2026-08-22): de taal heet Signaal en staat op eigen benen.** De
> Devin-meting (§2) blijft staan als historische kalibratie, niet als doel:
> we klonen geen stijl, we meten er onze eigen beslissingen aan. Alles wat
> Signaal herkenbaar maakt is van ons: de meetlat/doorsnede-layout (§8), de
> worked-row + ripples (§7), de dot-matrix motion-signatuur (§15), de
> serif-bladstem, en de Nederlandse copy-stem (§9).

---

## 1. Kern

**Een stil, warm, mat instrument dat toont wat de agent doet terwijl het gebeurt.**

Drie pijlers:

1. **Stil oppervlak.** Warm off-white, hairlines, geen glow, geen gradients in UI.
2. **Levende activiteit.** Werk zie je als tijd + golfjes, nooit als spinner.
3. **Bewijs in beeld.** Diffs, PR-cards, before/after. De agent toont, niet vertelt.

## 2. Gemeten Devin-DNA (bron: devin.ai computed styles, 2026-07-27)

| Element | Waarde | Overname |
|---|---|---|
| body bg | `rgb(247,246,245)` | exact |
| tekst | `rgb(25,25,25)` | exact |
| link-blauw | `rgb(68,109,205)` | als `--accent-ink` familie |
| merk-blauw | `#317CFF` (uit product-UI) | als `--accent` |
| badge-blauw | `#2200FF` (NEW-pill) | niet -- te hard |
| marketing-cards | radius 16px | product: 12px (`--r-lg`) |
| knoppen (marketing) | radius 0px | product: 8px (`--r-md`) |
| headings | weight 500, tracking −4% | weight 500, tracking −2% (product) |
| font | NB International Pro | General Sans (interface) + Instrument Serif (display, eigen blad-stem) |

## 3. Kleur

Zie `tokens.css`. Regels:

- **Eén accent**: blauw `#317CFF` (licht) / `#5C97FF` (donker). Niets anders mag schreeuwen.
- **Groen is gereserveerd** voor git/PR/toestemming (`#1F883D`). Nooit als decoratie.
- **Amber is gereserveerd** voor hold/wacht-op-jou. Rood alleen voor diff-deletes en destructive.
- Neutraal is warm, nooit koudgrijs. Dark mode is basalt-warm, geen zuiver zwart.

## 4. Typografie

Drie stemmen, elk één taak:

- **Instrument Serif** (400 + italic) is de display-stem van het blad: hero,
  sectie-titels en pagina-headers van de site. Nooit onder 18px, nooit voor
  UI-labels; italic voor maximaal één accent-regel per pagina.
- **General Sans** 400/500/600 voor alle interface- en body-tekst. Koppen in
  product-UI **500** met tracking −0.02em.
- **IBM Plex Mono** uitsluitend voor data: timers, diffs, branch-namen,
  commands, paden, coördinaten.
- Timers en tellers altijd `font-variant-numeric: tabular-nums`.
- Nooit Inter/Geist/Space Grotesk/Sora. Space Grotesk is beproefd (2026-08-05)
  en afgewezen: te minimalistisch, te .com-bubbel. Nooit mono voor prose of
  labels; nooit serif in product-UI.

## 5. Iconen

- **Lucide SVG, nergens emoji.** 24-viewBox, stroke 1.75, ronde caps/joins.
- Maten: `.ic` 15px, `.ic.sm` 12px, `.ic.lg` 17px.
- Emoji in copy eveneens verboden. Toetsenbord-hints als `<kbd>`, niet als symbool.

## 6. Componenten (shadcn-conventies)

Baseline is shadcn/ui-denken: simpele variants, hairline borders, rustige hovers.

| Component | Contract |
|---|---|---|
| `.btn` | h-32px, px-13px, r-6px, border hairline-strong. `.primary` = text↔bg omgekeerd. `:active` scale 0.97, `:focus-visible` outline 2px accent |
| `.gbtn` | 28px ghost icon-button, hover = `--hover` wash. `:focus-visible` outline 2px accent. `.solid` voor send-acties |
| `.badge` | pill, 12px, `.green` voor Open/merged, `.outline` voor meta |
| card | r-12px, border `--line`, hover → `--line-strong`. Geen shadow in product |
| composer | r-12px, focus = accent border + 3px `--accent-soft` ring |
| user-pill | `--surface-sunk`, r-12px, avatar rechts |
| agent prose | kaal, geen achtergrond, 14.5px/1.6 |
| `.sgroup` | grouped-card: border, `--r-lg` (12px), `0 16px`, hairlines tussen rows |
| `.switch` | 36×20px, full-radius (200px). `[aria-checked=true]` = accent fill. `:focus-visible` outline 2px accent |
| `.nav-item` | h-28px, px `0 10px 0 6`, r-6px, 13px/500. `:focus-visible` outline 2px accent |
| `.input, .select` | h-28px, px-10px, 13px, r-6px. Focus = accent border + 3px accent-soft ring. `:focus-visible` implicit via `:focus` |
| `.tbl` | wide layout. border 1px `--line`, r-lg. th 11.5px/500 caps, td 13px. zebra `nth-child(even)` bg `--bg`. hover → `--hover`. `td.mono` font-family var(--mono) tabular-nums. inline `.badge` (green/amber/red) voor status |

## 6.3 Dashboard compositie

Dashboard views componeren uit bestaande primitives (Sidebar + Card + Table + Chart),
nooit hand-gerolled. Shadcn conventie: gebruik variants en semantic colors, nooit raw waarden.

## 7. De activiteitsindicator (signatuur)

**Geen spinners.** Activiteit toont als:

1. **Worked-row**: `Aan het werk 2m 14s` -- live timer in tabular mono, links een 2px streep.
   Streep is `--line-strong` in rust, `--accent` tijdens run. Uitklapbaar: elke stap met tijdstip.
2. **Tool-ripples**: per tool-call een 18px golfje dat eenmaal heen-en-weer schaal­t (1.1s).
   Blauw = lezen, groen = schrijven, amber = extern. Geen infinite loops: ripple stopt zodra de call klaar is.
3. **Hold-marker**: bij approval stopt de timer (niet resetten), approval-card verschijnt inline, toetsen 1/2/3.
4. **Klaar**: rij wordt `Gewerkt 4m 13s +25 −131` -- statisch, diff in groen/rood.

Motion-fysica: zie `motion-spec.md` (spring 180/26, ease-out cubic-bezier(0.22,1,0.36,1),
140/280/420ms). Alles settle-t vroeg; niets bounct; niets ambients.

## 8. Layout

**3-pane** (devin-model):

```
┌──────────┬─────────────────────┬──────────────┐
│ sidebar  │ sessie (transcript) │ artifact     │
│ 232px    │ flex, max-col 720px │ 400px, toggle│
└──────────┴─────────────────────┴──────────────┘
```

- Sidebar: workspace-switcher, nav (Sessies/Ask/Wiki/Review), Recent met PR-badges, onderaan Thema + Instellingen.
- Transcript: max 720px kolom, gecentreerd. Composer plakt onderaan, zelfde kolombreedte.
- Artifact: rapport/diff/browser. Toggle via panel-icoon in topbar. <1100px: verborgen. <760px: sidebar weg.
- **Elke pagina is een blad:** de Y-meetlat draagt klikbare sectie-registers (`data-reg`), de actieve sectie licht op (40%-lijn), frac-chips per sectie worden gemeten via JS, nooit hardcoded. Blad-plaat rechtsonder (SHEET-id · REV D). Mobiel: meetlat en plaat weg, modeline blijft.
- **Secties zijn doorsneden:** op de home hangt elke sectie aan een doorsnede-regel (sectie-index uit de REGSECS-volgorde, JS-gevuld, nooit handmatig; hairline; gemeten frac) die een verticale maatlijn op de wrap-rand kruist; die maatlijn loopt van sec-inhoud tot in de footer door, over sectie-grenzen heen. Een hairline zonder metriek is decoratie; een hairline met index en frac is maatvoering.

## 9. Stem (copy)

- Warm, direct, menselijk Nederlands op gebruikersvlakken.
- "Wacht op jou: test draaien op productie-domein" -- niet "Approval required for external execution".
- **Verboden**: em-dashes, buzzwords, verzonnen metrics, emoji, "AI"-gebezigheid in labels.
- Statuslijn: "Klaar voor instructies". Eén sparkle-icoon, geen animatie.

## 10. Bans (hard)

- Geen spinners/loaders (ripple-systeem vervangt ze)
- Geen emoji als icoon of in copy
- Geen em-dashes
- Geen paarse gradients, glassmorphism, glow, bento-kaartjes
- Geen cards-in-cards, geen geneste elevation
- Geen infinite ambient motion
- Geen marketing-witruimte in product (density 5–7)

## 11. Bestanden

| Bestand | Wat |
|---|---|
| `tokens.css` | alle custom properties + btn/gbtn/badge primitives |
| `motion-spec.md` | fysica, timing, ripple-contract |
| `prototype-v2.html` | levende referentie-implementatie (deze taal, speelbaar) |
| `prototype-v1-stroom.html` | gearchiveerd: v1 teal/Stroom-richting |
| `surfaces/*.md` | per-surface briefs (session, composer, palette, settings, approvals, states) |
| `references/` | Devin-screenshots + eigen states, als meetlat |
| `taste/` | het zelflerende taste-systeem dat dit document voedt |

## 12. Status

**v3 actief** -- de taal heet **Signaal**. prototype-v2.html blijft de levende
referentie voor product-feel; §15-§17 zijn de v3-lagen (motion-canon, wow-tier,
brain-koppeling). Naamvraag uit v2 is gesloten.

---

## §11 Typografie (v2.1, web-typography skill)

Schaal via tokens, nooit losse px-waarden in componenten:

| Token | px | Gebruik |
|---|---|---|
| `--text-2xs` | 10.5 | meta, counts, badge |
| `--text-xs` | 11.5 | labels, kbd, captions |
| `--text-sm` | 12.5 | beschrijvingen, secondair |
| `--text-md` | 13.5 | **UI-standaard** |
| `--text-lg` | 15 | prose, kleine titels |
| `--text-xl` | 18 | sectie-headers |
| `--text-2xl` | 24 | pagina-titels |

Regels:
- Rendering: `antialiased` + `optimizeLegibility` op html (staat in tokens.css)
- Headings: `--leading-head` 1.2, tracking `−0.02em`, `text-wrap: balance`
- Prose: `.prose` = 15px / 1.62 / max 65ch (measure-cap)
- Data (timer, diff, counts): `.num` = tabular-nums
- Sectie-labels: `.caps` = 10.5px / 600 / +0.07em / faint
- `text-wrap: pretty` op paragrafen
- Display (site/blad): `--font-display` = Instrument Serif, gewicht 400,
  tracking −0.015em, alleen voor hero + sectie-titels + pagina-headers

## §12 Iconen (v2.1, icon-system skill)

- Grid 24×24, stroke 2, round caps/joins -- Lucide-conventie, sprite `components/icons.svg`
- Maten: `.ic` (15, standaard) · `.ic-13` (compact) · `.ic-18` (knoppen) · `.ic-24` (hero)
- Elke svg die een sprite-symbol gebruikt MOET `fill:none;stroke:currentColor` hebben (via `.ic` of expliciet) -- symbols erven niets van de sprite-root
- Icon-tiles in navigatie: 28px tile / 14px icon; pagina-headers 44px / 20px
- Nieuwe symbols: Lucide-path kopiëren, id `i-<naam>`, toevoegen vóór `</svg>`

## §13 Categorieën (v2.1)

Elke component-catalogus hoort bij één categorie (`cat` in catalog.json):

| Categorie | Componenten |
|---|---|
| primitieven | button, badge |
| gesprek | composer, transcript, worked-row, approval |
| bewijs | pr-card, artifact |
| structuur | nav, settings |

Rail en gallery groeperen op categorie. Nieuwe categorie: toevoegen aan `CATS` in `ds`.

---

## §14 Stijl-laag (v2.2)

Het systeem draagt meerdere **complete skins** via `data-style` op `<html>`.
Dit is geen accent-wissel maar een volledige tweede stijl over dezelfde taal.

| Skin | Karakter | Tokens |
|---|---|---|
| `devin` (default) | warm, zacht, r8/12, #317CFF | warm off-white, hairlines |
| `strak` | koel, scherp, r4/6, #2563EB | koel grijs-blauw, sterkere lines |

Regels:
- Nieuwe skins zijn complete token-overrides in `tokens.css`, light én dark
- De taal (§1-§10) blijft gelden onder elke skin: geen spinners, één accent,
  zelfde typografie-schaal, zelfde icon-grid
- Wisselen: seg in de rail (persist via localStorage) of `?style=strak`
- Variant-frames erven de skin via propagatie in de shell
- Een derde skin ontwerpen = taste-beslissing; eerst loggen, dan bouwen

---

## §15 Motion-canon (v3)

Vervangt losse waardes; `motion-spec.md` volgt deze canon. Twee tiers:

### Product-tier (dagelijkse UI)

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);      /* enter/exit, house-waarde */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen verplaatsing, morphs */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* sheets/drawers */
--dur-press: 140ms; --dur-pop: 200ms; --dur-panel: 280ms; --dur-sheet: 420ms;
```

- **De poort geldt altijd**: 100+/dag of keyboard-gestart → geen animatie
  (command palette opent instant). Tientallen/dag → vrijwel onzichtbaar.
  Af en toe (modal, toast, drawer) → standaard. Zeldzaam → §16.
- Springs alleen bij gebaren met momentum: `stiffness 180 / damping 26`,
  bounce 0 (critically damped) als default. Nooit bounce op iets dat net
  verschijnt.
- Enter vanaf `scale(0.95-0.97)` + `opacity: 0`, nooit `scale(0)`. Popovers
  groeien vanuit hun trigger (`transform-origin`), modals zijn exempt.
- Exit langs hetzelfde pad als enter. Transform/opacity only (clip-path als
  derde; height alleen voor accordions). Nooit `transition: all`, nooit
  `ease-in` op UI.
- Stagger 30-80ms, max ~6 items, nooit blokkerend. Toggles/toasts via CSS
  **transitions** (retargetbaar), niet keyframes.
- `prefers-reduced-motion`: zachter, niet nul -- opacity/kleur blijft,
  beweging/parallax/overshoot vervalt. Hover-effects gaten met
  `@media (hover: hover) and (pointer: fine)`.

### Verboden blijft verboden

Geen spinners (ripple-systeem), geen infinite ambient motion in product,
geen keyframes op hoogfrequente elementen, geen animatie op data die de
gebruiker leest.

## §16 Wow-tier (v3) -- het delight-budget

Zeldzame, eerste-indruk oppervlakken (auth-landing, app-library, onboarding,
lege staten, succes) mogen groots -- **alleen daar**. Dit is de enige plek
voor:

- **Dot-matrix signatuur**: sv-matrix loaders (`~/.agents/skills/sv-matrix`)
  als merk-motief -- een 5×5 dot-bloom als identiteits-moment (hero, login-
  succes). Zelfde motief als de CLI-statusline: één taal van terminal tot web.
- **Split-text reveal** op de hero (word-level, 60-100ms/regel, translateY
  110%→0, ease-out), Instrument Serif.
- **Line-drawing SVG** voor het merk/logo (stroke-dashoffset, 1.2-1.5s,
  ease-in-out), eenmalig bij binnenkomst.
- **Scramble/decode** voor maximaal één stat- of statuslabel.
- **Spotlight/glow-cards** (radial-gradient volgt pointer, opacity 0.06-0.08)
  voor de app-library tiles -- de enige gesanctioneerde "glow" in het systeem.
- **View Transitions** tussen auth-stappen (login → library): morph, geen
  harde swap. `@view-transition { navigation: auto; }` op MPA-flows.
- Scroll-driven reveals (`animation-timeline: view()`) op landing-secties,
  eenmalig, met `@supports`-gate.
- Budget: één hero-motion per beat; ondersteunende motion korter en subtieler.
  Ook hier: reduced-motion variant verplicht, geen paarse gradients, geen
  glassmorphism -- wow komt uit precisie en motief, niet uit effectstapeling.

## §17 Brain- en taste-koppeling (v3)

Signaal is een lerend systeem; de lus is expliciet:

1. **taste/** blijft het lokale taste-log (beslissing + reden + datum).
2. Elke geaccepteerde taste-beslissing gaat als learning naar **Joep Brain**
   (bc-scan-arm, `brain_query`-plane) via de continual-learning lus -- geen
   tweede geheugen naast Brain.
3. Agents die UI bouwen laden dit bestand als SSOT (rule `signaal-ssot.mdc`);
   het primaire model auteurt visueel werk, workers implementeren specs.
4. Drift-detectie hoort bij self-evolve: een surface dat tokens forkt is een
   mesh-drift-fix, geen designkeuze.
5. Design-evolutie (nieuwe skin, motief, kleurshift) = taste-log eerst, dan
   Brain-ingest, dan pas tokens.
