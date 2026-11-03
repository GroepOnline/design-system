# UI showcase evidence policy

Applies to every active GroepOnline/ChefGroep repository and every pull request with visual changes to web, desktop, mobile screens, layout, icons/SVGs and other visible assets.

## Author contract

- Embed at least one actual screenshot in a section named ## UI showcase in the PR body, using Markdown image syntax or an HTML img element. A gallery HTML link, unrendered SVG, code path, checkbox or CI artifact alone is not a screenshot.
- Show before/after for changes to existing interfaces when useful, a final screenshot for new features and a rendered contact sheet for icon sets. Show light/dark and narrow/wide viewports when relevant.
- Capture a real running app, device/simulator, or browser-rendered static preview. No fabricated or AI-generated mockups presented as runtime screenshots. State the route, viewport, command and commit/build used.
- Embed a GitHub screenshot attachment or actual PNG/WebP file committed in the PR; redact secrets, personal and customer data. Avoid huge binaries.
- Accessibility-only UI updates still require a screenshot of the tested screen and an explanation when the appearance is intentionally unchanged.
- Screenshot evidence never substitutes for CI, security review, deployment or acceptance evidence.

## Enforceable check

Use the read-only reusable workflow at GroepOnline/design-system/.github/workflows/ui-showcase-reusable.yml@main. Caller repos opt in via their own workflow; an organization-wide required-workflow ruleset can enforce it across all repos once verified. It inspects changed file paths and requires an embedded image in the correct section for UI changes, without checking out untrusted code. Non-UI changes pass.

Reviewers verify screenshots truly represent the code and states being changed. A presence check cannot prove authenticity.

GroepOnline/.github remains private; GitHub does NOT inherit community health PR templates from private org .github repositories. Repo-local templates work. Never make the org repository public without security review and an explicit visibility decision.

Do not bypass by renaming UI paths or writing not applicable. Production and release holds remain unchanged.

Canonical source: the public `GroepOnline/design-system` repository. Public and private GroepOnline repositories can call this workflow. The private `.github` repository stores reference organizational policy and templates.
