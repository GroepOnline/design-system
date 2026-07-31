# PLAN.md -- wat dit repo wordt en hoe we daar komen

> Geschreven 2026-07-28, na de live Devin-meting. Dit is het kompas:
> elke sessie pakt hier een blok uit, geen losse avonturen.

---

## 1. De visie -- wat is dit repo

**Dit wordt dé UI-basislaag voor alles wat Joep en zijn agents bouwen.**

Niet een component-library zoals er duizend zijn, maar een **lerend, gelockt,
zelf-meten systeem**:

```
┌─────────────────────────────────────────────────────────────┐
│  BRON (gemeten, niet verzonnen)                               │
│  Devin-DNA live uit hun product halen via CDP, exacte        │
│  waarden archiveren in references/ -- geen moodboards,        │
│  geen "lijkt wel op". Meten > gokken.                        │
├─────────────────────────────────────────────────────────────┤
│  SYSTEEM (gelockt, reactief)                                  │
│  tokens.css + catalog.json = enige bron. ds CLI herbouwt     │
│  web automatisch. Wat vast staat verandert nooit stilletjes. │
│  Skins via styles.json -- één data-attribuut wisselt de       │
│  hele feel.                                                   │
├─────────────────────────────────────────────────────────────┤
│  GEBRUIK (3 ingangen)                                         │
│  • agents:  new-project.sh + ds CLI + AGENTS.md              │
│  • mens:    web (gallery/docs/studio) via tailscale          │
│  • niet-designers: studio -- schuiven, presets, ds style add  │
├─────────────────────────────────────────────────────────────┤
│  LEREN (taste-loop)                                           │
│  Elke Joep-reactie → taste-log → 2+ signalen → regel →       │
│  propagatie (verplicht, zelfde commit). Het systeem wordt    │
│  slimmer na elke build.                                       │
└─────────────────────────────────────────────────────────────┘
```

**Succescriterium:** geen nieuwe UI begint ooit meer vanaf nul of vanaf
generieke AI-slop. Elke build start vanuit de catalogus, in een skin, met
geleerde regels actief.

**Grenzen (wat het NIET is):**
- geen npm-package, geen import -- kopieermodel (shadcn)
- geen keuken/receipt/bento/glassmorphism -- DESIGN.md bans gelden
- geen spinners, geen emoji-iconen, geen em-dashes
- geen zweverige "design explorations" zonder meting of taste-log

## 2. Huidige staat (2026-07-28)

| Laag | Status |
|---|---|
| tokens.css v2.1 | ✅ light+dark, 2 skins (devin, strak) |
| Catalogus | ✅ 11 componenten, lock-model, self/external |
| ds CLI | ✅ list/select/add/remove/build/check/style list+add |
| Web | ✅ gallery + per-component pagina's + docs + taste-site |
| Studio v3 | ✅ presets → export → `ds style add` |
| CI | ✅ validate.yml (build + check) |
| Devin-DNA | ✅ settings beide thema's live gemeten + gearchiveerd |
| Home page | ✅ theatrale landing met parallax + live stats (build_home()) |
| Settings-component | ✅ grouped-card patroon toegevoegd (A.1) |
| Perfection pass | ❌ gepland, niet uitgevoerd |

## 3. Routekaart

### Fase A -- Devin-DNA propagatie ✅ (2026-07-30)

1. **Grouped-card patroon** → `components/settings/self/`: sectie = header
   (14px/500) + één card (r10, border, `0 16px`) met hairlines tussen rows.
   Beide thema's, beide skins getest. ✅
2. **Select 32px → 28px** -- Devin-meting: 28px. Onze `.input, .select` waren
   al 28px in tokens.css. Geen wijziging nodig. Taste-log: bewuste keuze voor
   28px (strakker, shadcn-compatibel). ✅
3. **Ghost-button** -- Devin ghost-button: h28 r6. Onze `.gbtn` matcht exact
   (h28, `border-radius: var(--r-md)` = 6px devin skin). ✅
4. **Nav-item** -- Devin: 13px/500, h28, r6, padding `0 10px 0 6`. Onze
   `.nav-item` in `components/nav/self/default.html` matcht exact. ✅

### Fase B -- Uitgebreide Devin-meting (NU, parallel via agent)

Meer schermen via de live Brave-sessie (`agent-browser --session devin-live`):
- hoofdapp (sessie-lijst, chat, composer)
- Review / DeepWiki / Usage & Limits
- per scherm: tokens (al bekend), component-metingen, 1 screenshot
- output: `references/devin-app-dna.md` + screenshots in `references/`

### Fase C -- Home page ✅ (2026-07-31)

Theatrale, interactieve landing -- Fable5/Kimi3-niveau, rode-vlinders-vibe
(depth/parallax, iets dat uit het scherm komt). Eisen:
- eigen `build_home()` in ds CLI, stats uit manifesten (live, nooit handmatig)
- Devin-taal, geen gradient-theater -- de "vet" zit in beweging + typografie
- interactief: reageert op muis, niet alleen scroll
- NL copy, direct, geen marketing-buzzwords

Uitgevoerd: `build_home()` met parallax hero (3 lagen), live stats (11/20/2),
componenten-grid per categorie, skins-preview, processtappen, intent reveals,
responsive (680px), reduced-motion. `ds check` clean. ✅

### Fase D -- Perfection pass

- elke pagina nalopen op verhoudingen/alignment (icoon-maten, rij-hoogtes)
- `ds check` warnings gewerkkt (em-dash purge, source URLs) ✅
- restant: alignment pass op prototype, beide skins × thema's doorlopen

### Fase E -- Groei (doorlopend)

- nieuwe componenten alleen via: prototype → Joep voelt → `ds add`
- skins alleen via: studio → export → `ds style add`
- taste-loop draait continu; propagatie is verplicht, nooit losse regels

## 4. Werkverdeling deze sessie

| Werk | Wie | Waarom |
|---|---|---|
| PLAN.md + coördinatie | primary (dirigent) | architectuur |
| Fase B meting (mechanisch) | subagent, snel model | meten ≠ ontwerpen |
| Fase A propagatie (visueel) | primary | UI-design gaat nooit naar fast model |
| Review + commit + push | primary | verificatieplicht |
