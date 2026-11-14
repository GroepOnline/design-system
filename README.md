# ChefFactory

> **Current truth contract · 2026-09-02.** `main` plus exact-head GitHub PR/CI evidence is code truth. Linear `chefgroepp` / GRO is execution truth. Notion is context/navigation and dated evidence, never live-runtime proof. Live runtime/edge state requires a direct read-only probe. `control/` and `apps/chefapp/` on ChefFactory `main` are the current company-control code authority; separate `chefgroep-os` / `chefbar` repositories may remain as migration/history/satellite surfaces but are not competing current SSOTs.

> Display title: **Chef Factory control center** · GitHub: [`GroepOnline/ChefFactory`](https://github.com/GroepOnline/ChefFactory) (exact spelling). Local checkout may historically have been typed `ChefFactoy`; canonical name is **ChefFactory**.

Private **company-control** SSOT for GroepOnline:

1. Daily Cursor control-center docs, inventory, and operator runbooks
2. Canonical **observability event catalog** + governance/validation
3. Publish/sync contract toward runtime `@chefgroep/observability` (implementation stays in `chefgroep-vault`)

This repository is Joep's **operator control center** documentation plane. It is **not** 24/7 runtime — fleet hosts (`chef-control-az-01`, `chef-platform-aws-01`) own continuous services. Do **not** duplicate capture/scrub SDK code here. UpCloud `chef-control-01` / `chef-runner-01` are **retired_unreachable** — never rollback.

**Start here:** [CONTROL-CENTER.md](./CONTROL-CENTER.md) · [docs/README.md](docs/README.md)  
**Truth authority:** [docs/TRUTH-AUTHORITY.md](docs/TRUTH-AUTHORITY.md)
**Catalog SSOT:** [catalog/observability-event-catalog.yaml](catalog/observability-event-catalog.yaml)  
**Ownership:** [docs/platform/observability-ownership.md](docs/platform/observability-ownership.md)  
**Sync contract:** [contracts/publish-sync-observability.md](contracts/publish-sync-observability.md)

## Layout (versioned in git)

| Path | Role |
|------|------|
| `apps/chefapp/` | Tracked ChefApp / ChefBar GTK cockpit (monorepo wave 2) |
| `control/` | `chef` CLI control plane, Core API, cloud VM artifacts |
| `brain/` | Engineering home docs for Joep Brain recall (not live Brain runtime) |
| `docs/`, `inventory/` | Runbooks, CRM architecture, machine-readable inventory |
| `catalog/` | Event catalog SSOT + versioning policy |
| `schemas/` | JSON Schemas for the catalog and fleet placement |
| `scripts/validate_catalog.py` | Catalog local + CI validation |
| `scripts/validate_fleet_workload_placement.py` | Fleet placement local + CI validation |
| `tests/` | Catalog governance tests |
| `contracts/` | Publish/sync contracts (runtime packages) |
| `lib/` | Small Python helpers used by control-center docs (Linear tooling) |
| `CONTROL-CENTER.md` | Daily ops entry |
| `scripts/release_sync_status.py` | Read-only checkout/version/release drift status |

## Source of truth vs remotes

The completed core-monorepo convergence put `control/` and `apps/chefapp/` on Factory `main`. **Compose / control-plane source of truth is `control/` in this repo; ChefApp code authority is `apps/chefapp/`.** Separate `GroepOnline/chefgroep-os` and `GroepOnline/chefbar` repositories may remain reachable for migration/history/satellite work, but they must not be treated as parallel current SSOTs. Archive/rename/removal is a separate explicit decision; do not infer it from old Wave numbering.

## Not in this git tree

Sibling product checkouts stay **outside** ChefFactory commits (local-only, gitignored):

- `chefbar/` (legacy visual-Pi checkout; tracked SSOT is `apps/chefapp/` until GRO-1310)
- `chefgroep-vault`, `kater-dev-tools`, `herdr-ops`, `chefgroep-infra`
- `Utrecht-kater`, `chefgroep-skills` (UDO boundary)
- `worktrees/`, secrets, `.env`, large Linear reconstruction zips

Laptop checkouts of `chefgroep-os/` may still exist as gitignored siblings for migration safety. They are **not** compose SSOT.

## Local CI (preflight + merge-gate)

Preflight (single executable truth for local and remote `schema-catalog-compat`):

```bash
./scripts/ci-local.sh
# optional: CI_LOCAL_VENV=/tmp/cf-ci-venv ./scripts/ci-local.sh
```

Merge authority check name: `merge-gate` (fails unless `schema-catalog-compat` succeeds). General CI uses self-hosted `pr-isolated`+`cf` on pull requests and `heavy`+`cf` on main; private ARC targets `company-ci`, measured heavy work targets `company-ci-heavy`, and trusted deploy/release work targets `company-deploy`. Host labels remain only for inherently host-local operations. Enforcement: `docs/runbooks/ci-merge-enforcement.md`. Eval: `docs/maintenance/ci-eval-local-2026-08-10.md`.

## Open in Cursor

```bash
cursor ~/ChefFactory/ChefFactory.code-workspace
```

Delegate daily ops to agent **chef-control-center** or skill **chef-control-center**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Auth: `chef-gh` (MisterWanted) for API; sheesh / ChefGroep for git push. Never `gh auth switch`. Independent APPROVE: [ADR 2026-08-24](docs/adr/2026-08-24-independent-approval-architecture.md).
