# Devin App DNA — live gemeten (2026-07-28 + hermeting 2026-08-04, dark mode, viewport 1607×976)

Bron: CDP via Brave (Chrome/151). 4 schermen + settings (zie `devin-settings-dna.md`
voor complete dark/light metingen). screenshots: `devin-app-home.png`,
`devin-app-session.png`, `devin-app-usage.png`.

Hermeting 2026-08-04 (app.devin.ai, dark, viewport 1607×976): gearchiveerd in
`.commandcode/devin-home.json`, screenshot `devin-home.png` (hernieuwd).

## 1. Home (sessie-overzicht)

- Card (sessie): bg `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.04)`,
  radius **20px**, 688×122, font **16px** (titel)
- Nav links: icon + text, hover highlight
- Bottom: input (composer area), Send button h30 r6

## 2. Sessie (chat view)

**Composer:**
- Input area: bg transparent, border 0 solid white4%, radius **4px**, h **20px**,
  font **14px**, padding 0
- Send button: bg transparent, border 0 solid white4%, radius **6px**, h **30px**,
  font **13px**, padding `6px 9px`
- Geen vaste textarea — contenteditable input (klein, minimalistisch)

## 3. Home (org navigation)

- Org links in sidebar: icon + text
- "Connect integration", "Set up automations", "Create playbook" —
  ghost-styled links (transparent bg, white5% border, r6)
- "Explore advanced capabilities" — accent link

## 4. Usage & Limits (screenshot opgeslagen)

Layout: statistieken in cards, progress bars, lijsten.
Volledige meting via `devin-app-usage.png`.

## Nieuwe deltas vs ons systeem (vs settings-dna)

| Element | Devin app | Ons systeem | Delta | Aanbeveling |
|---|---|---|---|---|
| Card radius | 20px | r8/r12 | Devin is groter (r20) | Ons r12 voor cards; r20 als optie |
| Composer hoogte | 20px input | — | Super-klein input | Ons `.input` 32px — goed voor een tool |
| Send button | h30 r6 transparent | ons `.btn`? | Devin ghost-style btn | Ons `.gbtn` matcht (ghost) |
| Nav links | icon + text | ons rail | Devin kleiner, compact | Ons rail 248px + 17px icon ✓ |
| Nav breedte (2026-08-04) | 280px | ons rail 248px | Devin 32px breder | Railbreedte blijft beslisbaar; 280px als optie |
| Main kolom (2026-08-04) | 1306px bij viewport 1607px | — | Hoofdinhoud krijgt rest van breedte | — |
| Avatar-knop JJoep (2026-08-04) | h35 r6, 105×35 | — | Avatar + naam in één knop | — |
| Composer/input (2026-08-04) | Geen vaste textarea; input 0×0 gemeten (contenteditable) | ons `.input` 32px | Bevestigt compacte composer | Ons 32px `.input` blijft (tool-context) |

## Kernwaarden (Devin) vs ons

| Aspect | Devin | Ons |
|---|---|---|
| Font UI | Inter | General Sans (bewust) |
| Font Mono | — | JetBrains Mono |
| Base size | 13-16px | 13px row / 16px header |
| Radius card | 20px | 12px (gelockt) |
| Radius control | 6px | 6px (match!) |
| Toggle | 36×20, #317CFF | 36×20, #317CFF (exact!) |
| Composer | 20px input | 32px `.input` (ruimer) |
| Dark bg page | #141414 | — (wij zijn light-first) |
| Light bg page | #FCFCFC | #F7F6F5 (warm, bewust) |
| Accent | #317CFF (light) / #4489FF (dark) | **#317CFF** (exact) |

## Conclusie

Onze basiswaarden zijn **nauwkeurig** — de accentkleur en toggle match
letterlijk. Devin is wat **radicaler** in radius (r20) en input compactness
(h20 composer). Onze keuze om ruimer te blijven (r12, 32px input) is een
bewuste menselijke-interface besluit: Devin's compactheid werkt voor een
power-user die 8h/dag voor het scherm zit; onze systemen moeten ook
toegankelijk zijn.

Geen propageren nodig — onze afwijkingen zijn filosofisch, niet
technisch incorrect.
