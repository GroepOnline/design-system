# CLAUDE.md — ChefFactory probe pointer

**Role:** Probe-first inventory pointers. Policy: `AGENTS.md`, `~/.agents/PLAYBOOK.md`, `~/AGENTS.md`.

**Canonical repo:** `GroepOnline/ChefFactory`. Not a host almanac.

## Probe first

Docs drift. **Live fleet is truth.** Probe via `inventory/*.yaml`, `docs/OPERATOR-RUNTIME-MAP.md`, skill `fleet-ssh-probe`. Report drift; never print secrets.

## Inventory SSOT

Services → `inventory/machine-services-live.yaml`; placement → `inventory/fleet-workload-placement.yaml`; operator map → `docs/OPERATOR-RUNTIME-MAP.md`. Glossary → `CONTEXT.md`; ADRs → `docs/adr/`.

## Boundaries

UDO plane separate (`udo-boundary.mdc`). Laptop `joep` thin-client only (`zero-local.mdc`).
