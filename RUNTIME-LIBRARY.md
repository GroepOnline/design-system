# Signaal runtime library

Signaal has two delivery modes that share one design authority: the immutable catalog for inspection/copying and runtime packages for versioned application imports.

## Promotion path

`local -> candidate -> shared -> canonical -> deprecated`

- **local**: one product or one screen.
- **candidate**: reusable contract identified and demonstrated in the catalog.
- **shared**: used on two independent surfaces with accessibility/responsive states.
- **canonical**: stable public system contract with visual regression coverage.
- **deprecated**: retained for migration, no new use.

## First extraction from DSH

DSH remains owner of session lifecycle, adapters and product composition. The first generic contracts promoted are Button, IconButton, Badge, Input, Textarea, Separator, Alert, EmptyState and Activity. `Activity` generalizes the proven worked-row state model without hard-coding agents, repositories or ChefGroep product names.

Runtime packages must remain product-agnostic. ChefGroep products are consumers and test beds, not namespaces in the component API.

## Catalog versus extensions

A component family may contain hundreds of immutable variants. The catalog is exhaustive; an extension is only an optional named subset with a preferred variant and scope-specific `DESIGN.md` / `TASTE.md`.

The dependency direction is one-way: consumers may use Signaal or an extension view, but Signaal core never imports ChefGroep, DSH or another consumer extension. Removing an extension cannot break tokens, packages, catalog build or base checks.

## Optional motion capability

Motion is distributed independently from component semantics. `@signaal/tokens` exposes opt-in `.sg-motion-*` primitives and `@signaal/react` exposes `MotionSurface` plus `attachPressRipple`. A Button, Input or custom consumer can adopt one primitive without importing a product theme or requiring motion to function.

The current primitives are `beam`, `halo`, `sweep`, `ripple`, `glide` and `status`. They are catalogued under `components/motion/` and are tested as a separate family rather than baked into every button.
- `@signaal/interactions`: optionele zero-dependency button interaction helpers; geen core/runtime dependency.

### Form controls

`@signaal/react` exposes Field, Input, Textarea, Select, InputGroup/InputAffix, Checkbox, Radio and Switch. Native browser semantics stay primary; motion remains an optional composition wrapper rather than a form-control dependency.

## Release safety

The repository root `package.json` is upstream research material, not a Signaal workspace root. Runtime packaging is scoped explicitly to `packages/release.json`. All runtime packages share one semver, remain `private: true` during alpha, and are verified from their actual npm tarballs before a release bundle is accepted.

`catalog-index.json` is the generated machine-readable index for agents and tooling. Use `./ds search <query> --json` for global variant discovery; optional `--category`, `--origin`, `--extension` and `--pattern` filters narrow the result without changing catalog authority.

## Layout primitives

`@signaal/react` exposes generic composition primitives: `Stack`, `Cluster`, `Grid`, `Page`, `Section`, `SplitPane`, `AppShell`, `AppShellRail` and `AppShellMain`. They own layout behavior only. Navigation meaning, product state and business semantics remain in the consumer.

The layout contract is responsive by default: fixed grids collapse at 620px, split panes become one column, and an `AppShell` with `collapse="top"` moves its rail above the main region.
