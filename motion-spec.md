# Motion Spec — Stroom Physics & The Five Allowed Motions

> Binds to `DESIGN.md`. Motion is identity here — treat values as tokens, not suggestions.  
> Token names are normative (`d-*`, curve names, ripple timings).

---

## 1. De Stroom — full physics spec

### Geometry

- Width: `2px` hairline, full height of work zone, anchored at `x = rail-width` (248px expanded, 64px collapsed).
- Z-layer: `current 5` — above canvas, below panels.
- Render: SVG path, own render loop via `requestAnimationFrame`, isolated from React tree. Never triggers transcript re-render.

### State machine

```
idle ──▸ flowing ──▸ holding ──▸ settling ──▸ idle
 │         │           │            │
 │         │           └── waiting on user (approval, question)
 │         └── tokens streaming
 └── engine quiet ≥ 400ms
```

### States in detail

| State | Visual | Physics | Sound (never) |
|---|---|---|---|
| `idle` | Hairline, 40% opacity, static | None | — |
| `flowing` | Line travels downward, continuous | Velocity maps to token throughput: `v = clamp(tokensPerSec / 60, 0.3, 2.0)` px/frame. Ease in over 300ms, ease out 600ms | — |
| `holding` | Flow stops at point of need; line breathes | Breath: amplitude 1.5px lateral, period 2400ms, sine. Never faster — breathing is calm, not urgent | — |
| `settling` | Flow decays to still | Velocity decays with critically-damped spring: `stiffness 180, damping 26` — settles in ~600ms with zero overshoot | — |
| `ripple` | A wavelet travels the line | See §2 | — |

### The Current's spring

Only place in the product where spring physics is allowed:
- `stiffness: 180`
- `damping: 26` (critically damped — no visible bounce, fast settle)
- `mass: 1`
- Used for: settle-to-rest, marker snap-to-position.
- Used never for: buttons, panels, dialogs, hovers.

### Markers

Tool calls place markers on the Current at the transcript-relative Y position:
- Marker: 6px circle, `accent` fill for write-tools, `line-strong` for read-tools, `warning` for external.
- Marker appears with `d-state` fade + 4px travel from the line outward.
- Clicking a marker: transcript scrolls to that tool call (`d-pane`, ripple-scroll easing), marker emits one confirmation ripple.
- Markers persist for the session; hovering shows tool name + duration in a `r-control` tooltip (mono, 12px).

---

## 2. Ripple timing per tool family

A ripple is one wavelet traveling down the Current. One ripple per event — never stacked.

| Event | Ripple color | Travel time | Amplitude |
|---|---|---|---|
| Read tool (file read, search) | `line-strong` | 400ms | 2px |
| Write tool (edit, create) | `accent` | 500ms | 3px |
| External call (network, MCP) | `warning` | 600ms | 3px |
| Run complete | `accent` | 800ms full length | 4px, single pass |
| Error | `danger` | 300ms, sharp decay | 4px, settles hard |

Ripple shape: asymmetric gaussian — fast attack (20% of travel), long decay (80%). Like a stone dropped upstream, not a pulse.

Concurrent tools: ripples merge if within 150ms — one ripple, combined amplitude (max 5px), color of the highest-severity family.

---

## 3. The five allowed motions — exact specs

### Motion 1: The Current
Covered above. Always permitted. Never competes with other motion.

### Motion 2: Intent reveals
- Trigger: user action result or new content entering the viewport.
- `opacity 0 → 1`, `translateY(12px) → 0`, `d-state` (220ms), outward curve `cubic-bezier(0.22, 1, 0.36, 1)`.
- Space reserved before the element moves (no layout shift).
- Stagger: max 3 items, 40ms apart. Never more — a wall of staggered items is theater.

### Motion 3: Ripple scroll (transcript catch-up)
- Transcript follows the stream with a soft chase: scroll position eases toward bottom at `cubic-bezier(0.22, 1, 0.36, 1)` per animation frame.
- If the user scrolls up ≥ 80px: catch-up disengages silently. A `r-full` pill-free "Naar beneden" affordance appears at `d-state`, bottom-right of transcript, `line` border, no fill until hover.
- Clicking it: one smooth `d-pane` (320ms) scroll to bottom. Never instant.

### Motion 4: Press physics
- Buttons/controls: `scale(0.985)` on `:active`, `d-press` (90ms), release back over 120ms.
- Applies to: buttons, chips, tabs, palette rows, sidebar rows.
- Never applies to: inputs, text, the Current, panels, dialogs.

### Motion 5: Pane slide
- Side panels (files, browser, settings drawer): `translateX(100%) → 0`, `d-pane` (320ms), outward curve.
- Exit: 220ms inward curve `cubic-bezier(0.4, 0, 1, 1)` — 70% of enter duration.
- Behind-panel content: no parallax, no dimming beyond `scrim` (canvas at 60% opacity, fades in `d-state`).

---

## 4. Chrome fade (interface disappears mid-flow)

- Trigger: agent run active AND no user input for 3000ms.
- Rail, status bar, context rail fade to 92% opacity over 800ms (`d-flow` + 200).
- Transcript + Current hold 100%.
- Any mouse move, keystroke, or focus event restores 100% in `d-hover` (140ms).
- This is opacity only. No layout change, no pointer-events change.

---

## 5. Micro-interactions (bounded list)

Allowed, all on `d-hover`:
- Sidebar row hover: `surface-sunk` fill fade-in.
- Link hover: `accent-ink` color shift, no underline animation.
- Copy button: icon swap (copy → check) with `d-state` fade, check holds 1200ms, fades back.
- Model picker open: `d-state` scale from 98% → 100% + fade.
- Approval block appear: `d-state` reveal + Current enters `holding` simultaneously (the two motions are one event).

Banned micro-interactions: everything not listed here. If a designer wants a sixth class, DESIGN.md changes first.

---

## 6. Reduced motion (non-negotiable)

`prefers-reduced-motion: reduce`:
- Current: static line, states shown by color + markers only (idle = faint, flowing = accent solid, holding = warning solid with pause glyph).
- All reveals: instant.
- Ripple scroll: instant jumps.
- Chrome fade: disabled.
- Press physics: disabled.
- Zero information loss — every state readable without motion.

---

## 7. Performance budget

- All animations: `transform` + `opacity` only. No `width/height/top/left` animation, ever.
- The Current render loop: ≤ 0.5ms/frame on a 2019 laptop. If exceeded, drop to 30fps silently before dropping frames visibly.
- Intent reveals: GPU-composited, `will-change` applied at trigger and removed at settle.
- No animation may delay input handling. Keystrokes preempt everything.
