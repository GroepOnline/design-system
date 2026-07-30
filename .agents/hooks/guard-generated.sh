#!/usr/bin/env bash
# preToolUse (Write): weiger handmatige edits in gegenereerde output.
# Invariant 3 uit AGENTS.md. Faalt open bij onverwachte input.
set -uo pipefail

input=$(cat 2>/dev/null || true)
[ -z "$input" ] && { echo '{"permission":"allow"}'; exit 0; }

path=$(printf '%s' "$input" | jq -r '
  .tool_input.path // .tool_input.file_path // .tool_input.target_file //
  .path // .file_path // empty' 2>/dev/null || true)
[ -z "$path" ] && { echo '{"permission":"allow"}'; exit 0; }

rel=${path#"$PWD"/}
rel=${rel#./}

generated=""
case "$rel" in
  brain-site/*)            generated="brain-site/ (bron: brain/**/*.md)" ;;
  taste-site/*)            generated="taste-site/ (bron: taste/*.md)" ;;
  docs/*.html)             generated="docs/ (bron: de .md bestanden)" ;;
  components/index.html)   generated="components/index.html (bron: catalog.json)" ;;
  components/*/index.html) generated="$rel (bron: catalog.json)" ;;
  .commandcode/taste/taste.md)
                            generated="$rel (bron: kater-dev-tools/.agents/registry/taste.yaml)" ;;
  .cursor/rules/taste.mdc) generated="$rel (bron: kater-dev-tools/.agents/registry/taste.yaml)" ;;
esac

if [ -n "$generated" ]; then
  jq -n --arg g "$generated" --arg p "$rel" '{
    permission: "deny",
    user_message: ("Geblokkeerd: " + $p + " is gegenereerd."),
    agent_message: ("Dit bestand is gegenereerde output: " + $g +
      ". Wijzig de genoemde bron en draai de bijbehorende generator.")
  }'
  exit 0
fi

echo '{"permission":"allow"}'
exit 0
