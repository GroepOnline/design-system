---
type: decision
tags: [decision, brain, eval]
---

# Decision - Brain signals, eval, dual gate

- **Datum**: 2026-07-30
- **Context**: Andere brains hebben signal-log, scorecard, eval-gate en scheduled refresh. Dit repo had alleen vault + taste-log.
- **Keuze**: File/YAML-plane v1. Expliciete signals (`./ds brain signal`), automatische eval/scorecard (`./ds brain eval|gate`), harde CI-gate, dual scheduler (GHA + fleet timer). Geen PostHog/PG/joep-brain dual-write. Schema gespiegeld met kater-dev-tools agent-taste.
- **Gevolgen**:
  - `brain/signals/signals.yaml` + `brain/eval/{thresholds.yaml,scorecard.json}`
  - CI: `validate.yml` runt `ds brain gate`; nightly `brain-eval.yml` uploadt artefact (geen auto-commit)
  - Fleet: `kater-dev-tools` `scripts/run-taste-brain-eval.sh` + systemd template (niet laptop)
  - Scorecard is gegenereerd (guard-generated)
- **Productregel?** nee

## Links

- [[Decisions]]
- [[Home]]
- [[2026-07-30 Brain als vijfde tool]]
- [[2026-07-30 Agent-taste buiten dit repo]]
- [[Taste-propagatie]]
- [[Gegenereerde bestanden]]
