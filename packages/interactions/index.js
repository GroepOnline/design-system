const noop = () => {};
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function attachPressRipple(element, { duration = 420 } = {}) {
  if (!element?.addEventListener) return noop;
  const onPress = (event) => {
    if (reduced() || typeof document === "undefined") return;
    const rect = element.getBoundingClientRect();
    const node = document.createElement("span");
    node.className = "btn-ripple-node";
    node.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
    node.style.setProperty("--ripple-duration", `${duration}ms`);
    element.append(node);
    node.addEventListener("animationend", () => node.remove(), { once: true });
  };
  element.addEventListener("pointerdown", onPress);
  return () => element.removeEventListener("pointerdown", onPress);
}

export function attachHoldConfirm(element, { duration = 900, onConfirm = noop } = {}) {
  if (!element?.addEventListener) return noop;
  let raf = 0, started = 0, active = false;
  const reset = () => { active = false; cancelAnimationFrame(raf); element.style.setProperty("--hold-progress", "0"); element.removeAttribute("data-holding"); };
  const tick = (now) => {
    if (!active) return;
    const progress = Math.min(1, (now - started) / duration);
    element.style.setProperty("--hold-progress", String(progress));
    if (progress >= 1) { reset(); element.setAttribute("data-confirmed", "true"); onConfirm(element); return; }
    raf = requestAnimationFrame(tick);
  };
  const start = (event) => { if (event.button != null && event.button !== 0) return; active = true; started = performance.now(); element.setAttribute("data-holding", "true"); raf = requestAnimationFrame(tick); };
  const onKeyDown = (event) => {
    if ((event.key === " " || event.key === "Enter") && !event.repeat && !active) { event.preventDefault(); start({ button: 0 }); }
  };
  const onKeyUp = (event) => { if (event.key === " " || event.key === "Enter") reset(); };
  element.addEventListener("pointerdown", start);
  element.addEventListener("keydown", onKeyDown);
  element.addEventListener("keyup", onKeyUp);
  ["pointerup","pointercancel","pointerleave"].forEach(type => element.addEventListener(type, reset));
  return () => {
    reset(); element.removeEventListener("pointerdown", start); element.removeEventListener("keydown", onKeyDown); element.removeEventListener("keyup", onKeyUp);
    ["pointerup","pointercancel","pointerleave"].forEach(type => element.removeEventListener(type, reset));
  };
}

export function attachCommandAck(element, { duration = 520 } = {}) {
  if (!element?.addEventListener) return noop;
  let timer = 0;
  const ack = () => { clearTimeout(timer); element.setAttribute("data-ack", "true"); timer = setTimeout(() => element.removeAttribute("data-ack"), duration); };
  element.addEventListener("click", ack);
  return () => { clearTimeout(timer); element.removeEventListener("click", ack); };
}
