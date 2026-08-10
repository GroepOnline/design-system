# Consumer contract

Consumers keep a machine-readable `.github/design-system.json` and a human-readable YAML mirror. The contract must pin `source.commit_sha` to a full 40-character lowercase Git commit SHA. Branches and floating tags are invalid. `tier` is `hub`, `gold`, `silver`, or `bronze`; `applicability` names the owned surface; `commands` contains only proven, non-destructive commands and may be empty while existing CI remains authoritative.
