# Signaal extensions

De catalogus bevat alle componentvarianten. Extensions maken daar optionele, benoemde views van voor een organisatie, product of surface.

Belangrijk: de dependency-richting is altijd `consumer -> Signaal`. De core catalogus, tokens, build en tests importeren nooit een extension. Een extension kan dus verwijderd worden zonder de library te breken.

Elke extension heeft:

- `extension.json`: subset + preferred variant per component
- `DESIGN.md`: harde ontwerpdelta bovenop root `DESIGN.md`
- `TASTE.md`: scope-specifieke voorkeuren/observaties, niet universeel

Een extension bevat geen gekopieerde componentcode. Component-id's verwijzen naar de immutable catalogus onder `components/`.
