# How memory works today (ChefGroep Brain)

**Product home:** engineering SSOT for Joep Brain in `GroepOnline/ChefFactory`.  
**Live bytes:** Git Markdown on `bc-scan-arm:/var/lib/joep-brain` — not this git tree.  
**Plane:** ChefGroep company-control only. Utrecht Data OS is out.  
**Campaign:** [GRO-1059](https://linear.app/chefgroepp/issue/GRO-1059) (active) · groundwork [GRO-1296](https://linear.app/chefgroepp/issue/GRO-1296) (done)  
**Baseline live evidence:** 2026-08-20T18:42:00Z fleet probe (`inventory/brain-*.yaml`, `brain/docs/2026-08-18-live-evidence.md`). **MCP endpoint recheck:** 2026-09-06, scoped evidence in `inventory/brain-chatgpt-mcp.yaml`; this does not refresh the other historical component observations.

Read [`AGENTS.md`](./AGENTS.md) before changing Brain docs, eval, ingest, or bake-off.

---

## One sentence

Git Markdown on `bc-scan-arm` is the **only write authority**; everything else (lexical index, Qdrant dense projection, eval harness, proposal store) is disposable or gated and must rebuild from a pinned `canonical_git_sha`.

---

## Components (what exists today)

| Layer | Role | Host | Live state (2026-08-20) |
|---|---|---|---|
| **Canonical wiki** | Write SSOT — bare Git + working tree | `bc-scan-arm` `/var/lib/joep-brain/{bare.git,wiki}` | HEAD `1410aa46a179dfdbc81d019fd44e46aab6c84251` (~287 markdown files). No git remote (private). |
| **Standalone Brain API** | ACL-scoped read, proposal-only write, doctor | `bc-scan-arm` `chef-brain.service` | **Active** on loopback `127.0.0.1:8788`, **mTLS required**. Code: `brain/service/` · package: `deploy/brain-api/`. |
| **Tailnet mTLS proxy** | Fleet clients reach Brain over Tailscale with client certs | `bc-scan-arm` `chef-brain-tailnet.service` | Listed **active** in `inventory/machine-services-live.yaml` (raw mTLS tailnet proxy). Fleet mTLS clients live via `deploy/brain-clients/brain` — see [`docs/client-dogfood.md`](./docs/client-dogfood.md). |
| **ChatGPT MCP + Cloudflare edge** | Read-only Streamable HTTP | `bc-scan-arm` `deploy/brain-chatgpt-mcp/` | **Endpoint verified 2026-09-06** — loopback `:8790/mcp` behind the existing Cloudflare edge; authenticated initialize, three-tool discovery and upstream doctor call pass. Saved ChatGPT app and calls from ChatGPT **unverified**. |
| **Legacy MCP shim** | Old stdio MCP over wiki files | `bc-scan-arm` `/var/lib/joep-brain/mcp/server.py` | Still present (148 lines, mtime 2026-07-23). Superseded for new work by standalone API + ChatGPT MCP. |
| **Qdrant projection** | Dense vectors — rebuildable, not authority | `bc-scan-arm` `chef-brain-qdrant` | **Active** v1.19.0 on `127.0.0.1:7333`. Collection `cc_brain_dense_v1`: 199 points @ watermark `1410aa4`. |
| **Embed compute** | BGE-M3 embeddings for dense/challenger paths | **HISTORICAL:** `chef-runner-01` `chef-brain-embed.service` (retired 2026-08-22). Target: `chef-control-az-01` (co-located with eval venv) | Last observed active on historical runner — host offline |
| **AutoRAG router** | Mode routing + RRF + FlashRank rerank | Code in `brain/service/autorag.py` | **Challenger only** — lexical remains champion; promotion gates not passed. |
| **Proposal / learning store** | Staged candidates, feedback, verify receipts | `bc-scan-arm` `/var/lib/joep-brain/learning` | **Live, proposal-only** (PR #163/#164). `PROMOTION_DISABLED` — canonical Git unchanged. |
| **Backup + restore smoke** | Encrypted bundles, external verify | arm → **HISTORICAL** `chef-runner-01` (required dest, retired), `weg54` (replica) | Daily timer was active on historical host; restore-smoke on **historical interim** `chef-control-01` passed at HEAD `1410aa4` (2026-08-19). **Target** restore host post-CTL1: `chef-control-az-01`. |
| **Eval harness** | Regression on fixtures, not live wiki | **HISTORICAL:** `chef-runner-01` `deploy/brain-eval/` (retired). Target: `chef-control-az-01` | Lexical Recall@5 **0.778** on adversarial holdout n=54 (`20260812T193529Z`, historical host). |
| **Kater read adapter** | Retired | — | **Removed** — use `deploy/brain-chatgpt-mcp` or direct mTLS clients. |
| **DSH session adapter** | Scoped session memory + propose path | Cloudflare Worker `dsh-brain` | **Live** bidirectional adapter; D1 has audit/revoked rows, not canonical wiki. |
| **This repo folder** | Docs, schemas, packages, tests | `~/ChefFactory/brain/` | Engineering SSOT only. |

**Not Brain:** UDO SuperBrain (`udo-memory.chefgroep.online`), status wall, Vault Brain tab, jcode `:7643` session memory.

---

## Data flow

```text
                         WRITE PATH (canonical)
  Agent / producer                proposal gate              Git SSOT
  ─────────────────    brain_propose ──► /learning/     (promotion OFF)
  brain-push preview       verify receipt      ──X──► bare.git + wiki
  DSH / future producers   dual-control gate         bc-scan-arm

                         READ PATH (default today)
  Client (CLI / HTTP+mTLS / authenticated Cloudflare MCP edge / legacy MCP)
       │
       ▼
  chef-brain.service ──► ACL filter (plane, sensitivity, scopes, v2 metadata)
       │
       ├── lexical index (always) ──► champion results + citations + canonical_git_sha
       │
       └── optional modes (dense/hybrid/graph) ──► Qdrant cc_brain_dense_v1
                              ▲                      + **target** platform BGE-M3 embed job (HISTORICAL: chef-runner-01)
                              └── fail-closed degrade to lexical
```

**Restore rule:** never restore from vector dumps. Rebuild projections from Git checkout at pinned SHA.

---

## Live vs planned

| Capability | Status | Evidence |
|---|---|---|
| Git Markdown write SSOT | **Live** | HEAD `1410aa4`, fsck pass |
| Lexical retrieval (production default) | **Live** | `chef-brain.service`, capabilities advertise `lexical` champion |
| Dense Qdrant projection | **Live infrastructure**, challenger retrieval | `inventory/brain-qdrant.yaml`, 199 points |
| Hybrid / dense as default retrieval | **Not live** (eval-only challenger) | `inventory/brain-autorag.yaml` — lexical champion unchanged |
| Canonical promotion from proposals | **Disabled** | `promotion_mode: proposal_only`; live probe returned `PROMOTION_DISABLED` |
| `ingest_report` direct wiki write | **Rejected** | Legacy MCP + API reject; use `brain_propose` |
| Fleet `brain-push --apply` | **Locked** | Requires `CHEF_BRAIN_INGEST_ALLOW_FLEET=1` + `CHEF_BRAIN_BACKUP_GATE=ok` |
| Auto-ingest producers (GitHub, Linear, Notion, …) | **Planned / contract** | `inventory/brain-adapters.yaml` |
| Fleet HTTPS mTLS clients (`deploy/brain-clients/brain`) | **Live** | Inventoried client identities; dogfood runbook [`docs/client-dogfood.md`](./docs/client-dogfood.md) |
| ChatGPT Developer Mode MCP | **Endpoint verified; account connection unverified** | Public authenticated initialize, tools/list and doctor call pass (2026-09-06); no saved-app, scan or ChatGPT tool-call receipt yet. [`Connection runbook`](./docs/chatgpt-mcp-runbook.md) |
| Kater `brain` profile | **Retired** | Removed from Brain adapter registry |
| Graph / temporal modes as champion | **Planned** (F4 projection) | In code paths; not promoted |
| Public memory website | **Never** | No public wiki/body browser; authenticated read-only MCP is a separate API surface |

---

## How an agent reads memory

1. **Do not** mount `/var/lib/joep-brain` into a generic coding worktree.
2. **Prefer** fleet path with mTLS identity:
   - On `bc-scan-arm`: `brain query` / HTTP `POST /v1/brain/query` (loopback or tailnet proxy with client cert).
   - From laptop: prefer HTTPS mTLS via `deploy/brain-clients/brain` (operator install of `~/.local/bin/brain`; agents do not write `~/.local/bin`). ChatGPT target: `https://brain-chatgpt.chefgroep.online/mcp` → existing Cloudflare edge → bc-scan-arm loopback `:8790/mcp`. The client must supply the existing origin authorization; compatible ChatGPT account configuration is **not yet verified** (see the connection runbook). Break-glass: thin SSH client to arm. **Not** a new entry in Cursor `mcp.json`.
3. Send a **v2 query JSON** with project, planes, sensitivities, scopes, and optional `retrieval_modes` (default lexical).
4. Every result includes **citations** (`path:line` or record id) and **`canonical_git_sha`**.
5. **Do not** treat Recall@5 0.778 as live wiki quality — it is the ChefFactory fixture harness on **HISTORICAL** `chef-runner-01` (host retired 2026-08-22).

Break-glass: scoped SSH to arm (`brain doctor`, `brain capabilities`). No OAuth, no vendor cloud upload of wiki bodies.

Body-free A→Z gate: `python3 scripts/brain-backend-doctor.py`. Dense coverage is green only when the current-SHA reindex receipt (`schemas/brain-reindex-receipt.schema.json`) matches expected/dense counts. Authenticated ChatGPT MCP initialize reuses `deploy/brain-chatgpt-mcp/probe-authenticated.sh`.

Skill: `~/.agents/skills/joep-brain/SKILL.md` (or `~/.cursor/skills/joep-brain/SKILL.md`).

---

## How an agent writes memory

Canonical Git is **not** mutated by autonomous agents today.

| Step | Tool / path | Live? |
|---|---|---|
| Stage a candidate | `brain_propose` / `brain propose` | **Yes** — writes to proposal store only |
| Independent verify | `brain verify` with `backup_gate=true` | **Yes** — records receipt |
| Promote to wiki | `brain promote` (dual control) | **No** — returns `PROMOTION_DISABLED` |
| Legacy one-shot ingest | `ingest_report` | **Rejected** |
| Operator fleet ingest | `brain-push --apply` on arm | **Locked** (two env unlocks + backup gate) |
| Laptop preview | `brain-push` preview | **Yes** — no canonical mutation |
| Cadence (GRO-1448) | preview/propose only; observe `chef-brain-backup.timer` on arm | **Contract** — fleet `--apply` stays locked; see `inventory/brain-ingest.yaml` `cadence:` |

After a verified learning cycle, agents may **`brain feedback`** (body-free hit/miss signals) — learning batches form correction clusters; champion and policy mutation stay **false** until promotion gates pass.

---

## Eval control (ChefGroep harness)

| Metric | Value | Notes |
|---|---|---|
| Recall@5 | **0.778** | Lexical champion, adversarial holdout n=54 |
| MRR | 0.759 | Same run |
| Citation precision | 0.741 | Same run |
| Leakage | **0** | Required gate |
| Run id | `20260812T193529Z` | **HISTORICAL** `chef-runner-01` (retired) |
| Corpus | `fixtures/brain/` | Sanitized `source_plane: company_control` — **not** live wiki |

Latest BGE-M3 challenger run: `20260819T002936Z` — leakage 0, still below promotion floors (`inventory/brain-autorag.yaml`).

Runbook: [`docs/brain-rag-bakeoff.md`](./docs/brain-rag-bakeoff.md).

---

## Four names people confuse

| Name | What it is |
|---|---|
| **Joep Brain** | Company + personal memory SSOT (this doc) |
| **UDO SuperBrain** | UDO product on `bc-scan-2` — separate plane |
| **Vault Brain tab** | Skills/evals inventory in chefgroep-vault — not Joep Brain |
| **jcode `:7643`** | Session harness memory on **HISTORICAL** runner — rejected as Brain authority. **Target:** chef-platform-aws-01 |

---

## Repo layout (engineering)

| Concern | Path |
|---|---|
| Service runtime | `brain/service/` (`runtime.py`, `learning.py`, `autorag.py`) |
| Standalone API package | `deploy/brain-api/` |
| Schemas | `schemas/brain-*.schema.json` |
| Authority contract | `contracts/brain-authority-and-retrieval.md` |
| Live inventory | `inventory/brain-{api,qdrant,embed,autorag,ingest,backup,eval,adapters}.yaml` |
| Eval / ingest / backup | `scripts/brain-eval-baseline.py`, `deploy/brain-{eval,ingest,backup}/` |
| Live evidence ledger | `brain/docs/2026-08-18-live-evidence.md` |
| mTLS runbook | `brain/docs/brain-mtls.md` |
| Tests | `tests/test_brain_*.py` |

New Brain docs belong in `brain/docs/`. Stubs under `docs/runbooks/brain-*` redirect here.

See [`LAYOUT.md`](./LAYOUT.md) for the 2026-08-14 folder decision.

---

## Campaign pointer

Long-form ×10 plan (phases F0–F5, OSS evaluation, Joep gates): [`docs/plans/2026-08-14-brain-memory-x10.md`](../docs/plans/2026-08-14-brain-memory-x10.md). Treat its 2026-08-14 baseline tables as historical; this README and `inventory/brain-*.yaml` are the current-state SSOT.
