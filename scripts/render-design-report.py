#!/usr/bin/env python3
"""Render the source-owned ChefGroep design report; no network or third-party modules."""
import argparse
import hashlib
import html
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ('executive-summary', 'at-a-glance', 'introduction', 'key-findings',
            'context-and-conditions', 'patterns-in-evidence', 'implications',
            'recommendations', 'conclusion', 'appendix', 'notes', 'sources')

def safe_link(value):
    parsed = urlsplit(value)
    if parsed.scheme not in ('', 'https') or value.startswith('//'):
        raise ValueError('Report links must be relative or HTTPS')
    return html.escape(value, quote=True)

def render(report):
    sections = report['sections']
    if tuple(section['id'] for section in sections) != SECTIONS:
        raise ValueError('Report must preserve the complete template section order')
    e = html.escape
    body = []
    for section in sections:
        parts = [f'<section id="{section["id"]}"><h2>{e(section["title"])}</h2>']
        parts += [f'<p>{e(p)}</p>' for p in section.get('paragraphs', [])]
        if section.get('items'):
            parts += ['<ul>' + ''.join(f'<li>{e(p)}</li>' for p in section['items']) + '</ul>']
        if section.get('table'):
            table = section['table']
            parts += ['<div class="table-scroll" tabindex="0" role="region" aria-label="' + e(section['title']) + '"><table><thead><tr>' + ''.join(f'<th scope="col">{e(v)}</th>' for v in table['headers']) + '</tr></thead><tbody>' + ''.join('<tr>'+''.join(f'<td>{e(v)}</td>' for v in row)+'</tr>' for row in table['rows']) + '</tbody></table></div>']
        for link in section.get('links', []):
            parts += [f'<p><a href="{safe_link(link["url"])}">{e(link["label"])}</a></p>']
        body.append(''.join(parts)+'</section>')
    figures = ''.join(f'<figure><img src="{safe_link(f["src"])}" alt="{e(f["alt"])}" width="{int(f["width"])}" height="{int(f["height"])}"><figcaption>{e(f["caption"])}</figcaption></figure>' for f in report.get('figures', []))
    nav = ''.join(f'<a href="#{s["id"]}">{e(s["title"])}</a>' for s in sections)
    css = (ROOT/'templates/design-report/report.css').read_text()
    return f'''<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#eaf1ec"><title>{e(report['title'])}</title><style>{css}</style><a class="skip" href="#content">Naar rapport</a><header><span class="wordmark" translate="no">ChefGroep.</span><span>Design standard / {e(report['date'])}</span></header><main id="content"><div class="cover"><p class="eyebrow">Design Report</p><h1>{e(report['title'])}</h1><p class="subtitle">{e(report['subtitle'])}</p><p class="status">{e(report['status'])}</p></div><div class="report-layout"><nav aria-label="Inhoudsopgave">{nav}</nav><article>{figures}{''.join(body)}</article></div></main><footer>{e(report['provenance'])}</footer></html>'''

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('source', type=Path)
    p.add_argument('--output', type=Path, required=True)
    args = p.parse_args()
    report = json.loads(args.source.read_text())
    output = render(report)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output)
    print(json.dumps({'output':str(args.output),'source_sha256':hashlib.sha256(args.source.read_bytes()).hexdigest(),'html_sha256':hashlib.sha256(output.encode()).hexdigest()}))
if __name__ == '__main__':
    main()
