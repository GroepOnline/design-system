---
name: non-design-pipeline
description: Chained orchestratie-skill voor de non-design fasen van de handoff 2026-08-04 (Fase 1 foundation-repair → Fase 2 dna-propagation → Fase 3 ci-agent-sync). Laadt de skills van elke fase in volgorde, spawnt de bijbehorende subagent uit .agents/subagents/, draait de gates en laat commits over aan de orchestrator. Design (Fase 4) zit er bewust buiten.
domain: orchestration
surfaces:
- design-system
triggers:
- non-design fase
- handoff uitvoeren
- foundation-repair
- dna-propagation
- ci-agent-sync
- fase 1-3
avoid_when:
- designwerk (Fase 4) zonder Joep-goedkeuring
- taste-propagatie (losse Joep-reactie op UI)
- git commits zonder orchestrator-review
risk: mutating
last_reviewed: '2026-08-04'
---

# Non-design pipeline (handoff Fase 1-3)

Één chain, drie subagents, gates ertussen. Per fase: skill(s) laden in
volgorde → subagent spawnt → gates draaien → door naar de volgende. Alleen
door naar de volgende fase als de gates groen zijn.

```
Fase 1 foundation-repair ── gates ──▶ Fase 2 dna-propagation ── gates ──▶ Fase 3 ci-agent-sync ── review ──▶ commits
```

## Chain

| Stap | Subagent (`../../subagents/`) | Skills (volgorde laden) | Gates |
|---|---|---|---|
| 1 | `foundation-repair` | diagnosing-bugs → brain-decision-capture (optioneel) | 4 iframes relatief; devin-home.png teruggezet; `./ds build` idempotent; `./ds check` 0/0 |
| 2 | `dna-propagation` | design-system-brain → brain-note-hygiene (optioneel) | devin-app-dna.md 2026-08-04 + nieuwe deltas; PLAN.md Fase B OAuth-label; `./ds check` 0 errors |
| 3 | `ci-agent-sync` | brain-decision-capture → code-review | generate-taste `--check` exit 0; `./ds brain gate` pass; docs noemen `./ds serve` + GroepOnline; build-check groen |

## Gates commando's (draait de orchestrator, niet de subagent)

```bash
grep -rn 'iframe src="/docs/' components/ playground/      # Fase 1: 0 hits
git diff --stat references/devin-home.png                  # Fase 1: leeg
./ds check                                                 # Fase 1+2: 0 errors, 0 warnings
python3 ~/kater-dev-tools/.agents/scripts/generate-taste.py --target /home/joep/design-system --check   # Fase 3: exit 0
./ds brain eval && ./ds brain gate                          # Fase 3: pass
python3 ds build --check                                    # Fase 3: groen
```

## Einde van de pipeline

- Besluiten die een subagent NIET mag nemen, liggen bij Joep:
  - `.commandcode/`-tooling tracken vs negeren
  - `fout/`-screenshots negeren vs verwijderen
- Commits: orchestrator/primary maakt logische commits na review
  (`fix:` paden, `chore:` tooling, `feat:` agents). Geen `--no-verify`.
- Fase 4 (design) start alleen na expliciete Joep-goedkeuring en NIET via
  deze chain. Klaargezet in `../../subagents/design-polish.md` (scope, chain,
  gates, blokkade).

## Regels tijdens de chain

- Nooit handmatig gegenereerde output bewerken (invariant 3):
  `components/*/index.html`, `docs/*.html`, `taste-site/`, `brain-site/`,
  `.commandcode/taste/taste.md`, `.cursor/rules/taste.mdc`,
  `brain/eval/scorecard.json`.
- Nooit een tweede bron aanmaken; wijzigingen aan `./ds`, `tokens.css`,
  `catalog.json`, `.agents/` zijn de enige legitieme bronnen van output.
- Elke fase rapporteert output-contract terug; gates zijn hard.
