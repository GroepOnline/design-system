---
name: brain-decision-capture
description: Kiezen waar een bevinding landt in het design-system brain decision, brain research, of de bindende taste-loop.
domain: governance-meta
surfaces:
- design-system
triggers:
- decision
- besluit vastleggen
- taste-log
- propagatie
- waar leg ik dit vast
avoid_when:
- puur technische bugfix zonder ontwerpgevolg
risk: mutating
last_reviewed: '2026-07-30'
---

# Waar landt deze bevinding

Drie routes, één keuze. De verkeerde route maakt de vault een sluiproute om
`DESIGN.md`.

## Beslisboom

1. **Is het een reactie van Joep op visueel werk?**
   Ja, dan taste-log (`taste/taste-log.md`) via de `joep-design-taste` loop.
   Twee onafhankelijke observaties promoveren naar `taste/taste-rules.md`, en
   die propagatie raakt in dezelfde commit `DESIGN.md`, `tokens.css`,
   geraakte `components/` en `surfaces/`.

2. **Is het een keuze over structuur, tooling of proces?**
   Ja, dan `./ds brain new decision "titel"`. Denk aan: waar een laag hoort,
   welke CLI-vorm, welke grens tussen systemen.

3. **Is het onderzoek of een meting zonder besluit?**
   Ja, dan `./ds brain new research "titel"`. Verwijs naar `references/` en
   `DESIGN.md`; kopieer geen DNA in de vault.

4. **Is het een korte provenance-/gate-gebeurtenis zonder decision-note?**
   Ja, dan `./ds brain signal "…"`. Voorbeelden: eval faalde, candidate voor
   latere promote, handmatige observatie die nog geen taste-log-entry is.
   Geen auto-write op elke edit. Critical open signals (`gate_fail` of
   `score_hint < 0.4`) laten `ds brain gate` falen.

Twijfel tussen 1 en 2: als de uitkomst bepaalt hoe UI eruitziet, is het altijd
route 1. Een decision-note mag route 1 beschrijven, maar vervangt die nooit.
Signal is geen vervanging van taste-log of decision; het is de dunne log.
## Decision-note vullen

De template dwingt de velden af. Vul ze echt in, leeg is waardeloos:

- **Context**: welk probleem, welke staat was er
- **Keuze**: wat is besloten, in één zin
- **Gevolgen**: wat verandert er in bestanden, commando's of gewoontes
- **Productregel?** `nee`, of `ja` met de taste-loop-stap erbij

Sluit af met `## Links` naar `[[Decisions]]` en de geraakte concepten.

## Harde grens

Een `brain/Decisions/`-note overschrijft nooit `DESIGN.md`, `tokens.css` of
`components/*/catalog.json` direct. Een regel die alleen in de vault staat,
bindt niets. Wil je dat het bindt, gebruik route 1.

## Agent-gedrag (andere plane)

Hoe coding agents zich gedragen (commits, verbosity, zero-bloat) is **geen**
UI-taste en **geen** brain-decision in dit repo. Canonieke agent-taste leeft
buiten `design-system` (gedeeld punt, richting `kater-dev-tools`). Zie
`brain/Decisions/2026-07-30 Agent-taste buiten dit repo.md`.
