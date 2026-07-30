---
type: decision
tags: [decision, agents]
---

# Decision - Agent-laag in .agents

- **Datum**: 2026-07-30
- **Context**: Brain-kennis en de invariant "raak gegenereerde bestanden niet aan" zaten alleen in prozadocs. Elke agent moest dat opnieuw uit `AGENTS.md` opdiepen, en niets hield het tegen.
- **Keuze**: `.agents/` als canonieke, tool-onafhankelijke laag met drie brain-skills en twee hooks. `.cursor/` blijft een dunne overlay: symlinks naar de skills plus `hooks.json` als wiring, omdat Cursor hooks alleen daar leest.
- **Gevolgen**:
  - Skills: `design-system-brain`, `brain-note-hygiene`, `brain-decision-capture`
  - Hook `guard-generated.sh` weigert Write-edits in `brain-site/`, `taste-site/`, `docs/*.html` en `components/**/index.html`, zie [[Gegenereerde bestanden]]
  - Hook `brain-build.sh` herbouwt de leeslaag na een edit in `brain/**/*.md`
  - Agent-gedrag-taste (canonieke `taste.yaml` met generators) blijft buiten dit repo tot de keuze tussen hier en `kater-dev-tools` valt
- **Productregel?** nee

## Links

- [[Decisions]]
- [[Home]]
- [[Gegenereerde bestanden]]
- [[2026-07-30 Brain als vijfde tool]]
