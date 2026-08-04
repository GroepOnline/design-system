---
title: Web motion refs for Devin-Signaal polish
date: 2026-08-04
binding: false
note: Ondersteunt motion-spec.md + DESIGN.md, wint nooit van die twee.
---

# Web motion refs (opgehaald voor Kimi)

## Bindend in dit repo (blijft winnen)
- `DESIGN.md` §7 activiteit / Current
- `motion-spec.md`: Five Allowed Motions; spring **alleen** op Current
- `taste/taste-rules.md`

## Joep override 2026-08-04
- Catalogus / components / `./ds` **mag**: nieuwe entry-id of select/remove flow; geen stille in-place overwrite van locked entries.
- Web/skills.sh **mag**: trek motion/polish skills + patterns binnen, mits ze DESIGN/motion-spec niet breken.

## Emil Kowalski (sterkste open web-bron)
- Essay: https://emilkowal.ski/ui/great-animations
- Tips: https://emilkowal.ski/ui/7-practical-animation-tips
- Skill (78k installs): `npx skills add emilkowalski/skills@review-animations`
- Skill: `npx skills add emilkowalski/skills@improve-animations`
- Mirror: https://skills.sh/emilkowalski/skills/review-animations

### Neem over (past bij motion-spec)
- UI motion **&lt; 300ms**; enter/exit = **ease-out** / custom cubic-bezier, nooit `ease-in` op UI
- Alleen **transform + opacity** (GPU)
- **CSS transitions** &gt; keyframes voor interruptible UI (toasts, toggles, ripples die opnieuw kunnen)
- `scale(0.95)`+opacity i.p.v. `scale(0)`
- `prefers-reduced-motion` + hover achter `@media (hover: hover) and (pointer: fine)`
- High-frequency chrome: minder/geen motion (niet “delight” spammen)

### Neem NIET over als het botst
- Springs overal → hier spring **alleen** Current (stiffness 180 / damping 26)
- Infinite ambient loops, blur-glow blobs, spinners i.p.v. worked-row/Current
- Em-dashes, emoji-icons, tweede accentkleur

## Extra skills.sh (optioneel)
- `oakoss/agent-skills@ui-ux-polish` (~417)
- `patricio0312rev/skills@animation-micro-interaction-pack` (~389)
- `dembrandt/dembrandt-skills@micro-interactions` (~376)
- `detaildotdesign/skill@interface-details` (~283)

## Devin DNA reminder
Warm off-white `rgb(247,246,245)`, accent `#317CFF`, General Sans + JetBrains Mono data-only.
Activiteit = tijd + golfjes / tool-ripples die **stoppen**, geen typing-dots als signatuur.
