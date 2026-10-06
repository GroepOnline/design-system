# DSH DESIGN overlay

DSH gebruikt Signaal als optionele design-library, maar blijft eigenaar van zijn operator-canvas, layout, adapters en productcompositie.

## Scope

- Alleen actief wanneer een consumer expliciet `dsh` kiest.
- DSH mag surface-tokens overriden voor canvas, density en donkere operator-context.
- Gedeelde componentcontracten blijven product-agnostisch in Signaal.
- Geen DSH lifecycle-, sessie- of adapterlogica in de design-system library.

## DSH-delta

- Dark operator surface is toegestaan als product-specifieke surface, zolang contrast en focuscontracten behouden blijven.
- Motion, semantische statuskleuren, typografiecontracten en interactiestates komen bij voorkeur uit Signaal.
- Native/stock UI fallback blijft bruikbaar; een Signaal-extension mag geen functionele hard dependency worden.
