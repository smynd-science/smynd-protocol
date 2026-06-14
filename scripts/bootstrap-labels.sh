#!/usr/bin/env bash
set -euo pipefail

REPO="${1:-}"
if [[ -z "$REPO" ]]; then
  echo "Usage: $0 owner/repo"
  exit 1
fi

require() {
  command -v "$1" >/dev/null 2>&1 || { echo "$1 is required"; exit 1; }
}

require gh

upsert_label() {
  local name="$1"
  local color="$2"
  local desc="$3"

  if ! [[ "$color" =~ ^[0-9a-fA-F]{6}$ ]]; then
    echo "Invalid color for label '$name': $color"
    exit 1
  fi

  if gh label list --repo "$REPO" --limit 1000 --json name --jq '.[].name' | grep -Fxq "$name"; then
    gh label edit "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
    echo "updated: $name"
  else
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
    echo "created: $name"
  fi
}

upsert_label "type: bug" "d73a4a" "Something is wrong"
upsert_label "type: feature" "a2eeef" "Feature request or protocol proposal"
upsert_label "type: docs" "0075ca" "Documentation improvement"
upsert_label "type: research" "0e8a16" "Research workflow or proof semantics"
upsert_label "type: contract" "5319e7" "Smart-contract related work"
upsert_label "type: privacy" "c5def5" "Privacy, consent, or data-minimization work"

upsert_label "area: proof-schema" "bfd4f2" "Proof schema and commitments"
upsert_label "area: contracts" "5319e7" "Solidity contracts and chain registry"
upsert_label "area: cli" "fef2c0" "Command-line tooling"
upsert_label "area: sdk" "d4c5f9" "SDK and developer APIs"
upsert_label "area: docs" "0075ca" "Documentation"
upsert_label "area: security" "e99695" "Security and threat model"

upsert_label "status: proposed" "ededed" "Proposed but not committed"
upsert_label "status: planned" "fbca04" "Planned"
upsert_label "status: in-progress" "1d76db" "Work in progress"
upsert_label "status: blocked" "b60205" "Blocked"
upsert_label "status: completed" "0e8a16" "Completed"
upsert_label "status: future" "7057ff" "Future candidate"

upsert_label "release: v0.1" "c2e0c6" "Proof schema and local verification"
upsert_label "release: v0.2" "bfd4f2" "On-chain registry experiment"
upsert_label "release: v0.3" "d4c5f9" "CLI utilities"
upsert_label "release: v0.4" "fef2c0" "JavaScript SDK"
upsert_label "release: v0.5" "f9d0c4" "Demo integration"
