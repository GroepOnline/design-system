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
  { label, className, children, ...props }, ref
) {
  return React.createElement("button", {
    ref, type: props.type || "button", "data-slot": "icon-button", "aria-label": label,
    className: cx("sg-icon-button", className), ...props,
  }, children);
});

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
