# playground — vrije experimentruimte

Hier mag alles. Oefensessies, variant-probeersels, verkenningen.
**Niets hier is vast en niets hier raakt de catalogus.**

## De regel

```
playground/   vrij, tijdelijk, wegwerpbaar
     ↓  alleen via: ./ds <component> add playground/<bestand>.html
components/   catalogus, VAST, verandert alleen via ds select/remove
```

Een oefensessie kan het systeem nooit verneuken: de catalogus accepteert
alleen expliciete toevoegingen via de CLI.

## Promoveren

```bash
./ds button add playground/mijn-variant.html --id mijn-variant --origin self --note "wat het is"
# externe referentie:
./ds button add playground/hun-knop.html --id hun-knop --origin external --source "shadcn/ui" --note "geobserveerd"
```

Daarna staat hij VAST in de catalogus. Selecteren voor gebruik:

```bash
./ds button select mijn-variant
```

## Conventies

- Bestanden hier gebruiken relatieve paden (`../tokens.css`); `ds add` maakt ze
  bij het promoveren automatisch root-absoluut.
- Ruim op: wat gepromoveerd is mag hier weg.
