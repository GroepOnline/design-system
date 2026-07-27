---
name: joep-design-taste
description: Self-learning taste memory for design decisions. Load FIRST on any UI/design task in this workspace. Records Joep's approvals, rejections, and adjustments; distills recurring patterns into binding taste rules that sharpen DESIGN.md over time. Use on every design task, every design review, and after every piece of Joep feedback on visual work.
---

# Joep Design Taste — self-learning taste memory

Design systems are static. Taste is learned. This skill closes the loop: every design decision that
Joep reacts to becomes data, and recurring reactions become **rules** that bind future work.

## Authority order (load in this order)

1. `.ulpi/design/DESIGN.md` — the locked identity (what is true now)
2. `skills/joep-design-taste/taste-rules.md` — learned rules (what Joep has taught us)
3. `skills/joep-design-taste/taste-log.md` — the raw record (why the rules exist)

Rules in `taste-rules.md` are binding for new work unless they conflict with DESIGN.md — then
DESIGN.md wins and the rule is flagged for promotion/conflict review.

## The loop (do this every time)

### 1. Before design work
Read `taste-rules.md`. Apply every rule that matches the surface you're designing.

### 2. When Joep reacts to design
Any feedback — "lekker", "te druk", "waarom is dit blauw", "meer Devin", silence + manual edit —
is a **taste event**. Append it to `taste-log.md` immediately, in this format:

```markdown
## YYYY-MM-DD · <surface>
- **shown**: <what was shown/created>
- **reaction**: <approved | adjusted | rejected>
- **signal**: "<what Joep said or did, verbatim if possible>"
- **delta**: <what changed because of it, if anything>
- **candidate rule**: <if this looks like a pattern, state it as a rule hypothesis>
```

### 3. Distill (every ~10 log entries, or when the same hypothesis appears 2+ times)
Move confirmed patterns from the log into `taste-rules.md` under the right category. A rule needs
**two independent observations** before promotion. State rules as do/don't pairs with the evidence
linked by date.

### 4. Promote to DESIGN.md
When a rule is universal (applies to every surface, not one), propose editing DESIGN.md itself.
Never edit DESIGN.md silently — propose, Joep confirms, then it locks.

## Rule categories

- **color** — palette reactions, accent usage, warmth
- **type** — font, scale, measure reactions
- **motion** — speed, amplitude, what felt smooth vs nervous
- **density** — too much / too little on screen
- **voice** — copy tone reactions (NL directness, banned phrasing)
- **structure** — layout patterns Joep consistently likes or kills
- **metaphor** — which mental models land (Stroom, sandblasted, instrument) and which die

## Anti-rules

- Never record a rule from one reaction. Taste ≠ whim.
- Never let the log grow without distilling — raw data without rules is hoarding.
- Never override a locked DESIGN.md value via a taste rule without explicit promotion.
- Joep's explicit instruction in the moment beats every learned rule, always.
