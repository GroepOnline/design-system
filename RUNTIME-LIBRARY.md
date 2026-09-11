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
