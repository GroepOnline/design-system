# Taste Rules — learned from Joep's reactions

> Distilled from `taste-log.md`. Binding for new work. Two observations minimum per rule.
> Last distilled: 2026-07-26 (seed rules from established preferences)

## Seed rules (from AGENTS.md + Signaal DESIGN.md + this session's briefs)

### color
- **DO** tint neutrals warm; one accent max. **DON'T** purple gradients, AI-glow, acid-on-black. *(seed: workspace AGENTS.md, Signaal bans)*
- **DO** light theme as first-class default. **DON'T** dark-only product surfaces. *(seed: Signaal "licht is standaard")*

### type
- **DO** Archivo/General Sans-class humanist sans for interface. **DON'T** Inter, Geist, Space Grotesk, decorative serifs. *(seed: Signaal + anti-slop)*
- **DO** mono strictly for data. **DON'T** mono for status labels or prose. *(seed: Signaal)*

### motion
- **DO** settle early; amplitude low, frequency low. **DON'T** bounce, elastic, infinite ambient motion. *(seed: Signaal motion contract)*
- **DO** one signature motion system per product (Current/Stroom). **DON'T** scattered micro-animations. *(seed: 2026-07-26 DESIGN.md approval)*

### density
- **DO** compact, information-dense tool surfaces (density 5–7). **DON'T** marketing-hero whitespace inside product. *(seed: Signaal density 7)*

### voice
- **DO** warm, direct, human Dutch on Joep-facing surfaces. **DON'T** em-dashes, buzzwords, lifecycle-jargon, fake metrics. *(seed: AGENTS.md)*

### structure
- **DO** hairlines + space for separation. **DON'T** cards-in-cards, bento farms, nested elevation. *(seed: Signaal)*
- **DO** two-lane sidebar grids with fixed glyph lane. **DON'T** ad-hoc paddings. *(seed: Signaal sidebar contract)*

### metaphor
- **DO** water/flow metaphors for system state (Stroom approved 2026-07-26). **DON'T** kitchen, receipt, brigade metaphors. *(seed: Signaal bans + this session)*
- **DO** instrument/tool framing ("sandblasted instrument" approved). **DON'T** corporate dashboard framing. *(seed: 2026-07-26)*

## Learned rules (from taste-log — none yet)

<!-- Rules land here after 2+ independent observations -->

### structure
- **DO** real SVG icons (Lucide/shadcn style, 1.5px stroke, 15-16px grid). **DON'T** emoji/emoticons as UI icons — not in buttons, badges, attachments, status, nowhere. *(2026-07-27: "geen emoticons"; consistent with workspace anti-slop stance)*
- **DO** shadcn/ui component conventions as baseline (button variants, badge pill, card border + hairline, ghost icon buttons). Devin's product UI is shadcn-shaped; Joep recognizes and prefers it. *(2026-07-27: "shadcn of soortgelijk gebruiken voor components van hun")*
- **DO** compose dashboard views from primitives (Sidebar + Card + Table + Chart), never hand-rolled. Data tables use zebra striping for scanability and inline color-coded badges for status. *(2026-07-31: dashboard table + shadcn skill install)*
- **DO** treat mobile (390px) as a first-class viewport: test every generated page at 390px next to light and dark before commit. **DON'T** let rails/navs collapse into unstructured wraps — mobile nav is a horizontal scroll-strip or a deliberate pattern, never an accidental flex-wrap jumble. *(2026-08-05: Joep "bovenin 1 zooi" op iPhone + Fase C responsive-eis)*

### direction
- **WIP (1 observation)**: Devin's visual language beats own new signatures — teal Stroom redirected toward Devin warm-neutral + blue. Watch: does De Stroom line/motion system survive as element, or fully absorbed into Devin-style rows? *(2026-07-27)*

### density & spacing
- **DO** default to `h28` and `r6` (via `--r-md`) for secondary controls (select, input, ghost-buttons, nav-items) in the primary skin to match Devin-DNA density. **DON'T** arbitrarily mix `h32` or hardcode radii where global tokens apply. *(2026-07-28: Devin-DNA Phase A finalized, strict alignment enforced)*
- **DO** use `r10` (via `--r-lg`) for primary cards and sub-grouped sections.
