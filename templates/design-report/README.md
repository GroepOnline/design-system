# ChefGroep Design Report template

The vendor `external/reference.docx` and `preview.png` are retained unchanged.
Their source and SHA-256 values are in `provenance.json`. Do not publish the vendor
placeholder text as report content. The user explicitly requested adaptation to
the ChefGroep Auth design language, so `report.css` is the owned HTML/print style.

The canonical example source is `reports/chefgroep-auth-2026-09-12/report.json`.
Keep all twelve sections from `report.schema.json`, replace content from current
sources, then run `scripts/render-design-report.py`. Inspect desktop, phone and
print. PDF/DOCX exports need their own actual renderer and verification; HTML is
never renamed to imply another file format.
