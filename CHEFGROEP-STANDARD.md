# ChefGroep product design standard

Joep accepted ChefGroep Auth as the design-quality reference in the 2026-09-12
continuation of the auth session. He explicitly retained logo, detail and motion
refinement. This establishes a quality floor and an identity reference, not a
claim that all authenticated flows or production acceptance are complete.

For ChefGroep products, use the ChefGroep extension by default. Match the surface
profile to the product's job. `identity-spatial` defines entry/consent/account
surfaces. Other products inherit authorship, complete states, semantic precision,
responsive care and verification; they do not inherit a mandatory literal portal.
`operator-dense` surfaces that summarize operational truth start from
`templates/operator-evidence/`; its evidence vector is a semantic provenance
pattern, not decorative product branding.

## What the standard requires

- A product-grounded visual thesis, a distinctive display/body pairing and a
  single justified signature. Typography and composition carry the design.
- Complete product pages: loading, empty, error, success, permission and recovery
  states belong to the design, as do sessions, security and connected apps.
- One canonical token path per product; shared controls with deliberate behavior.
  Every element deserves care, but not every text node needs an abstraction.
- Deliberate motion that settles, remains interruptible and never delays a choice.
  Reduced motion uses the static final composition. No unbounded decorative loops.
- Real desktop and phone renders, keyboard/focus checks and meaningful behavior
  verification. A passing build or screenshot alone is insufficient.
- Honest state: no fabricated identities, metrics, trust badges, customer proof,
  connection status or successful mutations.
- A full design report and source provenance for promoted reference templates.
  Human taste judgments remain named judgments, never machine-generated scores.

## Scope and precedence

`current user decision -> real domain/security/UX constraints -> product contract
-> surface -> ChefGroep extension -> selected profile -> generic Signaal defaults`.
The approved identity surface permits mineral/petrol/copper, Bricolage/Instrument
Sans and a translucent decorative portal. Those choices override older generic
blue/serif/no-gradient preferences within this scope. They do not license glass
controls, unreadable text, decorative status colors or weakened access decisions.

The generic catalog remains backward compatible. Existing locked component
variants are not overwritten. New variants keep lineage through the catalog CLI.

## Execute and verify

1. `./s.sh context chefgroep identity-spatial`
2. `python3 scripts/design-run.py prepare <new-run-dir> --product <name>`
3. Work through `chains/chefgroep-design.json`, keeping actual file evidence.
4. `python3 scripts/design-run.py advance <run-dir> <node> --evidence <file> --note <review>`
5. `./s.sh quality` and affected product checks, then real rendering/interaction.
6. Render a complete report from `templates/design-report/` and preserve limitations.

The Cursor context hook is advisory. `chefgroep-design-review.sh` is an executable
structural gate wired into quality, source lint/pre-push and GitHub validation.
No Codex-global hook support is claimed or invented. A prepared run is not proof
of automatic agent orchestration; the primary agent executes its nodes.

## Source and distribution

Canonical skills: `.agents/skills/`; shared procedure: `.agents/meta/`; chain:
`chains/`; assets and product rules: `extensions/chefgroep/`; templates: `templates/`.
Start at `templates/README.md` to choose the page entry point and portable files.
Both identity and operator contracts have executable renderers checked by the
same quality hook. Their examples are generated from those renderers.
Use `scripts/install-design-skills.py` for backed-up, hash-recorded adapters.
Consumers retain shipped copies and source hashes, with no cross-repo runtime
imports. Do not edit a vendor cache as the sole source of a design rule.

The complete evaluation is [ChefGroep Auth Design Report](reports/chefgroep-auth-2026-09-12/index.html).
