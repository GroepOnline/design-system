# Surface Brief — Session Workbench

> Binds to `DESIGN.md`. Register: product. Mode: Operate.  
> This is the home surface — 90% of product time happens here.

---

## 1. Purpose & read

The workbench answers the three core questions (what is my agent doing / what does it need / where did it leave off) without the user reading a paragraph. Scanability first, prose second.

Composition: rail + work zone + context rail, Current anchored at the rail/work boundary.

## 2. Anatomy

```
┌────────────────────────────────────────────────────────────────┐
│ RAIL 248px          ║ WORK ZONE (8col)          │ CONTEXT 4col │
│ ┌────────────────┐  ║ ┌─────┬─────────────────┐ │ ┌──────────┐ │
│ │ ⌘K search      │  ║ │ tab │ tab │ tab │  +  │ │ │ files    │ │
│ ├────────────────┤  ║ ├─────┴─────────────────┤ │ │ browser  │ │
│ │ WORKSPACES     │  ║ │                         │ │ │ terminal │ │
│ │ ▸ OpenWork Chat│  ║ │      transcript         │ │ │ (tabs)   │ │
│ │   📌 pinned    │  ║ │                         │ │ ├──────────┤ │
│ │   ● session A  │  ║ │                         │ │ │ session  │ │
│ │   ○ session B  │  ║ ├─────────────────────────┤ │ │ info     │ │
│ │   TO DO (3)    │  ║ │      composer           │ │ │ tools    │ │
│ │   ARCHIVED     │  ║ └─────────────────────────┘ │ └──────────┘ │
│ ├────────────────┤  ║                             │              │
│ │ account · sync │  ║                             │              │
│ └────────────────┘  ║                             │              │
│ 1 provider · 2 MCP  ║ ← the Current (2px)                       │
└────────────────────────────────────────────────────────────────┘
```

## 3. Rail (left)

### Structure
- Top: `⌘K` search affordance (full-width, `surface-sunk`, `r-control`, mono placeholder `Zoek of start…` — this is the ONE allowed pill-adjacent search affordance, here as a rect with `r-control`).
- Middle: workspace tree. Two-lane rows (glyph 20px / label flex).
- Bottom: account block (name, sync state) + status line (providers · MCPs · mode) in mono 12px `text-faint`.

### Session rows
| Element | Spec |
|---|---|
| Status glyph | 16px, semantic icon: `●` active (accent), `○` idle (line-strong), `◐` needs-you (warning), `✓` done (success), `⏸` archived (text-faint) |
| Title | 14px interface, `text`, truncate, no wrapping |
| Meta | 12px mono, `text-faint`: relative time |
| Hover | `surface-sunk` fill, `d-hover` |
| Active row | `accent-soft` wash + 2px `accent` leading bar (NOT the Current — a row marker) |
| Needs-you row | `warning` glyph + title in `text`, row breathes once on appearance (single 1.02 scale settle) then still |

### Groups
- Group headers: 11px uppercase, letter-spacing 0.08em, `text-faint`, `TO DO` / `PINNED` / `ARCHIVED`.
- Collapse chevron on hover only. State persists per workspace.

### Rail interactions
- Collapse to 64px icon rail via `⌘B` or drag handle. `d-pane`.
- Drag session onto group = move (drop target highlights `accent-soft`).
- Right-click = context menu (rename, pin, archive, delete). Every action also in ⌘K.

## 4. Work zone

### Tab strip
- Height 36px, `surface`, hairline below.
- Tabs: `r-control` top corners only, title + dirty-dot (draft exists), close `×` on hover.
- Active tab: `surface` on `canvas` seam, no border-circus.
- Overflow: horizontal scroll with edge fades, never wrap.
- `⌘1..9` jumps to tab. Drag to split right.

### Transcript
- Measure: 72ch max, centered in work zone with min 48px gutters.
- Message spacing: 24px between turns, 12px within a turn.
- **User messages**: `surface-sunk` block, `r-surface`, 14px.
- **Agent messages**: no background — prose on `surface`, 15px reading size, markdown with `line` hairline code blocks (mono 13px, `surface-sunk` background).
- **Tool calls**: collapsed one-liner by default:
  `[icon] Lees src/auth.ts · 240ms` — icon per family, verb + object, duration mono `text-faint`. Expand inline (height animation `d-state`, content reveal `d-state`).
- **Diffs**: mono 13px, `+` gutter `success`, `−` gutter `danger`, no full-line backgrounds, max 3 context lines, "Toon meer" expands.
- **Thinking/reasoning**: collapsed `text-faint` italic block, one line: `Redeneerde 12s over authenticatie-aanpak`, expandable.
- **Attachments in messages**: chip with real file-type icon, name, size mono. Click opens in context rail.

### Composer (see `surface-composer.md`)

## 5. Context rail (right, 4 col)

- Tabbed: Files / Browser / Terminal / Info. Only one open at a time.
- Closed by default on <1440px, open on ≥1440px, remembers per workspace.
- Panel slides `d-pane` (motion 5). Hairline `line` divider.
- **Files**: workspace tree, `◆` changed-by-agent badge on modified files (accent), click opens read-only preview. No editing here — editing is agent work.
- **Info**: session model, token usage (mono), MCP connections with live status dots, workspace path with copy button.
- Context rail never shows while `holding` state is unresolved — the approval gets the screen.

## 6. States

| State | Behavior |
|---|---|
| Loading workspace | Rail skeleton (3 group blocks), work zone: composer live immediately (drafts are local), transcript skeleton 3 blocks, single shimmer |
| Empty workspace | Transcript: `Nog geen sessies.` + primary action `[Start je eerste taak]` (accent, `r-control`). No illustration |
| Session empty | Composer pre-focused, placeholder: `Beschrijf de taak…` |
| Engine down | Banner top of work zone: `danger` icon + `Engine reageert niet.` + `[Herstart]` — transcript remains readable, composer disabled with reason |
| Sync conflict | Inline block at top of transcript: `warning` + `Sessie is op een ander apparaat gewijzigd.` + `[Laad nieuwe versie] [Behoud lokale]` |
| Archived session | Transcript read-only, composer replaced by `Gearchiveerd · [Herstel]` bar |
| Offline | Last-known transcript visible, composer accepts input (queues), status bar: `Offline · wijzigingen wachten` in mono `warning` |

## 7. Keyboard map (surface-owned)

| Keys | Action |
|---|---|
| `⌘K` | Command palette |
| `⌘B` | Toggle rail |
| `⌘J` | Toggle context rail |
| `⌘1..9` | Jump to tab |
| `⌘⇧T` | Reopen closed session tab |
| `Enter` in composer | Send (steer when streaming) |
| `⌘Enter` | Queue message |
| `Esc` | Close topmost layer; stop run only from focused stop control |
| `1/2/3` on approval | Allow / once / deny |

## 8. Acceptance criteria

- [ ] Agent state readable in ≤2s via Current + row glyph alone (no text read needed).
- [ ] Tab switch < 50ms perceived (preloaded panes).
- [ ] Approval actionable in ≤2 keystrokes from anywhere in the app.
- [ ] No card-in-card anywhere on this surface.
- [ ] All states above verified in light + dark + reduced-motion + forced-colors.
- [ ] Rail collapse/expand preserves scroll and selection.
