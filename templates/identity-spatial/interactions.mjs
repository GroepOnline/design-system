/** Product-owned validation sets aria-invalid; this helper moves focus only. */
export function focusFirstInvalid(form) {
  const invalid = form.querySelector(
    'input[aria-invalid="true"]:not(:disabled), select[aria-invalid="true"]:not(:disabled), textarea[aria-invalid="true"]:not(:disabled)',
  );
  if (invalid instanceof HTMLElement) {
    invalid.focus();
    return true;
  }
  return false;
}

/** Native dialog containment; consumer promise is the mutation truth boundary. */
export function bindConfirm(dialog, { onConfirm }) {
  if (typeof onConfirm !== "function")
    throw new TypeError("Confirm requires a mutation callback");
  if (!(dialog instanceof HTMLDialogElement))
    throw new TypeError("Expected a dialog");
  const cancel = dialog.querySelector('[data-action="cancel"]');
  const confirm = dialog.querySelector('[data-action="confirm"]');
  const failure = dialog.querySelector("[data-confirm-error]");
  const progress = dialog.querySelector("[data-confirm-pending]");
  if (
    !(cancel instanceof HTMLButtonElement) ||
    !(confirm instanceof HTMLButtonElement) ||
    !(failure instanceof HTMLElement) ||
    !(progress instanceof HTMLElement)
  )
    throw new TypeError("Incomplete Confirm markup");
  const controller = new AbortController();
  let pending = false;
  let disposed = false;
  let trigger = null;
  const setPending = (value) => {
    pending = value;
    cancel.disabled = value;
    confirm.disabled = value;
    confirm.setAttribute("aria-busy", String(value));
    const cue = confirm.querySelector("[data-busy]");
    if (cue instanceof HTMLElement) cue.dataset.busy = String(value);
    progress.hidden = !value;
    if (value) dialog.focus();
  };
  cancel.addEventListener(
    "click",
    () => {
      if (!pending) dialog.close();
    },
    { signal: controller.signal },
  );
  dialog.addEventListener(
    "cancel",
    (event) => {
      if (pending) event.preventDefault();
    },
    { signal: controller.signal },
  );
  // Native modality makes the page inert; keep Tab on the two owned actions.
  dialog.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Tab") return;
      if (pending) {
        event.preventDefault();
        return;
      }
      if (!event.shiftKey && document.activeElement === confirm) {
        event.preventDefault();
        cancel.focus();
      } else if (event.shiftKey && document.activeElement === cancel) {
        event.preventDefault();
        confirm.focus();
      }
    },
    { signal: controller.signal },
  );
  dialog.addEventListener(
    "close",
    () => {
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    },
    { signal: controller.signal },
  );
  confirm.addEventListener(
    "click",
    async () => {
      if (pending) return;
      failure.hidden = true;
      failure.textContent = "";
      setPending(true);
      try {
        const operation = onConfirm();
        if (!operation || typeof operation.then !== "function")
          throw new TypeError("Confirmation must return a promise");
        await operation;
        if (!disposed) {
          setPending(false);
          dialog.close();
        }
      } catch (error) {
        if (!disposed) {
          setPending(false);
          failure.textContent =
            error instanceof Error
              ? error.message
              : "De wijziging is niet bevestigd. Probeer opnieuw.";
          failure.hidden = false;
          cancel.focus();
        }
      }
    },
    { signal: controller.signal },
  );
  return {
    open() {
      if (disposed) throw new Error("Confirm binding was disposed");
      if (dialog.open) return;
      trigger = document.activeElement;
      failure.hidden = true;
      failure.textContent = "";
      setPending(false);
      dialog.showModal();
      cancel.focus();
    },
    destroy() {
      disposed = true;
      dialog.close();
      controller.abort();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    },
  };
}
