# Surface Brief — Home Shell (agent-home)

> Bindt aan `DESIGN.md` v3 + skin `grok` in `tokens.css`.
> Kalibratie: grok.com hoofdscherm (gemeten 2026-08-31, zie taste-log).
> Component: `components/home-shell`. Referentie-rendering: `data-style="grok"` + `data-theme="dark"`.

---

## 1. Anatomie

```
┌──────────────┬──────────────────────────────────────────┐
│ brand   «    │                          ● Bot  ⌄ Private │
│ Search       │                                          │
│ New Chat ▮   │              logo + wordmark             │
│ Imagine      │                                          │
│ Library      │   ┌──────────────────────────────────┐   │
│ Automations  │   │ +  What do you want to know?     │   │
│ Skills & Co  │   │        Expert ⌄  mic  ( ◯ wave ) │   │
│ Projects ⌄   │   └──────────────────────────────────┘   │
│  + Add       │   ┌─ Meet-card ──────────────────────┐   │
│ History ⌄    │   │ (bot) titel + 1 regel copy       │   │
│  platte rijen│   └──────────────────────────────────┘   │
│  1 regel …   │                                          │
│ ○ account    │                                          │
└──────────────┴──────────────────────────────────────────┘
 sidebar 310px (clamp 260-320) · main gecentreerd, kolom max 720px
```

## 2. Wetten van dit scherm

1. **De composer is de held.** Eén pil (r16, `surface-sunk`, geen zware border)
   midden in beeld. Alles eromheen is stil.
2. **Nul decoratie op het canvas.** Geen gradients, glow, patronen of
   achtergrond-art. Scheiding sidebar/main is één hairline (`--line`).
3. **Monochroom hiërarchie.** Het luidste element is de voice-cirkel
   (`--text` op `--bg`, omgekeerd). Geen tweede luide actie erbij.
4. **History is plat.** Tekstrij, 1 regel, CSS-ellipsis. Nooit iconen,
   timestamps, badges of metadata in die lijst.
5. **Chrome rechtsboven is muted.** Chips (`surface`, `line`, pill) voor
   bot-status en privacy; status-dot mag `open-green` (live-signaal).

## 3. Zones en maten

| Zone | Contract |
|---|---|
| sidebar | `clamp(260px, 20vw, 320px)`, padding 10-12px, geen zichtbare scrollbar |
| brand-rij | mark + wordmark links, collapse `«` rechts |
| nav-rij | h36, icoon 16 + label `--text-md`/500, actief = `accent-soft` pill (r-md), `aria-current` |
| sectiekop | `--text-xs`/500 `text-faint`, chevron roteert, native `details` (toetsenbord gratis) |
| history-rij | `--text-sm`, `text-muted`, hover wash, ellipsis |
| account | onderaan (`margin-top auto`), avatar 30px, naam + e-mail (`text-faint`) |
| composer | `min(720px, 100%)`, r-lg, `surface-sunk`; focus-within = `line-strong` + 3px `accent-soft` ring |
| voice-cirkel | 36px, `background: --text`, `color: --bg`; hover opacity .87, active scale .94 |
| meet-card | zelfde breedte als composer, `surface`, r-lg, bot-avatar 38px, titel + 1 regel |

## 4. Gedrag

- Sidebar klapt in via `«` (desktop: weg, expand-knop verschijnt linksboven)
  en is off-canvas onder 860px (hamburger opent, slide 280ms `ease-out`).
- Secties (Projects/History) zijn `details/summary`: inklapbaar, toetsenbord-
  bereikbaar, chevron roteert 200ms.
- Composer-input: Enter stuurt (afnemende app), autogrow is een afnemer-keuze;
  de shell levert alleen de geometrie.
- `prefers-reduced-motion`: alle transitions uit.

## 5. Skin-afhankelijkheid

De shell kent geen eigen kleuren; alles loopt via tokens. Onder `grok` dark
(codex dracula-herijking, taste-log 2026-08-31) is het canvas `#282A37` en de
voice-cirkel accent-roze `#FF79C6`. Onder `devin`/`strak` verschuift de
hiërarchie mee (daar is het accent blauw). De skin kiest de sfeer; de shell
kiest de structuur.

## 6. Acceptatie

- [ ] Geen horizontale scroll op 1440×900 en 1024×768; mobiel 390px off-canvas.
- [ ] Squint-test: alleen de voice-cirkel springt eruit.
- [ ] History truncateert met ellipsis bij elke sidebar-breedte.
- [ ] Volledig toetsenbord-bedienbaar (nav, secties, composer, chips).
- [ ] Rendert correct onder alle drie de skins, light én dark.
