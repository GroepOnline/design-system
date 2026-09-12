import { stateMarkup } from "./specimen.mjs";

const example = document.querySelector("#state-example");
const choices = document.querySelector(".state-selector");

function show(kind) {
  // stateMarkup emits only product-owned markup and escaped copy.
  example.innerHTML = stateMarkup(kind);
}
choices.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) show(event.target.value);
});
example.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("#retry")) {
    const loading = choices.querySelector('[value="loading"]');
    if (!(loading instanceof HTMLInputElement))
      throw new Error("Missing loading choice");
    loading.checked = true;
    show("loading");
    loading.focus();
  }
});

// Enable retry only after its handler exists; no-script output stays inert.
show("error");
choices.removeAttribute("disabled");
