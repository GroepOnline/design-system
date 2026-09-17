# Search results

Category: `navigation`. This is a composition recipe, not a runtime dependency.

## Components
- `input`: `search-beam`
- `status`: `dot`
- `empty-state`: `action`
- `pagination`: `compact`

## Contract

- Reuse canonical component semantics; do not fork primitive code inside the pattern.
- Replace or omit optional pieces when the product does not need them.
- Product-specific copy, data and behavior remain owned by the consumer.
- Pattern choice never changes the dependency direction: consumer -> Signaal.
