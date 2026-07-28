# Devin Settings DNA — live gemeten (2026-07-28)

Bron: `app.devin.ai/settings/preferences` via CDP op Brave (Chrome/151), beide thema's.
Screenshots: `devin-settings-dark.png`, `devin-settings-light.png`, `devin-theme-dropdown.png`.

## Structuur

- Sidebar: secties met plain muted groeplabel ("Personal", "Organization"), geen uppercase
- Nav-item: 13px/500, h28, r6, padding `0 10px 0 6`, icoon 16px links
- Main: sectie = header (14px/500) + **één bordered card met ALLE rows van die sectie**,
  hairlines tussen rows. Card: padding `0 16px`, rows full-bleed binnen de card
- Row: label (13px/400) + desc (13px, muted) links, control rechts
- Controls: select h28 r6; ghost-button h28 r6 13px/500; toggle 36×20 full-radius
- Theme-opties: Light / Dark / **System** (default). Taal: aparte dropdown
- Loader: blauwe arc-spinner bij pagina-load (wij doen dat bewust NIET)

## Tokens dark (gemeten)

| Token | Waarde |
|---|---|
| bg-page | `#141414` (20 20 20) |
| bg-wash | `#191919` (25 25 25) |
| bg-elevated (card, select) | `#1F1F1F` (31 31 31) |
| card border | `rgba(255,255,255,0.04)` |
| ghost border | `rgba(255,255,255,0.08)` |
| ghost bg | `rgba(255,255,255,0.05)` |
| text primary | `rgba(255,255,255,0.90)` |
| text secondary | `rgba(255,255,255,0.52)` |
| accent bg (toggle ON) | `#4489FF` (68 137 255) |
| accent text | `#49B0FF` (73 176 255) |
| toggle OFF | `rgba(255,255,255,0.05)` |
| red / green / orange | `245 59 58` / `0 236 126` / `245 142 58` |

## Tokens light (gemeten)

| Token | Waarde |
|---|---|
| bg-page | `#FCFCFC` |
| card | `#FFFFFF`, border `rgba(0,0,0,0.08)`, r10 |
| text primary | `#191919` |
| text secondary | `rgba(25,25,25,0.56)` |
| **toggle ON** | **`#317CFF`** — exact ons accent |
| ghost button | wit, border `rgba(0,0,0,0.10)` |
| select (light) | blauwe border-tint |

## Typografie

- UI-font: **Inter** (wij: General Sans — bewuste afwijking)
- base 16px · controls 13px · section-header 14px/500 · pagina-titel ~20px/600

## Delta met ons systeem

1. **Grouped-card patroon** — Devin zet alle rows van een sectie in één card met
   hairlines; ons `settings`-component heeft losse `.setting`-rows. Kandidaat voor
   propagatie naar `components/settings/self/`.
2. **Ons accent `#317CFF` = Devin light toggle exact** — geen actie.
3. **Ons light bg `#F7F6F5` (warm) vs hun `#FCFCFC` (neutraal)** — bewuste warmte-afwijking, blijft.
4. **Radii**: wij r8/12, zij r6 controls / r10 cards — vergelijkbaar, geen actie.
5. **Toggle 36×20** — onze `.switch` is exact 36×20. Match, geen actie.
6. **Select hoogte**: zij 28px r6, wij 32px — bewuste keuze mogelijk; 28px is strakker.
   Overwegen bij volgende propagatie.
