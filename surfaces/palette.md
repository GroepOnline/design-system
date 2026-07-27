# Surface Brief — Command Palette

> Binds to `DESIGN.md`. The palette is the product's spine — every action reachable, always instant.

---

## 1. Contract

- Open: `⌘K` anywhere. Close: `Esc` or click scrim.
- First paint with results ≤ 50ms (index preloaded at app boot, warmed on every state change).
- Every action in the product exists here. If it's not in the palette, it doesn't exist.

## 2. Anatomy

```
┌───────────────────────────────────────────────────┐
│ ⌕  zoek of typ een opdracht…               [mono] │
├───────────────────────────────────────────────────┤
│ ◉  Ga naar sessie "Using OpenWork Browser…"       │
│ ○  Ga naar sessie "Losse files sorteren"          │
│ ── Acties ────────────────────────────────────    │
│ ⚡ Nieuwe taak                              ⌘N   │
│ ⚡ Wissel model                          Sessie   │
│ ⚡ Open instellingen                     ⌘,      │
│ ── Recent ────────────────────────────────────    │
│ ↺  hernoem sessie "audit"                         │
└───────────────────────────────────────────────────┘
```

- Width: 560px, centered, top 18% viewport height.
- `r-overlay`, `e3`, `elevated`, 1px `line` border. Scrim: canvas 60%.
- Input: mono 15px, no border, `⌕` glyph prefix `text-faint`.

## 3. Result model

Rows are typed. Glyph column (20px) + title + right-aligned hint.

| Type | Glyph | Content | Hint |
|---|---|---|---|
| Session | status dot | `Ga naar sessie "<title>"` | workspace name |
| Action | `⚡` | verb phrase | shortcut or scope |
| Setting | `⚙` | setting name | current value |
| File | file icon | path from `@` mode | modified badge |
| Recent | `↺` | last 8 executed actions | — |

- Section headers: 11px uppercase `text-faint`, only when >1 type present.
- Max 9 visible rows, `react-virtual` scroll beyond, active row `accent-soft`.

## 4. Modes

| Prefix | Mode | Source |
|---|---|---|
| (none) | Mixed: sessions + actions + settings | All indexes |
| `>` | Actions only | Action registry (mirrors UI control actions — same IDs) |
| `@` | Files | Workspace file index |
| `#` | Sessions across all workspaces | Session store |
| `?` | Help: shows matching docs + keyboard map | Static index |

Mode switch on first character, live, `d-hover` crossfade of result list.

## 5. Behavior rules

- Fuzzy match on title + subtitle; match chars bolded `text`, rest `text-muted`.
- `Enter` executes. `⌘Enter` executes without closing (palette stays for chaining).
- `Tab` on an action with required args: input converts to argument form with placeholder hints (`sessie openen → sessionId: ___`).
- Destructive actions (delete session) show inline confirm: row expands to `Zeker? [Enter = ja] [Esc = nee]` — no second dialog.
- Palette never blocks the Current — it opens *above* the work zone, Current stays visible at left edge.
- Keyboard-only flows: full transcript navigation possible from palette (`lees transcript`, `scroll naar boven`).

## 6. Index freshness

- Sessions index: rebuilt on session store change (subscribe).
- Actions index: rebuilt on control-surface action registry change — **the palette and the MCP `ui_list_actions` share one source of truth**. (Rebuild rule: one registry, two consumers.)
- Files index: debounced 1s on workspace file events.
- Stale index is a defect: if a result 404s on execute, show inline `Niet meer beschikbaar` and rebuild that index section.

## 7. Acceptance criteria

- [ ] Cold open → first results in ≤50ms.
- [ ] Any action executable in ≤3 keystrokes from anywhere.
- [ ] Action IDs identical to MCP control surface (one registry).
- [ ] Destructive confirms never leave the palette.
- [ ] Works fully with reduced motion (instant open, no slide).
