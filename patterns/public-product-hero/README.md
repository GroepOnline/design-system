# Public product hero

Category: `public`. This is a composition recipe, not a runtime dependency.

## Components
- `button`: `beam-cta`, `sweep-cta`
- `motion`: `beam`
- `status`: `default`
- `artifact`: `default`

## Contract

- Reuse canonical component semantics; do not fork primitive code inside the pattern.
- Replace or omit optional pieces when the product does not need them.
- Product-specific copy, data and behavior remain owned by the consumer.
- Pattern choice never changes the dependency direction: consumer -> Signaal.
