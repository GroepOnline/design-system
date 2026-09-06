from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIB = ROOT / "library"
REGISTRY = LIB / "registry.json"
IMPORTED = LIB / "imported.jsonl"

COMPONENTS = [
    "button", "icon-button", "split-button", "chip", "badge", "card", "stat-card", "command-item",
    "input", "textarea", "select", "toggle", "switch", "checkbox", "radio", "slider", "tabs", "segmented",
    "breadcrumb", "pagination", "menu-item", "popover", "tooltip", "toast", "modal", "drawer", "table-row",
    "list-row", "nav-item", "sidebar-item", "avatar", "progress", "loader", "timeline", "accordion", "empty-state",
]
STYLES = ["plain", "outline", "inverse", "soft", "inset", "raised", "rounded", "square", "pill", "terminal"]
COMPONENT_MOTIONS = ["still", "press", "lift", "spring"]
MOTION_TYPES = [
    "hover-lift", "press-compress", "magnetic-follow", "cursor-repel", "spring-follow", "snap", "overshoot",
    "fade", "slide-x", "slide-y", "scale", "flip", "reveal-mask", "stagger", "drag-inertia", "tilt",
]
EASINGS = ["linear", "ease-out", "ease-in-out", "spring-soft", "spring-tight"]
DURATIONS = [140, 220, 360]
TRANSITIONS = ["crossfade", "slide-x", "slide-y", "scale", "wipe", "clip", "shared-axis", "drawer", "sheet", "morph"]
TRANSITION_SPEEDS = ["fast", "normal", "slow", "cinematic"]
TRANSITION_DIRECTIONS = ["forward", "back", "bidirectional"]
SCENES_3D = ["orbit", "particle-field", "wireframe", "grid-plane", "torus", "cube", "card-tilt", "sphere", "point-cloud", "ribbons", "camera-pan", "parallax-depth"]
RENDER_3D = ["points", "wire", "solid", "lines", "mono"]
COMPOSITIONS = ["auth-panel", "command-center", "chat-shell", "settings-page", "review-screen", "dashboard", "data-table-page", "empty-state-page", "onboarding", "pricing", "profile", "search-results", "library-browser", "notification-center", "agent-run", "approval-flow", "file-browser", "timeline-view", "kanban", "terminal-workbench", "analytics-panel", "media-gallery", "checkout", "docs-layout"]
COMPOSITION_STYLES = ["clean", "compact", "split", "centered", "sidebar"]


def slug(*parts: object) -> str:
    return "-".join(str(p).lower().replace("_", "-").replace(" ", "-") for p in parts)


def load_imported() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    if not IMPORTED.exists():
        return rows
    for line_no, line in enumerate(IMPORTED.read_text(encoding="utf-8").splitlines(), start=1):
        line = line.strip()
        if not line:
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid imported.jsonl line {line_no}: {exc}") from exc
        row.setdefault("status", "imported")
        row.setdefault("source", "external-import")
        rows.append(row)
    return rows


def build_registry() -> dict[str, object]:
    items: list[dict[str, object]] = []
    seq = 1
    for family in COMPONENTS:
        for style in STYLES:
            for motion in COMPONENT_MOTIONS:
                items.append({
                    "id": f"c-{seq:04d}-{slug(family, style, motion)}",
                    "domain": "components", "family": family, "style": style, "motion": motion,
                    "title": f"{family.replace('-', ' ').title()} · {style} · {motion}",
                    "tags": [family, style, motion, "generated-specimen"],
                    "renderer": {"kind": "component", "family": family, "style": style, "motion": motion},
                    "status": "specimen", "source": "combinatorial-seed-v1",
                })
                seq += 1
    for family in COMPOSITIONS:
        for style in COMPOSITION_STYLES:
            items.append({
                "id": f"x-{seq:04d}-{slug(family, style)}",
                "domain": "compositions", "family": family, "style": style, "motion": "still",
                "title": f"{family.replace('-', ' ').title()} · {style}",
                "tags": [family, style, "composition", "layout"],
                "renderer": {"kind": "composition", "family": family, "style": style},
                "status": "specimen", "source": "composition-seed-v1",
            })
            seq += 1
    for motion in MOTION_TYPES:
        for easing in EASINGS:
            for duration in DURATIONS:
                items.append({
                    "id": f"m-{seq:04d}-{slug(motion, easing, duration)}",
                    "domain": "motion", "family": motion, "style": easing, "motion": motion,
                    "title": f"{motion.replace('-', ' ').title()} · {easing} · {duration}ms",
                    "tags": [motion, easing, f"{duration}ms", "interaction"],
                    "renderer": {"kind": "motion", "motion": motion, "easing": easing, "duration": duration},
                    "status": "specimen", "source": "motion-matrix-v1",
                })
                seq += 1
    for transition in TRANSITIONS:
        for speed in TRANSITION_SPEEDS:
            for direction in TRANSITION_DIRECTIONS:
                items.append({
                    "id": f"t-{seq:04d}-{slug(transition, speed, direction)}",
                    "domain": "transitions", "family": transition, "style": speed, "motion": direction,
                    "title": f"{transition.replace('-', ' ').title()} · {speed} · {direction}",
                    "tags": [transition, speed, direction, "transition"],
                    "renderer": {"kind": "transition", "transition": transition, "speed": speed, "direction": direction},
                    "status": "specimen", "source": "transition-matrix-v1",
                })
                seq += 1
    for scene in SCENES_3D:
        for render in RENDER_3D:
            items.append({
                "id": f"d-{seq:04d}-{slug(scene, render)}",
                "domain": "3d", "family": scene, "style": render, "motion": "orbit",
                "title": f"{scene.replace('-', ' ').title()} · {render}",
                "tags": [scene, render, "threejs", "webgl"],
                "renderer": {"kind": "3d", "scene": scene, "render": render},
                "status": "specimen", "source": "three-study-seed-v1",
            })
            seq += 1
    imported = load_imported()
    items.extend(imported)
    domains = Counter(str(item["domain"]) for item in items)
    payload = {
        "schema_version": 1,
        "generated": True,
        "generated_count": len(items) - len(imported),
        "imported_count": len(imported),
        "count": len(items),
        "domains": dict(sorted(domains.items())),
        "facets": {
            "component_families": COMPONENTS,
            "styles": STYLES,
            "component_motions": COMPONENT_MOTIONS,
            "motion_types": MOTION_TYPES,
            "easings": EASINGS,
            "transitions": TRANSITIONS,
            "scenes_3d": SCENES_3D,
            "compositions": COMPOSITIONS,
            "composition_styles": COMPOSITION_STYLES,
        },
        "items": items,
    }
    return payload


def main() -> None:
    LIB.mkdir(parents=True, exist_ok=True)
    payload = build_registry()
    REGISTRY.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"library registry: {payload['count']} specimens")
    for domain, count in payload["domains"].items():
        print(f"  {domain}: {count}")


if __name__ == "__main__":
    main()
