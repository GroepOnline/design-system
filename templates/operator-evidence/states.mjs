import { bindRetry } from "./interactions.mjs";

bindRetry(document.querySelector("#retry"), {
  result: document.querySelector("#retry-result"),
  onRetry: () =>
    new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("Local demonstration")), 250);
    }),
});
