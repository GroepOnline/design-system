# Surface Brief — Composer

> Binds to `DESIGN.md` + `surface-session.md`.  
> The composer is the product's handshake — it must feel instant, honest, and physically present.

---

## 1. Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ [attachment chip] [attachment chip]                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Beschrijf de taak…                                  │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ [+]  [skill ⌄]  [model: big-pickle ⌄]      [ mic ]  [↑] │
└─────────────────────────────────────────────────────────┘
   ↑ Current endpoint anchors at left edge
```

## 2. States

| State | Visual | Behavior |
|---|---|---|
| `rest` | `surface-sunk`, `r-surface`, 1px `line` border | Placeholder `text-faint` |
| `focused` | rises to `elevated`, border `line-strong`, `e1` shadow | `d-state` transition; Current endpoint brightens |
| `has-draft` | as focused | Send arrow activates (`accent`) |
| `streaming` (agent running) | composer stays live | Enter = steer; stop control replaces send; inline hint shown once ever: `Enter stuurt bij · ⌘Enter plant in` |
| `queued` | Draft preserved, queue chip appears above: `1 bericht gepland` | Click chip to edit/cancel queue |
| `disabled` (engine down) | `surface-sunk` at 60% opacity, reason inline | Input blocked, draft preserved |
| `voice-active` | Left edge shows live level meter (3 bars, `accent`) | Esc exits voice |

## 3. Input behavior (non-negotiable)

- Keystroke → glyph on screen in the same frame. Zero async between keydown and render.
- Draft autosaves to engine every 500ms debounce AND on blur, pagehide, tab switch. Draft belongs to (workspace, session) pair. Crash → draft restored exactly, cursor position included.
- Paste of >500 chars of code: collapses to an attachment chip `code-plaksel.txt · 4.2kb` with inline expand — keeps composer geometry calm.
- Drag files anywhere over composer: drop zone = full composer, `accent-soft` wash + dashed `accent` border, no overlay modal.
- `@` opens mention menu (files, sessions, skills) — filtered as you type, mono icons, `d-hover` row highlight, `↑↓` + `Enter`.
- `/` at position 0 opens slash commands: `model`, `skill`, `clear`, `undo`, `export`. Same menu component as `@`.

## 4. Send mechanics

| Input | Idle | Streaming |
|---|---|---|
| `Enter` | Send now | **Steer**: message injects mid-run, appears in transcript with `↪` glyph |
| `⌘Enter` | Send now | **Queue**: sends when current run completes |
| `⇧Enter` | Newline | Newline |

- Steered messages render in transcript with a `↪ gestuurd tijdens run` marker, `text-faint` 12px.
- Queued messages show in the queue chip; run completion auto-sends with a single Current ripple.
- Send button: arrow `↑`, `accent` fill when armed, `line-strong` when empty. Press physics (scale 0.985).

## 5. Model & skill pickers

- Model chip: `model: <name> ⌄`, mono 12px. Opens popover (`r-overlay`, `e2`): provider groups, search-first, current checkmarked, health dot per provider (live from provider store).
- Model switch mid-session: banner in transcript `Model gewisseld naar <name>` `text-faint` — the session never restarts.
- Skill chip appears when a skill is armed: `[skill: pr-review ×]` — `×` disarms. Skill guidance renders inline above composer (collapsible, `surface-sunk`, max 96px height, scroll).

## 6. Attachments

- Chips: `r-control`, `surface`, `line` border, real file-type icon (not generic paperclip), name truncated at 24ch, size mono `text-faint`, `×` remove on hover.
- Images: 32px thumbnail in chip.
- Office docs: extracted-text indicator `✓ tekst gelezen` in `text-faint`.
- Over limit: chip turns `danger` border with reason tooltip.

## 7. Voice (bridging to voice mode)

- Mic button right of send. Hold-to-talk (press-and-hold) or click-to-toggle (setting).
- Active: composer placeholder becomes live transcript, words appear as spoken, `text-muted` until committed.
- Voice commit = same send mechanics. Steer works by voice.

## 8. Error & edge cases

| Case | Behavior |
|---|---|
| Send fails (network) | Message stays in composer, inline `Versturen mislukt · [Opnieuw]` `danger` text — never loses the draft |
| Model unavailable | Send disabled, chip shows `warning`: `Model niet bereikbaar · [wissel]` |
| Token limit near | Subtle mono counter appears: `~4.2k over` `text-faint` → `warning` when <500 |
| Empty send | Nothing. No shake, no error. The arrow is simply inactive |
| Restore after crash | Draft + cursor + attachments restored; Current resumes last known state |

## 9. Acceptance criteria

- [ ] 60fps typing on 2019 hardware with 10k-char draft.
- [ ] Draft survives kill -9 of the renderer.
- [ ] Steer deliverable mid-run in ≤1 roundtrip, visible in ≤300ms.
- [ ] All pickers keyboard-complete without mouse.
- [ ] No layout shift when attachments added (chips reserve row height from first keystroke).
