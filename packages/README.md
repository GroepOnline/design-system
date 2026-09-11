# Runtime packages

The catalog remains the design authority. These packages are a second distribution form for applications that need stable imports instead of copy-paste.

- `@signaal/tokens`: generated from root `tokens.css`; never edit generated package artifacts directly.
- `@signaal/react`: framework adapter for generic, product-agnostic primitives and patterns.

A component is promoted here only after it has a stable semantic contract and has been proven on at least two surfaces, or after a deliberate system-level decision. Product-specific DSH wiring stays in DSH.

The packages are private while the API is alpha. Version numbers describe software releases. The design language itself is simply **Signaal**, not Signaal v1/v2/v3.

## `@signaal/interactions`

Optionele, zero-dependency interaction helpers. Geen component of product is ervan afhankelijk. Gebruik alleen het gedrag dat een specifieke control nodig heeft, bijvoorbeeld `attachPressRipple`, `attachHoldConfirm` of `attachCommandAck`.

## Release contract

`release.json` is the single version/package-set authority. `scripts/set-runtime-version.py` updates all runtime manifests atomically. `scripts/build-release-bundle.py` creates npm tarballs plus SHA-256 checksums; `scripts/smoke-runtime-bundle.py` imports those exact tarballs in an isolated consumer. Registry publishing remains disabled while the API is alpha.
