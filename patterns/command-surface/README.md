# Command surface

Category: `workflow`. This is a composition recipe, not a runtime dependency.

## Components
- `input`: `search`
- `menu`: `default`
- `button`: `command-ack`, `with-kbd`

## Contract

- Reuse canonical component semantics; do not fork primitive code inside the pattern.
- Replace or omit optional pieces when the product does not need them.
- Product-specific copy, data and behavior remain owned by the consumer.
- Pattern choice never changes the dependency direction: consumer -> Signaal.
