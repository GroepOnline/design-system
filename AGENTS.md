# ChefFactory — workspace playbook (repo scope)

**Role:** Workspace-scoped pointers for `~/ChefFactory`. Not the global agent loop.

## Load order

| Layer | Path |
| --- | --- |
| Learned prefs | `~/AGENTS.md` |
| Workspace facts | `~/AGENTS.facts.md` (when needed) |
| Autonomy loop | `~/.agents/PLAYBOOK.md` |
| Hard policy | `~/.cursor/rules/*.mdc` |
| This file | repo scope + CI-visible contract |

## What this repo is

GroepOnline company-control umbrella and Company OS core monorepo (`core_monorepo_plus_satellites` until convergence gate). ADR `docs/adr/2026-08-14-company-os-core-monorepo.md`; gate `docs/plans/2026-08-14-single-monorepo-convergence-gate.md`.

In-tree: `apps/chefapp/`, `control/`, `brain/`. Gitignored siblings: `.gitignore`. Operator entry: `CONTROL-CENTER.md`, `docs/INDEX.md`, glossary `CONTEXT.md`.

## Nested playbooks

| Scope | File |
| --- | --- |
| ChefBar / ChefApp | `apps/chefapp/AGENTS.md` |
| Control plane | `control/AGENTS.md` |
| Brain docs / eval | `brain/AGENTS.md` |

Worker routing: `.cursor/rules/chef-grok-workers.mdc`. Verify: `./scripts/ci-local.sh`.

Compound Engineering: `.compound-engineering/config.yaml` tracked, `config.local.yaml` ignored; artifacts under `.compound-engineering/artifacts/`. Use `CONCEPTS.md` vocabulary and ChefGroep Dutch voice (pulse ChefFactory, never Spiral). Portable skills: `~/.agents/skills/ce-*`; native plugin is fallback.

Session init: run `./scripts/agent-init.py` before a resumed or cross-client mutation wave. It prints the current branch/head, authoritative context paths, merge latch, notify-first rule, and cheap CI-runner baseline status.

## Project operating posture

Agents own outcomes and in-scope choices; Joep is a teammate, not coordinator. Execute reversible work without human coordination and split materially independent lanes. Treat constraints as verified facts to work around, not a handoff excuse. Complete **fix → verify → authorized land → cleanup → encode** at the closest owning source; escalate only a hard stop, missing authority, or unresolved security/data-integrity defect.

## Always-on contract (CI-visible)

- **Merge:** dirigent squash-merges when `merge-gate` is green on the exact-head SHA, substantive scope-relevant code/security review is complete with material findings resolved, and no scope P1 or other unresolved blocking defect remains. External approval, `APPROVED`, `CHANGES_REQUESTED`, and a missing external review status are evidence only, not a merge latch. Helpers stop at merge-ready. No merge on red/unknown, a scope P1, or an unresolved blocking defect; no force-push `main`/`master`. SSOT: `docs/adr/2026-08-18-agent-merge-authority.md`.
- **Identity:** API/`chef-gh` = MisterWanted; SSH push = ChefGroep (`config-groeponline`); OnlineChef flagged.
- **Hostname resolution:** never synthesize or switch `.nl`/`.online`; resolve the exact hostname from `inventory/network-planes.yaml`, `inventory/identity-planes.yaml`, and the owning edge registry before URL/DNS/Access/deploy work. `.online` is company/operator/mail; `.nl` public/external; `auth` dual-plane. Anchors: `ocx.chefgroep.online`, `deepseek.chefgroep.online`, `auth.chefgroep.online`, `auth.chefgroep.nl`.
- **Autonomy loop:** `~/.agents/PLAYBOOK.md` only — do not restate the graph loop here.
- **Hard bans:** no secrets in git/chat/`mcp.json`; no outbound mail to derden; no autonomous OAuth; no laptop Docker/daemons (`zero-local`); no local Rust/Zig; UDO data plane out of scope (`udo-boundary.mdc`).
- **Worker harness:** when a required mutation is denied (Ask-mode/readonly), workers finish read-only work and report `BLOCKED_MUTATION: <action>` — never silent dry-run. SSOT: `.cursor/agents/*-grok.md`, `worker-composer.md`, `review-fixer.md`.
- **Decide-and-report:** no approval theater for reversible defaults. Hard stops stay: secrets print/rotate, mail to derden, force-push `main`, laptop daemons, UDO plane, SSH world-open, irreversible cloud outside campaign. Merge-ready is not a Joep-gate — the dirigent merges when the latch is green.
