# DESIGN.md — v2

> De design language. Standalone systeem, niet gekoppeld aan één product.
> v1 was "Stroom" (teal, eigen signatuurlijn). v2 richt zich volledig op de
> Devin-producttaal, gemeten aan hun live site, met eigen motion-discipline
> en Nederlandse copy-stem. Beslissing: 2026-07-27 (taste-log).

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
| badge-blauw | `#2200FF` (NEW-pill) | niet — te hard |
| marketing-cards | radius 16px | product: 12px (`--r-lg`) |
| knoppen (marketing) | radius 0px | product: 8px (`--r-md`) |
| headings | weight 500, tracking −4% | weight 500, tracking −2% (product) |
| font | NB International Pro | General Sans (gratis equivalent) |

## 3. Kleur

Zie `tokens.css`. Regels:

- **Eén accent**: blauw `#317CFF` (licht) / `#5C97FF` (donker). Niets anders mag schreeuwen.
- **Groen is gereserveerd** voor git/PR/toestemming (`#1F883D`). Nooit als decoratie.
- **Amber is gereserveerd** voor hold/wacht-op-jou. Rood alleen voor diff-deletes en destructive.
- Neutraal is warm, nooit koudgrijs. Dark mode is basalt-warm, geen zuiver zwart.

## 4. Typografie

- **General Sans** 400/500/600 voor alles. Koppen **500** met tracking −0.02em.
- **JetBrains Mono** uitsluitend voor data: timers, diffs, branch-namen, commands, paden.
- Timers en tellers altijd `font-variant-numeric: tabular-nums`.
- Nooit Inter/Geist/Space Grotesk. Nooit mono voor prose of labels.

## 5. Iconen

- **Lucide SVG, nergens emoji.** 24-viewBox, stroke 1.75, ronde caps/joins.
- Maten: `.ic` 15px, `.ic.sm` 12px, `.ic.lg` 17px.
- Emoji in copy eveneens verboden. Toetsenbord-hints als `<kbd>`, niet als symbool.

## 6. Componenten (shadcn-conventies)

Baseline is shadcn/ui-denken: simpele variants, hairline borders, rustige hovers.

| Component | Contract |
|---|---|
| `.btn` | h-32px, px-13px, r-8px, border hairline-strong. `.primary` = text↔bg omgekeerd. `:active` scale 0.97 |
| `.gbtn` | 28px ghost icon-button, hover = `--hover` wash. `.solid` voor send-acties |
| `.badge` | pill, 12px, `.green` voor Open/merged, `.outline` voor meta |
| card | r-12px, border `--line`, hover → `--line-strong`. Geen shadow in product |
| composer | r-12px, focus = accent border + 3px `--accent-soft` ring |
| user-pill | `--surface-sunk`, r-12px, avatar rechts |
| agent prose | kaal, geen achtergrond, 14.5px/1.6 |

## 7. De activiteitsindicator (signatuur)

**Geen spinners.** Activiteit toont als:

1. **Worked-row**: `Aan het werk 2m 14s` — live timer in tabular mono, links een 2px streep.
   Streep is `--line-strong` in rust, `--accent` tijdens run. Uitklapbaar: elke stap met tijdstip.
2. **Tool-ripples**: per tool-call een 18px golfje dat eenmaal heen-en-weer schaal­t (1.1s).
   Blauw = lezen, groen = schrijven, amber = extern. Geen infinite loops: ripple stopt zodra de call klaar is.
3. **Hold-marker**: bij approval stopt de timer (niet resetten), approval-card verschijnt inline, toetsen 1/2/3.
4. **Klaar**: rij wordt `Gewerkt 4m 13s +25 −131` — statisch, diff in groen/rood.

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

## 9. Stem (copy)

- Warm, direct, menselijk Nederlands op gebruikersvlakken.
- "Wacht op jou: test draaien op productie-domein" — niet "Approval required for external execution".
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

**v2 actief** — prototype-v2.html is de bron van waarheid voor feel.
Open: naam voor de taal (werktitel "Devin-richting" is geen naam, is een richting).
