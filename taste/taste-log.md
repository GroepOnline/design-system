# Taste Log — raw record of Joep's design reactions

> Append-only. Format defined in `SKILL.md`. Distill into `taste-rules.md` every ~10 entries
> or when a hypothesis repeats.

---

## 2026-07-26 · DESIGN.md "Stroom" (rebuild identity)
- **shown**: full design language — teal accent, General Sans, De Stroom signature, sandblasted radius scale, 5-motion budget
- **reaction**: approved
- **signal**: "ja volledig doen" after review of concept + signature
- **delta**: DESIGN.md locked as written
- **candidate rule**: water/flow metaphor for system state lands well; instrument framing ("sandblasted") approved → *promoted to seed rules (metaphor)*

## 2026-07-26 · Spinner ban in DESIGN.md
- **shown**: hard ban "no spinners anywhere"
- **reaction**: adjusted
- **signal**: "waarom geen spinners? dat heeft devin wel"
- **delta**: rule refined — global spinners banned (Current replaces), bounded local busy-states on the initiating control allowed
- **candidate rule**: Joep challenges absolute bans that cost usability; prefers precise scoping over blanket prohibition. *Watch for recurrence → structure category*

## 2026-07-27 · geen emoticons, shadcn-componenten
- **shown**: prototype v2 (Devin-richting, met 📋📄▶✋ emoji als iconen)
- **reaction**: gecorrigeerd
- **signal**: "geen emoticons evt. shadcn of soort gelijk gebruiken voor components van hun"
- **delta**: (1) NOOIT emoji/emoticons als UI-iconen — echte SVG iconen (Lucide-stijl, zoals shadcn). (2) Componenten volgen shadcn/ui conventies (button/badge/card/textarea) — Devin's UI ís shadcn-achtig
- **candidate rule**: emoji-ban uitbreiden van copy naar UI-iconen. shadcn/Radix als component-baseline. *→ direct naar taste-rules (structure)*

## 2026-07-27 · WEG VAN STROOM, richting Devin
- **shown**: Devin's live product-UI (sessie/composer/artifact-pane/pricing) naast ons Stroom prototype (teal accent, De Stroom lijn)
- **reaction**: redirect
- **signal**: "stappen van stroom af en gaan meer richting devin"
- **delta**: richtingsbeslissing — Devin's warme stille matte esthetiek (off-white, blauw #317CFF, grijze pills, bordered cards, 3-pane layout) wint van de teal Stroom-richting. OPEN: welke Stroom-elementen overleven (De Stroom lijn als subtiel element? motion-spec behouden?)
- **candidate rule**: Joep verkiest bewezen product-esthetiek (Devin) boven eigen nieuwe signatuur — *evidence over invention. Watch → metaphor category*

## 2026-07-26 · Devin direction for rebuild design
- **shown**: gap analysis + proposal to design toward Devin smoothness
- **reaction**: approved with emphasis
- **signal**: "25x meer smoothly > meer de kant van Devin op volledige skills voor perfected implementation"
- **delta**: motion quality became a first-class identity pillar (motion-spec.md exists because of this)
- **candidate rule**: motion polish is not optional garnish for Joep — it is core product value. *Watch for recurrence → motion category*

## 2026-07-27 · tweede stijl-skin (Strak)

- **shown**: design-system met één stijl (Devin-richting) + studio-presets
- **reaction**: "dit is 1 gehele stijl met paar opties maar je moet ook nog 1 hier overheen doen"
- **hypothesis**: het systeem moet meerdere COMPLETE skins dragen via een stijl-laag (data-style), niet alleen accent/radius-opties. Strak (koel, scherp, r4/6) is de tweede skin naast Devin (warm, zacht, r8/12)
- **status**: geïmplementeerd als data-style="strak" in tokens.css + switch in rail, propagateert naar alle variant-frames. Regel kandidaat bij herhaling

## 2026-07-28 · Devin-DNA propagatie volledig (Fase A)
- **shown**: afronding van de gemeten control-sizes: nav-items (13px/500, h28, pad 0 10 0 6), selects (h28), ghost-buttons (h28) en grouped cards (r10).
- **reaction**: gemodelleerd naar de Devin baseline via global tokens.
- **signal**: "moet specifieker volledig er gretiger" 
- **delta**: .select en .input expliciet 28px. .nav-item exacte afmetingen. Global tokens `--r-md` (werd 6px) en `--r-lg` (werd 10px) bijgewerkt om radii systemisch uit te rollen voor controls en cards in de default skin.
 - **candidate rule**: h28/r6 is de harde norm voor secundaire controls en densiteit-lijsten in de Devin-taal. Cards en sub-grouping opereren op r10. -> *Direct gepropageerd naar taste-rules.*

## 2026-07-31 · Dashboard table (compositie)
- **shown**: table component in playground, gepromoveerd via `ds add`, gecataloguseerd onder "bewijs"
- **reaction**: zebra striping `tr:nth-child(even)` en inline .badge (green/amber/red) voor status — scannen zonder klikken
- **signal**: "componeren uit primitives, niet opnieuw bedenken" + shadcn dashboard = Sidebar + Card + Table
- **delta**: nieuw table component met hairline borders, r-lg, zebra, hover states, monospace data
- **candidate rule**: Data-tabellen gebruiken zebra striping voor scanbaarheid en inline gekleurde badges voor status. Dashboard views componeren uit Sidebar + Card + Table primitives. *Watch for recurrence.*

## 2026-07-31 · Shadcn skill geinstalleerd
- **shown**: `npx skills find shadcn` → shadcn/ui@shadcn (260K installs, officieel)
- **reaction**: geïnstalleerd — principles toepasbaar op pure-HTML design system
- **signal**: shadcn's "compose, don't reinvent" en "semantic colors" bevestigen onze tokens.css aanpak
- **delta**: geen nieuwe code — bestaande patterns (badge, card, focus-visible) matcht shadcn conventies
- **candidate rule**: shadcn/ui compositie-pattern (Sidebar + Card + Table + Chart) is een vast handvat voor dashboard builds. Watch: zijn alle shadcn rules (gap-*, semantic colors, Skeleton) overal van toepassing?

## 2026-08-05 · Home v2: stil + mat, Current als signatuur
- **shown**: Fase C home met parallax-blobs/glow vs. nieuwe richting (gemaskeerd grid + verticale Current met pulse, solid topbar, live worked-row demo-band)
- **reaction**: redirect (2026-08-04, vastgelegd op branch `feat/ui-ux-polish-devin-signaal` + research-note "Web motion refs" met Joep-override)
- **signal**: "hero stil en mat — glow, parallax en em-dashes uit home" (commit 337c879); uitgewerkt in home v2 (commit 9b35de2)
- **delta**: (1) parallax/glow definitief uit home — de Current (motion-spec Motion 1) is het enige hero-signatuur; (2) glassmorphism-ban ook op marketing/catalogus gehandhaafd (topbar backdrop-blur → solid `var(--bg)`); (3) motion-spec §7 gehandhaafd: pulse animeert transform-only, geen `top`
- **candidate rule**: gegenereerde web-oppervlakken (home, gallery, docs) volgen dezelfde bans als het product (geen glow, glass, gradients, em-dashes). *Versterkt bestaande ban — geen nieuwe regel nodig.*

## 2026-08-05 · Mobiel: comp-card botsing + rail-zooi
- **shown**: home v2 + gallery op mobiel (390px, iPhone Safari via tailscale)
- **reaction**: gecorrigeerd — "dik gedrukte zit tegen dunne tekst zonder spatie of tab" en "bovenin ook 1 zooi"; expliciete kwaliteitslat-vraag: "zo ga je beginnen aan opencodex / chefgroep-os / vault?"
- **signal**: (1) comp-card naam (500) botste inline tegen beschrijving (faint) — geen layout-scheiding, alleen vertrouwd op markup-flow; (2) rail collapse op ≤860px werd een ongestructureerde flex-wrap jumble zonder categorie-context
- **delta**: `.cn`/`.cd` → `display: block` (tekstparen scheiden via layout, nooit via whitespace); mobiele rail → brand-rij met seg's rechts + horizontale scroll-chipstrip (`.rail-links`, nowrap, overflow-x, verborgen scrollbar); geverifieerd op 390px light+dark en desktop
- **candidate rule**: mobiel (390px) is first-class viewport — testen naast light/dark bij elke web-wijziging. *2e observatie (Fase C responsive-eis + deze correctie) → GEEPROMOVEERD naar taste-rules + AGENTS.md.* Tekstpaar-scheiding via layout: 1e observatie, watch.

## 2026-08-05 · Hero: van statisch naar Stroom-veld
- **shown**: home hero met faint grid + één dunne accent-lijn (1 lopende dot)
- **reaction**: gecorrigeerd — "ik wil echt iets indrukwekkends", daarna "kom op!"
- **signal**: statische grid + één 2px-lijn met dot leest als een wireframe, niet als een identiteit. De signatuur moet LEVEN: meerdere streams, echte aanwezigheid (secties reageren), en de beweging moet voelbaar zijn — niet half-invisible om 'subtiel' te blijven.
- **delta**: `.current` → `.stroom`-veld: streams op gridkolommen (main = accent-Current), seg-pulses als voelende werk-bursts, markers gekoppeld aan live sessie-teller (tool-calls), pointer-near highlight, klik-ripple langs dichtstbijzijnde stream. h1 78→92. Hero is nu wezenlijk aanwezig — geen wallpaper meer.
- **candidate rule**: zichtbare aanwezigheid > verstopte subtiliteit als het om identiteit gaat — een eerste-observatie die al gemarkeerd staat bij 'structure'; dit is de 2e, promoveer als: **DO** de signatuur-magnaam (Stroom/Current) LEVEN met meerdere kanalen en voelbare activiteit (pulses = werk, markers = events, near = aandacht). **DON'T** verzwakken tot een décoratief achtergrond-detail dat niemand ziet.
