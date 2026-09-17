#!/usr/bin/env python3
"""Zero-dependency accessibility audit for owned Signaal demos and patterns."""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOID = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.parent = parent
        self.children = []
        self.text = []

    def content(self):
        return " ".join(
            ("".join(self.text), *(c.content() for c in self.children))
        ).strip()


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                return

    def handle_data(self, data):
        self.stack[-1].text.append(data)


def walk(n):
    for c in n.children:
        yield c
        yield from walk(c)


def ancestor(n, tag):
    p = n.parent
    while p:
        if p.tag == tag:
            return True
        p = p.parent
    return False


def audit(path: Path):
    tree = Tree()
    tree.feed(path.read_text(errors="ignore"))
    nodes = list(walk(tree.root))
    issues = []
    label_for = {
        n.attrs.get("for") for n in nodes if n.tag == "label" and n.attrs.get("for")
    }
    ids = {n.attrs.get("id") for n in nodes if n.attrs.get("id")}

    def named(n):
        refs = (n.attrs.get("aria-labelledby") or "").split()
        return bool(
            n.attrs.get("aria-label")
            or n.content()
            or (refs and all(r in ids for r in refs))
        )

    for n in nodes:
        if n.tag == "img" and "alt" not in n.attrs:
            issues.append("img missing alt")
        if n.tag in {"input", "select", "textarea"}:
            typ = n.attrs.get("type", "text")
            if n.tag == "input" and typ in {
                "hidden",
                "button",
                "submit",
                "reset",
                "image",
            }:
                continue
            cid = n.attrs.get("id")
            if not (
                n.attrs.get("aria-label")
                or n.attrs.get("aria-labelledby")
                or (cid and cid in label_for)
                or ancestor(n, "label")
            ):
                issues.append(f"{n.tag} missing accessible label")
        if n.tag == "button" and not named(n):
            issues.append("button missing accessible name")
        if n.tag == "a" and n.attrs.get("href") and not named(n):
            issues.append("link missing accessible name")
        if (
            n.attrs.get("role") == "button"
            and n.tag not in {"button", "a", "input"}
            and "tabindex" not in n.attrs
        ):
            issues.append("role=button missing tabindex")
    return issues


def main():
    paths = sorted(ROOT.glob("components/*/self/*.html")) + sorted(
        ROOT.glob("patterns/*/example.html")
    )
    failures = []
    for p in paths:
        for issue in audit(p):
            failures.append((p.relative_to(ROOT), issue))
    for p, issue in failures:
        print(f"a11y: {p}: {issue}", file=sys.stderr)
    if failures:
        raise SystemExit(
            f"a11y: {len(failures)} issues across {len({p for p, _ in failures})} files"
        )
    print(f"a11y: 0 issues across {len(paths)} owned demos/patterns")


if __name__ == "__main__":
    main()
