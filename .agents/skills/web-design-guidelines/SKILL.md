---
name: web-design-guidelines
description: Audits real UI code and rendered behavior against current Web Interface Guidelines plus ChefGroep design contracts. Use when reviewing accessibility, UX, responsive behavior, motion or visual quality.
owner: chefgroep
domain: frontend-ui
role: satellite
---

# Interface audit

Read the selected product DESIGN.md and UX contract. Infer target files from the
current task; do not ask the user to repeat an already supplied repo or surface.
Fetch `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
and record retrieval date and digest. A retained snapshot may support an offline
audit, but label it as a snapshot and do not call it current.

Apply semantic controls, accessible naming, focus, safe areas, long content,
keyboard, contrast, responsive layout and reduced motion. Inspect actual renders
and behavior; static checks only establish what they test. Local Dutch copy style
wins over generic title case, punctuation and spinner preferences. Native buttons
already provide keyboard activation; do not add duplicate key handlers blindly.

Record findings as `file:line`, severity, observable effect, repair and verification.
Audit-only requests stay read-only. A review-and-fix request owns implementation
and verification of each valid finding. Use the design-report template for full
reports; terse terminal output does not replace requested depth.
