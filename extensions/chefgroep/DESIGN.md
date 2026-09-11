# ChefGroep DESIGN overlay

Deze extension voegt ChefGroep-specifieke ontwerpregels toe bovenop root `DESIGN.md`. De Signaal-library blijft zelfstandig en kent ChefGroep niet als runtime dependency.

## Scope

- Geldt alleen wanneer een consumer expliciet `chefgroep` kiest.
- Geen componentcode of tokens dupliceren in deze map.
- Universele regels promoveren naar root `DESIGN.md`; ChefGroep-only regels blijven hier.

## ChefGroep-delta

- Productinterfaces mogen compact en operationeel zijn; marketingruimte hoort niet in tools.
- Bewijs, status en actuele werking zijn belangrijker dan decoratieve merkclaims.
- Interne namen zijn geen publieke navigatie tenzij het onderdeel zelf een publiek product is.
- Extensies blijven vervangbaar: geen ChefGroep-component mag een core Signaal-component verplicht maken voor de rest van de library.
