import { bindConfirm, focusFirstInvalid } from "./interactions.mjs";

const form = document.querySelector("#example-form");
const field = document.querySelector("#example-name");
const validate = document.querySelector("#validate-example");
if (
  !(field instanceof HTMLInputElement) ||
  !(validate instanceof HTMLButtonElement)
)
  throw new Error("Incomplete field example");
validate.disabled = false;
validate.addEventListener("click", () => {
  const invalid = !field.value.trim();
  field.setAttribute("aria-invalid", String(invalid));
  field.setAttribute(
    "aria-describedby",
    invalid ? "example-name-hint example-name-error" : "example-name-hint",
  );
  document.querySelector("#validation-result").textContent = "";
  const error = document.querySelector("#example-name-error");
  if (error instanceof HTMLElement) error.hidden = !invalid;
  if (invalid) focusFirstInvalid(form);
  else
    document.querySelector("#validation-result").textContent =
      "Voorbeeld gecontroleerd. Er zijn geen gegevens opgeslagen.";
});
form.addEventListener("submit", (event) => event.preventDefault());

for (const [buttonId, dialogId] of [
  ["connection-revoke", "connection-confirm"],
  ["session-revoke", "session-confirm"],
]) {
  const trigger = document.getElementById(buttonId);
  const modal = bindConfirm(document.getElementById(dialogId), {
    onConfirm: () =>
      new Promise((resolve, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                "Voorbeeldfout: de wijziging is niet bevestigd. Probeer opnieuw of annuleer.",
              ),
            ),
          250,
        );
      }),
  });
  if (!(trigger instanceof HTMLButtonElement))
    throw new Error("Missing confirmation trigger");
  trigger.disabled = false;
  trigger.addEventListener("click", () => modal.open());
}
