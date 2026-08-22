# Surface-brief: auth-landing + app-library (auth.chefgroep.online)

> v3-spec, 2026-08-22. Wow-tier surface (§16): zeldzaam bezocht, eerste indruk,
> mag groots. Auteur: primair model. Implementatie: worker volgens deze spec —
> geen eigen visuele keuzes buiten de hier gegeven waardes.

## Doel

Het inlogmoment en de app-library zijn de voordeur van ChefGroep. Nu: default
Authentik-template (generic). Straks: onmiskenbaar Signaal — stil, warm, mat,
met één gecontroleerd wow-moment. Geen Devin-look, geen SaaS-template-look.

## Opbouw login (flow-pagina)

```
┌──────────────────────────────────────────────┐
│  maatlijn links (hairline + frac, §8)        │
│                                              │
│   [dot-matrix bloom 5×5]  ← merk-moment      │
│   ChefGroep                ← Instrument Serif │
│   "Meld je aan."           ← split-text reveal│
│                                              │
│   [auth-card: Authentik flow, restyled]      │
│                                              │
│   modeline onderaan: SHEET-id · REV · status │
└──────────────────────────────────────────────┘
```

- **Achtergrond**: warm off-white `rgb(247,246,245)` licht / basalt-warm donker.
  Geen gradient, geen foto, geen mesh-blob.
- **Merk-moment**: één 5×5 dot-matrix die bij load een **ripple-bloom** doet
  (sv-matrix `dmx-center-origin-ripple`-orde, 900ms, ease-out, eenmalig — dan
  statisch raster op `--line-strong`). Dots 4px, gap 6px, accentblauw tijdens
  de bloom, daarna neutraal. Reduced-motion: statisch raster, geen bloom.
- **Hero-tekst**: Instrument Serif 400, 32-40px, split-text reveal per woord
  (translateY 110%→0, 80ms stagger, 700ms, ease-out). Eén italic accent-regel
  max. Copy: warm NL — "Meld je aan." / subregel "Eén account voor alle
  ChefGroep-oppervlakken."
- **Auth-card**: Signaal-card (r-12, hairline `--line`, geen shadow, geen
  glass). Inputs volgens §6 (h-28/13px/r-6, focus = accent border + 3px
  accent-soft ring). Knop `.btn.primary`. Enter vanaf scale 0.97 + opacity 0,
  200ms ease-out, 80ms ná de hero (stagger, niet blokkerend).
- **Fout-staat**: shake verboden op deze frequentie? Nee — login-fout is
  laagfrequent: één subtiele 2×4px x-shake (240ms) + amber hold-tekst in
  copy-stem ("Dat wachtwoord klopt niet. Probeer opnieuw.").
- **Succes → library**: View Transition (morph, 300ms). De dot-matrix doet
  één snelle **snake-sweep** (400ms) als bevestiging. Geen confetti.

## App-library (/if/user/#/library)

- **Grid**: app-tiles als Signaal-cards, r-12, hairline, hover → border
  `--line-strong` + **spotlight** (radial-gradient volgt pointer, wit 0.07,
  300px, opacity-transition 300ms). Geen lift-shadow, geen scale-hover.
- **Tile-inhoud**: app-icoon in 28px tile (Lucide-stijl of app-eigen SVG,
  géén emoji), naam 13.5px/500, groep-label `.caps` (10.5/600/+0.07em).
- **Entrance**: eenmalige stagger 50ms/tile (max 6 gestaggerd, rest direct),
  translateY 8px + opacity, 300ms ease-out. Bij her-bezoek in dezelfde
  sessie: geen entrance (sessionStorage-flag).
- **Sectie-koppen**: doorsnede-regels met index + frac (§8-maatvoering) —
  dit is wat het géén generic portal maakt.
- **Leeg/geen apps**: delight-budget — dot-matrix drift-loop (traag, 2s
  interval, subtiel) + copy "Nog geen apps voor jouw rol. Vraag Joep."

## Implementatie-route

1. Authentik branding: custom CSS + flow-background via de Authentik
   branding-instellingen; assets versioned in ChefFactory (deploy/authentik/
   of chefgroep-infra — volg de inventory-worker output voor het juiste pad).
   Blueprint-gedreven (zoals #225), nooit click-ops zonder export.
2. Custom CSS injectie voor /if/flow/ én /if/user/#/library (Authentik
   ondersteunt custom.css tenant-breed). De SPA-library restyled via CSS-
   variabelen + attribuutselectors; geen fork van de Authentik frontend.
3. Fonts: General Sans + Instrument Serif als woff2, subset latin,
   `font-display: swap`, totaal < 200KB, preload op de flow-pagina.
4. Alle waardes uit dit document; tokens uit `design-system/tokens.css`
   spiegelen in de custom.css (kopie met bronverwijzing, geen import van
   buitenaf — auth mag geen externe origins laden).
5. Smoke: Lightpanda-screenshot vóór/na; NB: Lightpanda kan de library-SPA
   niet snapshotten (bekende beperking) — flow-pagina wel; library via
   Playwright/Chromium op de fleet of handmatige check door Joep.

## Verboden op deze surface

Paarse gradients, glassmorphism, mesh-blobs, foto-achtergronden, confetti,
infinite ambient motion (behalve de lege-staat drift), spinners, emoji,
em-dashes, Engels waar NL hoort.
