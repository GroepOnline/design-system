# OCX DESIGN overlay

OCX gebruikt Signaal als optionele design-library, maar de productcompositie wordt voor OCX visueel gekalibreerd op de huidige app.devin.ai product-UI.

Dit is een referentie voor density, hierarchy, shell, navigation en interaction restraint. Het is geen branding-copy: geen Devin-logo's, assets, teksten of 1-op-1 layouts overnemen.

## Scope

- Alleen actief wanneer een consumer expliciet `ocx` kiest.
- OCX blijft eigenaar van provider-, model-, traffic-, usage- en runtime-semantiek.
- Signaal blijft eigenaar van gedeelde primitives en interaction contracts.
- OCX mag dark operator-surface tokens overriden zonder een hard dependency op Signaal te creëren.

## Visuele richting

- Donkere, compacte operator-workspace.
- Flat surfaces en hairlines boven cards, shadows en elevation.
- Kleine radius; alleen waar een echte control of bounded surface dat nodig heeft.
- Navigatie en data krijgen meer gewicht dan decoratie.
- Typografie compact en rustig; mono alleen voor data, ids, modellen, timings en commands.
- Eén accentfamilie voor focus/selection; statuskleuren alleen semantisch.
- Tabellen, rows en split panes zijn primaire compositiepatronen.
- Mobile blijft dezelfde informatiehiërarchie houden, niet een aparte card-dashboardvariant.

## Motion

- Motion is functioneel: focus, selection, row-enter, panel transition en live state.
- Geen ambient beams, glow-loops, pulse-circussen of decoratieve infinite animation.
- Reduced-motion is volwaardig.

## Hard bans voor OCX

- Geen bento-dashboard met gelijkvormige cards.
- Geen gradients/glassmorphism/glow als stijlmiddel.
- Geen fake quality scores of samengestelde metrics zonder broncontract.
- Geen nested cards.
- Geen oversized marketing typography in operator-views.
- Geen sci-fi command-center esthetiek.
- Geen decorative terminal chrome.

## Overview compositie

De Overview moet in deze volgorde scanbaar zijn:

1. runtime health en versiecontext;
2. requests/tokens/cost als compacte topline;
3. traffic trend;
4. reliability/latency/error rates;
5. provider distribution;
6. attention/exceptions;
7. recent/live traffic.

Niet ieder blok hoeft een container. Gebruik sectiegrenzen, rows en tabellen waar dat sterker is.