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
