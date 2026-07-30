# Signal entry contract (mirrors kater-dev-tools/.agents/registry/signals.schema.md)

Append-only. Capture is explicit only (`./ds brain signal`).

| Field | Required | Values |
|---|---|---|
| `id` | yes | stable slug |
| `ts` | yes | ISO-8601 UTC |
| `plane` | yes | `design-brain` \| `ui-taste` \| `agent-taste` |
| `kind` | yes | `observation` \| `promotion_candidate` \| `gate_fail` \| `score_refresh` |
| `source` | yes | `human` \| `agent` \| `schedule` |
| `signal` | yes | short free text |
| `refs` | yes | list (may be empty) |
| `score_hint` | no | null or 0..1 |
| `status` | yes | `open` \| `acked` \| `promoted` \| `dismissed` |

Critical for gate: `kind=gate_fail` + `status=open`, or `status=open` + `score_hint < 0.4`.
