# OCX component contract

OCX pages are compositions of components. Page-level code owns data wiring, routing and layout only.

## Hard rule

Every visible or interactive semantic element MUST be a named component. Bare `div`, `span`, `table`, `button`, `input` and similar elements are allowed only inside component implementations or as layout-only wrappers with no product meaning.

This does not mean every component belongs in generic Signaal core. The split is:

1. **Signaal generic components** — reusable across products.
2. **OCX composites** — product-specific compositions built from generic Signaal components.
3. **Page composition** — layout + data only; no bespoke visual controls.

## Signaal generic component families required by OCX

### Actions
- `Button`
- `IconButton`
- `TextAction`
- `ButtonGroup`
- `KbdHint`

### Navigation / shell
- `AppShell`
- `Topbar`
- `Sidebar`
- `SidebarGroup`
- `NavItem`
- `WorkspaceSwitcher`
- `PageHeader`
- `SectionHeader`
- `SplitPane`
- `InspectorPane`

### Data display
- `Metric`
- `MetricGroup`
- `Status`
- `StatusDot`
- `Sparkline`
- `ProgressTrack`
- `DataList`
- `DataRow`
- `DataTable`
- `KeyValueList`
- `KeyValueRow`
- `Timestamp`
- `CodeValue`

### Input / filters
- `Input`
- `SearchInput`
- `Select`
- `FilterBar`
- `ToggleGroup`
- `Switch`

### Feedback / states
- `Notice`
- `AttentionRow`
- `EmptyState`
- `ErrorState`
- `ActivityState`
- `Skeleton`

### Overlays
- `Tooltip`
- `Popover`
- `Sheet`
- `Dialog`
- `CommandMenu`

## OCX composite components

These stay product-specific and must not become Signaal core:

- `RuntimeSummary`
- `ProviderHealthRow`
- `ProviderUsageRow`
- `RequestActivityRow`
- `UsageSummary`
- `ReliabilitySummary`
- `QuotaPressureRow`
- `OAuthHealthRow`
- `ModelRouteRow`
- `RequestInspector`
- `ProviderInspector`

Each OCX composite must be composed only from generic components plus data formatting helpers.

## Overview page target

```tsx
<OCXShell>
  <OCXSidebar />
  <Page>
    <PageHeader />
    <RuntimeSummary />
    <MetricGroup />
    <ReliabilitySummary />
    <ProviderList />
    <RequestActivityList />
  </Page>
  <InspectorPane />
</OCXShell>
```

The page itself must not define a bespoke button, status pill, metric tile, table row, inspector field, empty state, section header or loading treatment.

## Definition of done

A redesign is not accepted when it only looks coherent. It is accepted when:

- every visible semantic element maps to a named component;
- components have explicit states and variants;
- keyboard/focus/reduced-motion behavior belongs to the component, not the page;
- mobile behavior belongs to shell/layout components, not ad-hoc page CSS;
- loading/empty/error/degraded states use shared state components;
- OCX-specific domain meaning lives in composites, never generic Signaal primitives;
- a page can be restyled by changing components/tokens without rewriting page markup.
