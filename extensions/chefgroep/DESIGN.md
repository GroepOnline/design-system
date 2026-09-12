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

## Identity surfaces: locked direction

Voor auth, consent, invitation en account-entry combineert ChefGroep deze extension met het optionele profiel `identity-spatial`. `surfaces/auth-landing.md` is de bindende surface-brief.

### Productwereld

ChefGroep Auth is een **entrance product**. De gebruiker arriveert in een herkenbare ruimte en maakt vervolgens een expliciete identity- of permission-keuze. De visuele signature is een sculpturale toegangspoort van transparante lagen en een koperen kern. De signature mag indrukwekkend zijn, maar de authbeslissing heeft altijd de hoogste cognitieve prioriteit.

### Palette voor ChefGroep Auth

De geaccepteerde baseline uit de 2026-09-11 run is:

- canvas `#EAF1EC`
- paper `#F8FAF6`
- ink `#103D3B`
- muted `#566D67`
- brand `#176857`
- copper `#AE4E32`
- line `#C5D3CA`

Productcode mag deze waarden als semantische runtime-tokens bezitten. De design-system extension beschrijft de keuze; zij wordt geen runtime dependency van `chefgroep-auth`.

### Typography

- Display: `Bricolage Grotesque Variable`
- Body/product: `Instrument Sans Variable`

Zelf hosten of via een gepinde package. Geen late webfont-swap die authcontrols verplaatst.

### Registers

- Landing/sign-in: asymmetrisch, ruim, één dominante signature, weinig chrome.
- Consent/connect: dezelfde productwereld, met client/resource/account/scopes als primaire informatie.
- Account/sessions/security/connections: kalme paper-surfaces, editorial headers, duidelijke groepering en compacte maar comfortabele data-rows.
- Errors/revocation/security: semantische helderheid wint van expressieve styling.

### Reference evidence

De geaccepteerde desktop- en mobile-renders staan in `references/auth-astra-2026-09-11/`. Gebruik ze als kalibratie voor verhouding, auteurschap en restraint. Ze zijn geen verplicht pixelcontract voor andere ChefGroep-producten.

## Default quality standard across ChefGroep

`CHEFGROEP-STANDARD.md` applies to every ChefGroep product design task. The exact
identity palette/signature remains scoped to auth-like surfaces; other products
choose a domain-specific signature and the right operational density. The
quality of whole pages, real states, typography, motion, accessibility and
verification is shared. Logo refinement uses `assets/identity-mark.svg`; the
three planes are a brand mark, never a live system-status legend.

Identity permits decorative material gradients inside its isolated portal.
Controls remain readable, matte and semantically colored. This explicit surface
choice supersedes the generic no-gradient/blue-only rules for the illustration.
