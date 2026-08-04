# .agents/subagents — canonieke subagent-definities (tool-onafhankelijk)

Net als skills/hooks is deze laag tool-onafhankelijk: de definitie beschrijft
*wat* de subagent moet doen, niet *hoe* een specifieke tool hem aanroept.
Overlays (`.cursor/`, `.commandcode/`, opencode) kunnen hiernaar verwijzen of
deze via hun eigen spawn-mechanisme opstarten. Nooit een tweede bron aanmaken.

## Model

Fase-subagents voeren mechanisch werk uit uit PLAN.md / handoff-docs. Elke
definitie heeft een vaste `skills-chain` (in volgorde te laden), `gates`
(verificatie die de fase hard laat slagen/falen) en een `output`-contract.
Een phase-subagent rapporteert altijd terug aan de orchestrator/primary; die
draait de gates en doet de review + commits.

## Subagents

| Subagent | Fase | Werk |
|---|---|---|
| `foundation-repair` | 1 | relative-pad reparatie, regressies terugzetten, build/check idempotentie |
| `dna-propagation` | 2 | Devin-meting (json → references) propageren, PLAN.md blokkades labelen |
| `ci-agent-sync` | 3 | CI + org-sync, taste-overlays regenereren, docs/agents syncen, .gitignore |

## Chained skill

`../skills/non-design-pipeline/SKILL.md` orkestreert de drie fasen in volgorde
(1 → 2 → 3) en definieert de gates per fase. Designwerk (Fase 4) zit daar
bewust buiten; dat vereist expliciete Joep-goedkeuring.

## Gebruik

```bash
# gates lokaal draaien zonder subagent
./ds check && python3 ds build --check && ./ds brain gate

# taste-overlays (Fase 3) regenereren
python3 ~/kater-dev-tools/.agents/scripts/generate-taste.py --target /home/joep/design-system
```

## Redactie

- Geen secrets, geen PII, geen persoonlijke meet-output (`.commandcode/`) in
  deze definities.
- Gates mogen nooit zwakker zijn dan de CI-stap die ze spiegelen.
