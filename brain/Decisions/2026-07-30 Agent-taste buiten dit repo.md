---
type: decision
tags: [decision, agents, taste]
---

# Decision - Agent-taste buiten dit repo

- **Datum**: 2026-07-30
- **Context**: Drie (of vier) planes dreigden door elkaar te lopen: UI-taste (`taste/`), brain-context (`brain/`), agent-gedrag (cmd/Cursor/Pi), en eventueel een globale `~/.commandcode`-laag. Joep vroeg waar de canonieke agent-taste hoort.
- **Keuze**: Agent-gedrag-taste hoort **niet** in `design-system`. Canonieke bron komt in een gedeeld punt (richting `kater-dev-tools` of equivalent): `taste.yaml` + generators naar per-tool overlays. Dit repo houdt alleen UI-taste (`taste/`), Second Brain (`brain/`), en de dunne `.agents/` skills/hooks rond brain + gegenereerde output.
- **Gevolgen**:
  - Geen `.agents/registry/taste.yaml` in dit repo
  - `.commandcode/taste/` blijft voorlopig ongemoeid tot de gedeelde generator bestaat; daarna wordt het gegenereerd artefact + evt. dunne overlay
  - Precedence later: canonieke yaml is inhoud; overlays voegen alleen tool-syntax toe, nooit regels overschrijven
  - Pi/Agy-formaat en globale vs repo-lokale Command Code-layers worden in dat gedeelde traject uitgezocht, niet hier
- **Productregel?** nee (agent-gedrag, geen UI)

## Links

- [[Decisions]]
- [[Home]]
- [[Taste]]
- [[Taste-propagatie]]
- [[2026-07-30 Agent-laag in punt-agents]]
- [[2026-07-30 Brain als vijfde tool]]
