---
name: foundation-repair
description: Fase 1 subagent — relatief-pad reparatie (iframe src), regressies terugzetten (references/devin-home.png), build/check idempotentie bevestigen. Mechanisch werk, geen design.
domain: repair-ops
surfaces:
- design-system
phase: 1
source: handoff 2026-08-04 §3.1-3.2 + §4 Fase 1
skills_chain:
- diagnosing-bugs
- brain-decision-capture
gates:
- "grep levert 0 hits op: iframe src=\"/docs/\" in components/ en playground/"
- "git diff --stat references/devin-home.png = leeg (regressie hersteld)"
- "./ds build && git status --short == voor build (geen nieuwe diff)"
- "./ds check → 0 errors, 0 warnings"
output:
- "4 iframe-src's relatief"
- "references/devin-home.png teruggezet"
- "idempotentie + check-status gerapporteerd"
risk: mutating
last_reviewed: '2026-08-04'
---

# Fase 1 — Fundering reparatie (rest Task 1)

Repareert de `file://`-breuk die de vorige sessie deels heeft opgelost en
zet de resterende regressies recht. Mechanisch, geen ontwerpkeuzes.

## Context

De vorige sessie migreerde gegenereerde HTML van root-absolute asset-paden
naar relatieve paden (`rewrite_paths()` + `{rel_root}`-seed in `./ds`).
4 bestanden bleven achter met absolute `iframe src="/docs/"`.

## Taken (mechanisch, in deze volgorde)

1. Fix de 4 iframes naar relatieve paden:
   - `components/studio/self/v2-docs.html:243` en
     `components/studio/self/v3-flow.html:248` → `src="../../../docs/index.html"`
   - `playground/studio-v2.html:243` en
     `playground/studio-v3.html:248` → `src="../docs/index.html"`
2. Zet de devin-home.png-regressie terug (werkboom 3.4KB == devin-current.png,
   commit-versie is 469KB):
   `git checkout HEAD -- references/devin-home.png`
3. `./ds build` en bevestig dat de git-status NA de build gelijk is aan VOOR
   de build (idempotentie; gegenereerde output mag niet verder wijzigen).
4. `./ds check` → 0 errors, 0 warnings.

## Skill-chain (volgorde)

1. `diagnosing-bugs` — systematisch vaststellen dat relatief-pad-aanpak klopt
   (slechts deze 4 resterende absolute refs, geen andere).
2. `brain-decision-capture` — alleen als een keuze opduikt over wat te fixen;
   anders niet laden.

## Gates

- `grep -rn 'iframe src="/docs/' components/ playground/` → 0 hits.
- `git diff --stat references/devin-home.png` → leeg.
- `./ds build` daarna `git status --short` → identiek aan voor-build-status
  (alleen de geplande wijzigingen, geen nieuwe gegenereerde drift).
- `./ds check` → 0 errors, 0 warnings.

## Niet doen

- NIET `components/*/index.html`, `docs/*.html`, `taste-site/`,
  `brain-site/` handmatig bewerken (invariant 3) — alleen via `./ds build`.
- NIET committen, NIET designwijzigingen doen, NIET beslissen over
  `.commandcode/`-tracking (dat is een Joep-besluit, surf op bij de gates).
- NIET het `fout/`-mapje aanraken (nog geen besluit).
