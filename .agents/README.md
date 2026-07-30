# .agents — canonieke agent-laag voor dit repo

Tool-onafhankelijke bron voor skills en hooks. Per-tool mappen zijn dunne
overlays die hiernaar wijzen, nooit een tweede bron.

| Laag | Pad | Rol |
|---|---|---|
| Canoniek | `.agents/skills/<naam>/SKILL.md` | wat agents moeten weten |
| Canoniek | `.agents/hooks/*.sh` | wat agents niet mogen breken |
| Overlay | `.cursor/skills/<naam>` | symlink naar `.agents/skills/<naam>` |
| Overlay | `.cursor/hooks.json` | wiring, want Cursor leest alleen daar |

## Skills

| Skill | Waarvoor |
|---|---|
| `design-system-brain` | Brain-vault gebruiken: `ds brain`, grenzen, Obsidian CLI |
| `brain-note-hygiene` | Notes die de graph en `ds brain check` schoon houden |
| `brain-decision-capture` | Decision, research, taste-log of signal: welke route |

## Hooks

| Hook | Event | Gedrag |
|---|---|---|
| `guard-generated.sh` | `preToolUse` (Write) | weigert handmatige edits in gegenereerde output (incl. scorecard) |
| `brain-build.sh` | `afterFileEdit` | herbouwt `brain-site/` na een vault-note edit |

Beide falen open (exit 0) als iets onverwachts is, behalve de expliciete deny.
Test los met:

```bash
echo '{"tool_name":"Write","tool_input":{"path":"docs/index.html"}}' | .agents/hooks/guard-generated.sh
echo '{"file_path":"brain/Home.md"}' | .agents/hooks/brain-build.sh
```

## Gedeelde agent-taste (consumer)

Agent-gedrag-taste heeft zijn canonieke bron in `kater-dev-tools`
(PR https://github.com/OnlineChefGroep/kater-dev-tools/pull/174):
`.agents/registry/taste.yaml`.

Dit repo consumeert de gegenereerde overlays:

- `.commandcode/taste/taste.md`
- `.cursor/rules/taste.mdc`
- `CLAUDE.md` tussen `<!-- TASTE:START -->` en `<!-- TASTE:END -->`

Regenereren/checken vanuit de kater-dev-tools checkout:

```bash
uv run python .agents/scripts/generate-taste.py --target /home/joep/design-system
uv run python .agents/scripts/generate-taste.py --target /home/joep/design-system --check
```

Deze bestanden zijn output, niet handmatig bewerken. Zie
`brain/Decisions/2026-07-30 Agent-taste buiten dit repo.md`.

## Signals + eval gate

```bash
./ds brain signal "…"
./ds brain eval
./ds brain gate
```

Scorecard: `brain/eval/scorecard.json` (gegenereerd). Nightly:
`.github/workflows/brain-eval.yml`. Shared fleet runner leeft in
kater-dev-tools `scripts/run-taste-brain-eval.sh`.
