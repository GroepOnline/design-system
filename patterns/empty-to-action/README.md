# Empty to action

Category: `feedback`. This is a composition recipe, not a runtime dependency.

## Components
- `empty-state`: `action`
- `button`: `primary`

## Contract

- Reuse canonical component semantics; do not fork primitive code inside the pattern.
- Replace or omit optional pieces when the product does not need them.
- Product-specific copy, data and behavior remain owned by the consumer.
- Pattern choice never changes the dependency direction: consumer -> Signaal.
