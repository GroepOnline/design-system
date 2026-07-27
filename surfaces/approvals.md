# Surface Brief — Approvals & Permissions

> Binds to `DESIGN.md`. The approval is the product's trust moment — it must be fast, explicit, and never interruptive theater.

---

## 1. Placement

Approvals live **inline in the transcript flow** at the exact point of need. Never a modal. Never a toast. Never top-of-screen banner detached from context.

The Current enters `holding` state at the approval's Y position — the user sees where the flow paused before reading anything.

## 2. Anatomy

```
│                                                              
│  ┌──────────────────────────────────────────────────────┐  
│  │ ✋ OpenWork wil schrijven naar  src/auth.ts            │  
│  │                                                       │  
│  │  ┌─ diff preview (collapsed) ───────────────────┐    │  
│  │  │ + 12 regels, − 3 regels · toon               │    │  
│  │  └──────────────────────────────────────────────┘    │  
│  │                                                       │  
│  │  [1] Sta toe voor sessie  [2] Eén keer  [3] Weiger   │  
│  └──────────────────────────────────────────────────────┘  
│                                                              
```

- Block: `r-surface`, 1px `line-strong` border, `surface`, max 72ch.
- Header: actor + verb + exact object, 14px. No icons-only. No vague phrasing (`beveiligingsvraag` is banned).
- Detail: collapsed preview by default (diff, command, URL), expands inline.
- Actions: three buttons with number-key hints, keyboard-first.

## 3. Action semantics

| Key | Label | Scope | Persistence |
|---|---|---|---|
| `1` | Sta toe voor sessie | This capability, this session | Session store |
| `2` | Eén keer | This exact call only | None |
| `3` | Weiger | Deny, agent gets explicit error | None (repeated deny of same kind offers `Altijd weigeren`) |

- "Sta toe voor sessie" is scoped to **capability + object class**: writing to `src/` ≠ writing to `~/.ssh`. Scope is stated in the button tooltip and in the permission ledger.
- `Enter` = `1` (default, focused). `Esc` = `3`.

## 4. Auto mode vs manual mode

- **Auto** (default for trusted workspaces): approvals resolve instantly; every auto-decision still renders as a settled `text-faint` line in transcript: `✓ auto: schreef src/auth.ts (240ms)` — the audit trail is always visible.
- **Manual**: every matching capability prompts. Timeout 30s → auto-deny, agent informed, Current settles with `danger` ripple.
- Mode toggle: session header + settings. Switching mid-session takes effect on the next tool call.

## 5. Permission ledger

Per session, `i` on the approval block (or Info rail) shows the running ledger:

```
Toegestaan deze sessie
  ✓ schrijven in src/ · 14:02
  ✓ netwerk: api.github.com · 14:05
Geweigerd
  ✗ uitvoeren: rm -rf · 14:11 (jij)
```

Mono, compact, exportable (`Kopieer`). This is the trust artifact.

## 6. Batched approvals

Agent proposes 5 file writes in one plan: one approval block listing all 5 (paths mono, collapsible), actions apply to the batch. Per-item toggles inside the block for mixed consent. Never 5 stacked blocks.

## 7. Voice parity

In voice mode: approval read aloud in one sentence (`Mag ik schrijven naar src/auth.ts?`), answer by voice (`ja / een keer / nee`) or keys. Same ledger, same semantics.

## 8. Edge cases

| Case | Behavior |
|---|---|
| Approval while scrolled up | `holding` marker on Current + bottom-right chip `Wacht op jou ↓` scrolls to it |
| Session closed with pending approval | Auto-deny on close, agent notified, ledger records `verlopen` |
| Duplicate request within 1s | Deduped — one block |
| Destructive (delete, force-push) | Always manual, typed confirmation: typ `verwijder` — even in auto mode. Non-negotiable |

## 9. Acceptance criteria

- [ ] Approval → decision in ≤2 keystrokes, ≤300ms to resolution.
- [ ] Every decision (manual or auto) visible in transcript + ledger.
- [ ] Destructive actions can never be auto-approved.
- [ ] No modal, toast, or focus-stealing anywhere in this surface.
