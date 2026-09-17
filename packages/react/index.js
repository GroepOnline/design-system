import React from "react";

const cx = (...xs) => xs.filter(Boolean).join(" ");

export const Button = React.forwardRef(function Button(
  { variant = "default", size = "md", pending = false, className, disabled, children, ...props }, ref
) {
  return React.createElement("button", {
    ref, type: props.type || "button", "data-slot": "button", "data-variant": variant,
    "data-size": size, "data-pending": pending || undefined, "aria-busy": pending || undefined,
    className: cx("sg-button", className), disabled: disabled || pending, ...props,
  }, children);
});

export const IconButton = React.forwardRef(function IconButton(
  { label, variant = "ghost", pending = false, className, disabled, children, ...props }, ref
) {
  return React.createElement("button", {
    ref, type: props.type || "button", "data-slot": "icon-button", "data-variant": variant,
    "data-pending": pending || undefined, "aria-busy": pending || undefined, "aria-label": label,
    className: cx("sg-icon-button", className), disabled: disabled || pending, ...props,
  }, children);
});


export const MotionSurface = React.forwardRef(function MotionSurface(
  { as = "div", motion = "beam", active = false, className, children, ...props }, ref
) {
  const Tag = as;
  return React.createElement(Tag, {
    ref, "data-slot": "motion-surface", "data-motion": motion,
    "data-active": active ? "true" : undefined, className: cx(`sg-motion-${motion}`, className), ...props,
  }, children);
});

export function attachPressRipple(element) {
  if (!element || typeof element.addEventListener !== "function") return () => {};
  const onPointerDown = (event) => {
    if (typeof document === "undefined") return;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "sg-ripple";
    ripple.style.setProperty("--sg-ripple-x", `${event.clientX - rect.left}px`);
    ripple.style.setProperty("--sg-ripple-y", `${event.clientY - rect.top}px`);
    element.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  };
  element.addEventListener("pointerdown", onPointerDown);
  return () => element.removeEventListener("pointerdown", onPointerDown);
}

export const Badge = React.forwardRef(function Badge(
  { tone = "neutral", className, children, ...props }, ref
) {
  return React.createElement("span", { ref, "data-slot": "badge", "data-tone": tone, className: cx("sg-badge", className), ...props }, children);
});

export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return React.createElement("input", { ref, "data-slot": "input", className: cx("sg-input", className), ...props });
});

export const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return React.createElement("textarea", { ref, "data-slot": "textarea", className: cx("sg-textarea", className), ...props });
});

export const Select = React.forwardRef(function Select({ className, children, ...props }, ref) {
  return React.createElement("select", { ref, "data-slot": "select", className: cx("sg-select", className), ...props }, children);
});

export const InputGroup = React.forwardRef(function InputGroup({ className, children, ...props }, ref) {
  return React.createElement("div", { ref, "data-slot": "input-group", className: cx("sg-input-group", className), ...props }, children);
});

export const InputAffix = React.forwardRef(function InputAffix({ className, children, ...props }, ref) {
  return React.createElement("span", { ref, "data-slot": "input-affix", className: cx("sg-input-affix", className), ...props }, children);
});

function Choice({ type, label, description, className, inputClassName, ...props }, ref) {
  return React.createElement("label", { className: cx("sg-choice", className) },
    React.createElement("input", { ref, type, className: cx("sg-choice__control", inputClassName), ...props }),
    React.createElement("span", { className: "sg-choice__copy" },
      React.createElement("span", null, label),
      description ? React.createElement("small", null, description) : null
    )
  );
}
export const Checkbox = React.forwardRef((props, ref) => Choice({ ...props, type: "checkbox" }, ref));
export const Radio = React.forwardRef((props, ref) => Choice({ ...props, type: "radio" }, ref));

export const Switch = React.forwardRef(function Switch({ checked = false, onCheckedChange, onClick, className, disabled, ...props }, ref) {
  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (!event.defaultPrevented && !disabled && onCheckedChange) onCheckedChange(!checked);
  };
  return React.createElement("button", { ref, type: props.type || "button", role: "switch", "aria-checked": checked,
    "data-slot": "switch", className: cx("sg-switch", className), disabled, onClick: handleClick, ...props });
});

export function Field({ label, htmlFor, help, error, required = false, layout = "stacked", className, children, ...props }) {
  return React.createElement("div", { "data-slot": "field", "data-layout": layout, className: cx("sg-field", className), ...props },
    label ? React.createElement("label", { className: "sg-field__label", htmlFor }, label, required ? React.createElement("span", { className: "sg-field__required", "aria-hidden": "true" }, "*") : null) : null,
    React.createElement("div", null, children, error ? React.createElement("div", { className: "sg-field__error" }, error) : help ? React.createElement("div", { className: "sg-field__help" }, help) : null)
  );
}

export const Separator = React.forwardRef(function Separator({ orientation = "horizontal", className, ...props }, ref) {
  return React.createElement("div", { ref, role: "separator", "aria-orientation": orientation, "data-orientation": orientation, className: cx("sg-separator", className), ...props });
});

export function Alert({ tone = "neutral", className, children, ...props }) {
  return React.createElement("div", { role: "status", "data-slot": "alert", "data-tone": tone, className: cx("sg-alert", className), ...props }, children);
}

export function EmptyState({ title, description, action, className, ...props }) {
  return React.createElement("section", { "data-slot": "empty-state", className: cx("sg-empty", className), ...props },
    React.createElement("h2", { className: "sg-empty__title" }, title),
    description ? React.createElement("p", { className: "sg-empty__description" }, description) : null,
    action ? React.createElement("div", { className: "sg-empty__action" }, action) : null
  );
}

export function Activity({ state = "running", label, detail, elapsed, className, children, ...props }) {
  const live = state === "running" || state === "waiting" ? "polite" : "off";
  return React.createElement("div", { "data-slot": "activity", "data-state": state, "aria-live": live, className: cx("sg-activity", className), ...props },
    React.createElement("span", { className: "sg-activity__mark", "aria-hidden": "true" }),
    React.createElement("div", { className: "sg-activity__body" },
      React.createElement("div", { className: "sg-activity__line" },
        React.createElement("strong", null, label),
        elapsed != null ? React.createElement("span", { className: "sg-activity__time" }, elapsed) : null
      ),
      detail ? React.createElement("div", { className: "sg-activity__detail" }, detail) : null,
      children
    )
  );
}


export const Dialog = React.forwardRef(function Dialog({ className, children, ...props }, ref) {
  return React.createElement("dialog", { ref, "data-slot": "dialog", className: cx("sg-dialog", className), ...props }, children);
});
export const Sheet = React.forwardRef(function Sheet({ side = "right", className, children, ...props }, ref) {
  return React.createElement("dialog", { ref, "data-slot": "sheet", "data-side": side, className: cx("sg-sheet", className), ...props }, children);
});
export const Popover = React.forwardRef(function Popover({ popover = "auto", className, children, ...props }, ref) {
  return React.createElement("div", { ref, popover, "data-slot": "popover", className: cx("sg-popover", className), ...props }, children);
});
export const Menu = React.forwardRef(function Menu({ className, children, ...props }, ref) {
  return React.createElement("div", { ref, role: "menu", "data-slot": "menu", className: cx("sg-menu", className), ...props }, children);
});
export const MenuItem = React.forwardRef(function MenuItem({ tone = "default", className, children, ...props }, ref) {
  return React.createElement("button", { ref, type: props.type || "button", role: props.role || "menuitem", "data-tone": tone, "data-slot": "menu-item", className: cx("sg-menu-item", className), ...props }, children);
});
export const Tooltip = React.forwardRef(function Tooltip({ className, children, ...props }, ref) {
  return React.createElement("span", { ref, role: "tooltip", "data-slot": "tooltip", className: cx("sg-tooltip", className), ...props }, children);
});
export const TabList = React.forwardRef(function TabList({ variant = "line", className, children, ...props }, ref) {
  return React.createElement("div", { ref, role: "tablist", "data-variant": variant, "data-slot": "tabs", className: cx("sg-tabs", className), ...props }, children);
});
export const Tab = React.forwardRef(function Tab({ selected = false, className, children, ...props }, ref) {
  return React.createElement("button", { ref, type: props.type || "button", role: "tab", "aria-selected": selected, "data-slot": "tab", className: cx("sg-tab", className), ...props }, children);
});
export const Breadcrumb = React.forwardRef(function Breadcrumb({ label = "Breadcrumb", className, children, ...props }, ref) {
  return React.createElement("nav", { ref, "aria-label": label, "data-slot": "breadcrumb", className: cx("sg-breadcrumb", className), ...props }, children);
});
export const Pagination = React.forwardRef(function Pagination({ label = "Pagination", className, children, ...props }, ref) {
  return React.createElement("nav", { ref, "aria-label": label, "data-slot": "pagination", className: cx("sg-pagination", className), ...props }, children);
});
export const Toast = React.forwardRef(function Toast({ live = "polite", className, children, ...props }, ref) {
  return React.createElement("div", { ref, role: "status", "aria-live": live, "data-slot": "toast", className: cx("sg-toast", className), ...props }, children);
});
export const Progress = React.forwardRef(function Progress({ className, ...props }, ref) {
  return React.createElement("progress", { ref, "data-slot": "progress", className: cx("sg-progress", className), ...props });
});
export const Skeleton = React.forwardRef(function Skeleton({ width, height, className, style, ...props }, ref) {
  return React.createElement("div", { ref, "aria-hidden": "true", "data-slot": "skeleton", className: cx("sg-skeleton", className), style: { width, height, ...style }, ...props });
});


export const Avatar = React.forwardRef(function Avatar({ src, alt = "", fallback, size = "md", tone = "neutral", className, children, ...props }, ref) {
  return React.createElement("span", { ref, "data-slot": "avatar", "data-size": size, "data-tone": tone, className: cx("sg-avatar", className), ...props }, src ? React.createElement("img", { src, alt }) : (fallback ?? children));
});
export const AvatarStack = React.forwardRef(function AvatarStack({ className, children, ...props }, ref) {
  return React.createElement("div", { ref, "data-slot": "avatar-stack", className: cx("sg-avatar-stack", className), ...props }, children);
});
export function Metric({ label, value, meta, className, ...props }) {
  return React.createElement("div", { "data-slot": "metric", className: cx("sg-metric", className), ...props },
    React.createElement("span", { className: "sg-metric__label" }, label),
    React.createElement("strong", { className: "sg-metric__value" }, value),
    meta != null ? React.createElement("span", { className: "sg-metric__meta" }, meta) : null);
}
export const KeyValue = React.forwardRef(function KeyValue({ className, children, ...props }, ref) {
  return React.createElement("dl", { ref, "data-slot": "key-value", className: cx("sg-kv", className), ...props }, children);
});
export const Status = React.forwardRef(function Status({ tone = "neutral", dot = false, className, children, ...props }, ref) {
  return React.createElement("span", { ref, "data-slot": "status", "data-tone": tone, "data-dot": dot || undefined, className: cx("sg-status", className), ...props }, children);
});
export const CodeBlock = React.forwardRef(function CodeBlock({ language, className, children, ...props }, ref) {
  return React.createElement("div", { ref, "data-slot": "code", className: cx("sg-code", className), ...props },
    language ? React.createElement("div", { className: "sg-code__head" }, language) : null,
    React.createElement("pre", null, React.createElement("code", null, children)));
});
export const Diff = React.forwardRef(function Diff({ label = "Diff", className, children, ...props }, ref) {
  return React.createElement("pre", { ref, "aria-label": label, "data-slot": "diff", className: cx("sg-diff", className), ...props }, children);
});
export const Timeline = React.forwardRef(function Timeline({ className, children, ...props }, ref) {
  return React.createElement("ol", { ref, "data-slot": "timeline", className: cx("sg-timeline", className), ...props }, children);
});
export const DataGrid = React.forwardRef(function DataGrid({ label, className, children, ...props }, ref) {
  return React.createElement("div", { "data-slot": "data-grid-wrap", className: "sg-data-grid-wrap" },
    React.createElement("table", { ref, "aria-label": label, "data-slot": "data-grid", className: cx("sg-data-grid", className), ...props }, children));
});

function LayoutPrimitive({ as = "div", slot, className, children, ...props }, ref) {
  const Tag = as;
  return React.createElement(Tag, { ref, "data-slot": slot, className, ...props }, children);
}
export const Stack = React.forwardRef(function Stack({ as = "div", gap = "md", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "stack", "data-gap": gap, className: cx("sg-stack", className), children, ...props }, ref);
});
export const Cluster = React.forwardRef(function Cluster({ as = "div", justify = "start", align = "center", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "cluster", "data-justify": justify, "data-align": align, className: cx("sg-cluster", className), children, ...props }, ref);
});
export const Grid = React.forwardRef(function Grid({ as = "div", columns = "auto", min = "220px", className, style, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "grid", "data-columns": columns, className: cx("sg-grid", className), style: { "--sg-grid-min": min, ...style }, children, ...props }, ref);
});
export const Page = React.forwardRef(function Page({ as = "main", size = "default", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "page", "data-size": size, className: cx("sg-page", className), children, ...props }, ref);
});
export const Section = React.forwardRef(function Section({ as = "section", divided = false, className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "section", "data-divided": divided || undefined, className: cx("sg-section", className), children, ...props }, ref);
});
export const SplitPane = React.forwardRef(function SplitPane({ as = "div", variant = "balanced", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "split-pane", "data-variant": variant, className: cx("sg-split-pane", className), children, ...props }, ref);
});
export const AppShell = React.forwardRef(function AppShell({ as = "div", collapse = "top", railWidth = "220px", className, style, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "app-shell", "data-collapse": collapse, className: cx("sg-app-shell", className), style: { "--sg-rail-width": railWidth, ...style }, children, ...props }, ref);
});
export const AppShellRail = React.forwardRef(function AppShellRail({ as = "aside", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "app-shell-rail", className: cx("sg-app-shell__rail", className), children, ...props }, ref);
});
export const AppShellMain = React.forwardRef(function AppShellMain({ as = "main", className, children, ...props }, ref) {
  return LayoutPrimitive({ as, slot: "app-shell-main", className: cx("sg-app-shell__main", className), children, ...props }, ref);
});
