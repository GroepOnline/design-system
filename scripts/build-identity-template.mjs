#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  accountDocument,
  landingDocument,
  statesDocument,
} from "../templates/identity-spatial/specimen.mjs";

const root = new URL("../templates/identity-spatial/", import.meta.url);
const artifacts = new Map([
  ["index.html", landingDocument()],
  ["states.html", statesDocument()],
  ["account.html", accountDocument()],
  [
    "identity-mark.svg",
    readFileSync(
      new URL(
        "../extensions/chefgroep/assets/identity-mark.svg",
        import.meta.url,
      ),
    ),
  ],
]);
for (const [name, content] of artifacts) {
  const path = new URL(name, root);
  if (process.argv.includes("--check")) {
    if (!readFileSync(path).equals(Buffer.from(content)))
      throw new Error(`Identity template drift: ${fileURLToPath(path)}`);
  } else {
    writeFileSync(path, content);
  }
}
console.log(
  `identity-template: ${artifacts.size} artifacts ${process.argv.includes("--check") ? "reproducible" : "built"}`,
);
