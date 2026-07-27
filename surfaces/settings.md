# Surface Brief — Settings

> Binds to `DESIGN.md`. Mode: Operate. Settings is where trust is built — every option honest, every state visible.

---

## 1. Structure

Settings replaces the work zone (same shell: rail + Current stay). Two-column inside work zone:

```
┌────────────┬─────────────────────────────────────┐
│ sections   │  active section                      │
│ ─────────  │  ┌─────────────────────────────┐    │
│ Algemeen   │  │ setting row                 │    │
│ Modellen   │  │ setting row                 │    │
│ MCP        │  │ ┌─ inline panel ─────────┐  │    │
│ Extensies  │  │ │ detail / editor        │  │    │
│ Mappen     │  │ └────────────────────────┘  │    │
│ Account    │  │ setting row                 │    │
│ Ontwikkelaar│ └─────────────────────────────┘    │
└────────────┴─────────────────────────────────────┘
```

- Sections list: 240px, rows 36px, active `accent-soft` + accent bar.
- Content: max 640px measure. No full-width forms.
- `⌘,` opens settings at last-used section. Deep links: `/settings/models`, `/settings/mcp/linear`.

## 2. Setting row anatomy

| Part | Spec |
|---|---|
| Label | 14px `text`, one line |
| Description | 13px `text-muted`, max 2 lines, concrete consequence not marketing |
| Control | right-aligned: toggle, select, input, or action button |
| State | live value always visible — never hidden behind "edit" |

Example: `Sandbox-uitvoering` / `Draait agent-code in een Docker-container. Vereist Docker daemon.` / `● Aan (docker)`

## 3. Key sections & their rules

### Modellen (providers)
- Provider rows: name, health dot (live), model count, `Ververs` per row (independent refresh, spinner on that row only).
- Add provider: inline panel (not modal) with OAuth/device flow, progress inline.
- Failed auth: row shows `danger` + exact reason (`Token verlopen · 12:31`) + `[Opnieuw verbinden]`.

### MCP
- Server rows: name, transport (stdio/SSE), tool count, status dot.
- **Hidden/internal servers visible under "Toon interne"** (replaces OpenWork's hidden-by-default). Internal = read-only rows, labeled `Intern`.
- OAuth flow: inline panel, never leaves settings. Errors inline with the server row.

### Extensies (skills/marketplace)
- Installed: name, version, source, capabilities used (files/network shown as chips — **capability transparency is a trust feature**).
- Marketplace browse: search-first, rows with author + capability chips + one-click install with inline progress.
- Post-install: `✓ geïnstalleerd` in place, no toast.

### Mappen (authorized folders)
- Path rows with mono path, scope chips (`lees`, `schrijf`), remove with inline confirm.
- Add: native picker via button, path appears immediately with default `lees`.

### Account & sync
- Identity block, org selector, sync state with last-synced absolute time mono.
- Sign out: named, separates "lokale data behouden" checkbox.

### Ontwikkelaar (developer)
- Visible only when developer mode on (status bar shows `Developer`).
- Engine diagnostics (PID, uptime mono), config inspector (read-only mono JSON), `[Herstart engine]`, update channel select, export diagnostics button.
- No playful styling — developer section follows the same contract exactly.

## 4. Change behavior

- Toggles apply immediately, inline `✓` settles 800ms next to control, then fades.
- Invalid input: `danger` border + reason under the row. Never blocks other settings.
- Restart-required changes: badge `Herstart nodig` on the row + one `[Herstart nu]` button at section bottom. Never a forced dialog.
- Reset-to-default per section: `danger`-zone at bottom, hairline-separated, typed confirmation for destructive (`typ RESET`).

## 5. States

| State | Behavior |
|---|---|
| Loading section | Skeleton rows in exact geometry |
| Offline | Settings editable (local), sync-dependent rows show `Offline` chip |
| Partial failure | Failing row shows error; section stays usable |
| Search | `⌘F` filters rows across all sections, jumps to match |

## 6. Acceptance criteria

- [ ] Every setting shows its live value without clicking.
- [ ] Every error states cause + repair in the same row.
- [ ] No modal used anywhere in settings.
- [ ] MCP OAuth completable without leaving the surface.
- [ ] All sections keyboard navigable; `⌘F` finds any setting in ≤2s.
