# Surface Brief — States & Onboarding

> Binds to `DESIGN.md`. Covers loading, empty, error, offline, and first-run — the surfaces where products usually leak quality.

---

## 1. Loading

- Skeletons in **exact content geometry** (session rows, transcript blocks, settings rows). Static matte `surface-sunk` shapes.
- One shimmer pass on appearance (`d-flow`, left→right, 8% opacity gradient), then completely still. No looping pulse, ever.
- If load > 3s: skeleton caption appears: `Laden duurt langer dan normaal…` `text-faint` + `[Diagnostics]` link.
- Perceived-instant rule: cache-first render for any previously-seen surface; skeletons only for never-seen content.

## 2. Empty states (full inventory)

| Surface | Copy (NL) | Action |
|---|---|---|
| No workspaces | `Nog geen werkruimtes.` | `[Maak je eerste werkruimte]` |
| No sessions | `Nog geen sessies.` | `[Start je eerste taak]` |
| Empty session | (composer focused, placeholder does the work) | — |
| No providers | `Geen model verbonden. Zonder model kan de agent niet denken.` | `[Verbind een provider]` |
| No MCP servers | `Geen MCP-servers. De agent werkt met alleen basisgereedschap.` | `[Blader in marketplace]` |
| No search results | `Niets gevonden voor "<query>".` | `[Wis zoekopdracht]` |
| Empty archive | `Geen gearchiveerde sessies.` | — |
| No files changed | `De agent heeft nog geen bestanden aangeraakt.` | — |

Rules: one honest line + max one action. No illustrations, mascots, or marketing. `text-muted` 14px, centered in its zone at 40% height.

## 3. Errors

Inline, in place, cause + impact + one repair action. Never full-screen for recoverable faults.

| Error | Copy | Repair |
|---|---|---|
| Engine down | `Engine reageert niet.` | `[Herstart engine]` |
| Model unavailable | `Model <name> is niet bereikbaar.` | `[Wissel model]` |
| Provider auth expired | `<Provider> vraagt opnieuw om toestemming.` | `[Verbind opnieuw]` |
| Workspace missing | `Map niet gevonden: <path>` | `[Kies opnieuw] [Verwijder uit lijst]` |
| Sync conflict | `Gewijzigd op een ander apparaat.` | `[Laad nieuwe] [Behoud lokale]` |
| Rate limited | `Te veel verzoeken bij <provider>. Wacht ~30s.` | auto-retry with mono countdown |

Fatal errors (boot failure): dedicated screen, same typography, one `[Herstart]` + `Diagnostiek kopiëren` mono button. No branding theater.

## 4. Offline

- Status bar: `Offline · wijzigingen wachten` mono `warning`.
- Everything readable; composer accepts input (queued with chip); sync resumes silently on reconnect with one Current ripple.
- Never block the transcript offline. Local-first is the contract.

## 5. Onboarding (first run)

Three screens, keyboard-completable, skippable at any point (`Sla over` always visible bottom-right, `text-faint`).

**Screen 1 — Welkom**
- Wordmark, one line: `Een werkplek voor jou en je agent.`
- `[Begin]` — no feature carousel, no video.

**Screen 2 — Werkruimte**
- `Kies een map om in te werken.` Native picker + `Maak nieuwe map` option.
- This creates the first workspace; Current shows a single welcoming ripple on success (the product's first hello).

**Screen 3 — Model**
- Provider list with one-click OAuth (OpenRouter recommended row first, honestly labeled `Aanbevolen · wij krijgen niets`).
- `Sla over` leads to local/own-key path — no dark pattern.
- Done → lands in empty session, composer focused.

Post-onboarding: one contextual hint per surface, shown once, dismissible forever, stored server-side (not localStorage — audit rule).

## 6. First-week surfaces

- **Day 1**: hint chips on first visit per surface (`⌘K opent alles`, once).
- **First completed run**: quiet celebration = Current full-length ripple + `✓ Je eerste taak is klaar.` in transcript. No confetti, no modal, no sound.
- **First approval**: inline explainer above the block (once): `Jij bepaalt wat de agent mag. Dit komt alleen bij nieuwe soorten acties.`

## 7. Acceptance criteria

- [ ] No global loading spinner exists as an activity metaphor; bounded local busy-states sit on the initiating control.
- [ ] Every empty state: honest copy + ≤1 action, verified in both languages.
- [ ] Every error offers a repair path or an honest dead-end (`Dit kunnen we niet herstellen. [Kopieer diagnostiek]`).
- [ ] Onboarding → first task started in ≤3 minutes measured.
- [ ] Every hint dismissible forever, server-persisted.
