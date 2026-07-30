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
| `brain-decision-capture` | Decision, research of taste-log: welke route |

## Hooks

| Hook | Event | Gedrag |
|---|---|---|
| `guard-generated.sh` | `preToolUse` (Write) | weigert handmatige edits in gegenereerde output |
| `brain-build.sh` | `afterFileEdit` | herbouwt `brain-site/` na een vault-note edit |

Beide falen open (exit 0) als iets onverwachts is, behalve de expliciete deny.
Test los met:

```bash
echo '{"tool_name":"Write","tool_input":{"path":"docs/index.html"}}' | .agents/hooks/guard-generated.sh
echo '{"file_path":"brain/Home.md"}' | .agents/hooks/brain-build.sh
```

## Buiten scope (besloten 2026-07-30)

Agent-gedrag-taste hoort **niet** in dit repo. Canonieke bron komt in een
gedeeld punt in `kater-dev-tools` (PR https://github.com/OnlineChefGroep/kater-dev-tools/pull/174): `taste.yaml` + generators naar
per-tool overlays. Zie `brain/Decisions/2026-07-30 Agent-taste buiten dit repo.md`.

`.commandcode/taste/` blijft voorlopig zijn eigen bron tot die generator
bestaat; daarna wordt het gegenereerd artefact (+ evt. dunne overlay).
