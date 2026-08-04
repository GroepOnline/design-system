---
name: ci-agent-sync
description: Fase 3 subagent — CI + org-sync: taste-overlays regenereren (kater generate-taste), AGENTS.md/WORKFLOW.md/.agents/.cursor syncen met ./ds serve en org GroepOnline, .gitignore review. Maakt het tree klaar voor logische commits.
domain: devops-sync
surfaces:
- design-system
phase: 3
source: handoff 2026-08-04 §3.4-3.6 + §4 Fase 3
skills_chain:
- brain-decision-capture
- code-review
gates:
- "python3 ~/kater-dev-tools/.agents/scripts/generate-taste.py --target /home/joep/design-system --check → exit 0"
- "./ds brain gate → pass (agent_taste_check=ok)"
- "AGENTS.md/WORKFLOW.md/.agents/README.md noemen ./ds serve en org GroepOnline"
- "python3 ds build --check && ./ds check → groen"
output:
- "taste-overlays (taste.md, taste.mdc, CLAUDE.md §TASTE) ge-regenereerd"
- "docs/agents-sync doorgevoerd"
- ".gitignore-besluit gerapporteerd aan orchestrator (geen eigen commit)"
risk: mutating
last_reviewed: '2026-08-04'
---

# Fase 3 — Git, CI, skills & agents (Task 3)

Zet het repo klaar voor de logische commits van de handoff (Fase 3 stap 7-10):
CI-groen op org GroepOnline, agent-laag gesync met de nieuwe CLI (`./ds serve`)
en ge-update docs. Geen designwerk.

## Context

Scorecard faalt op `agent_taste_check=drift`: de gegenereerde taste-overlays
(`.commandcode/taste/taste.md`, `.cursor/rules/taste.mdc`, `CLAUDE.md` §TASTE)
lopen achter op `~/kater-dev-tools/.agents/registry/taste.yaml`. De docs
vermelden de nieuwe `./ds serve` en de org-migratie naar GroepOnline nog niet
op alle plekken.

## Taken (mechanisch, in deze volgorde)

1. **Taste-overlays regenereren** (output, nooit handmatig):
   `python3 ~/kater-dev-tools/.agents/scripts/generate-taste.py --target /home/joep/design-system`
   Daarna `--check` → exit 0.
2. **Docs/agents syncen** met de nieuwe CLI en org:
   - AGENTS.md: `./ds serve [port]` in de commando-lijst, org GroepOnline
     (remote-URL/PR-refs), Cursor Cloud-sectie up-to-date met `./ds serve`.
   - WORKFLOW.md: `./ds serve` noemen waar `http.server` handmatig stond.
   - `.agents/README.md`: `./ds serve` in commando-overzicht, overlay-tabellen
     checken op org-naam.
   - `.cursor/hooks.json` / `.cursor/rules/` alleen als die gegenereerde
     bestanden raken → dan via de generator, niet handmatig.
3. **CI-commando's lokaal verifiëren** (spiegelt validate.yml):
   - `python3 ds build --check` (build + diff-check)
   - `./ds check`
   - `./ds brain gate` → na stap 1 moet agent_taste_check=ok zijn.
4. **.gitignore review** (rapport aan orchestrator, geen eigen wijziging):
   - 8 untracked `.commandcode/*.py/.js/.json` (CDP meet-tooling) — tracken of
     negeren?
   - untracked `fout/` (7 screenshots) — negeren/verwijderen?

## Skill-chain (volgorde)

1. `brain-decision-capture` — bepaal of het .gitignore-besluit een
   brain-note/decision verdient (adviseren, niet zelf besluiten).
2. `code-review` — staatscontrole na de sync: geen tweede bron, geen
   handmatige edits in gegenereerde overlays.

## Gates

- `generate-taste.py --check` → exit 0.
- `./ds brain gate` → pass (scorecard herladen: `./ds brain eval` eerst).
- `./ds check` → 0 errors.
- Geen enkele handmatige wijziging in `taste-site/`, `.commandcode/taste/`,
  `.cursor/rules/taste.mdc`, `CLAUDE.md` §TASTE buiten de generator om.

## Niet doen

- NIET committen: orchestrator doet review + logische commits
  (`fix:` paden, `chore:` tooling, `feat:` agents).
- NIET de scorecard of signals handmatig wijzigen (alleen via `ds brain eval`/
  `ds brain signal`).
- NIET CI-yml herschrijven zonder dat een lokale gate hetzelfde faalt/slaagt.
