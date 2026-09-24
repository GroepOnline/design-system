# ChefGroep merk

Het merkteken is de 5×5 dot-matrix uit DESIGN.md §16: een "C" in inkt, de
overige punten als geest (10% inkt), en één blauw signaalpunt in de opening.
Het signaalpunt is het enige accent en neemt de plaats in van de punt uit het
oude woordmerk "ChefGroep.".

| Bestand | Gebruik |
| --- | --- |
| `chefgroep-mark.svg` | favicon, app-iconen, compacte headers |
| `chefgroep-mark-draw.svg` | eenmalige entree op wow-tier oppervlakken (auth-landing, app-library, onboarding) |
| `chefgroep-lockup.svg` | teken plus woordmerk in headers en op de site |

Regels:

- Kleuren komen uit `--text` en `--accent`; standalone vallen ze terug op de
  licht- en donkerwaarden uit `tokens.css`. Geen andere kleuren, geen verloop.
- Minimale grootte van het teken: 16px. Vrije ruimte rondom: één rastercel (8/40 van de hoogte).
- De tekenanimatie speelt één keer (lijn 1,3s, daarna punten en signaal),
  en is statisch bij `prefers-reduced-motion: reduce`.
- Het woordmerk gebruikt General Sans 500 met −2% tracking. Laad de lettertypes
  zelf; voor gebruik buiten een app moet de tekst nog naar paden worden omgezet.
