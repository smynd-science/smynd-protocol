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

ensure_milestone() {
  local title="$1"
  local description="$2"

  if gh api "repos/$REPO/milestones" --jq '.[].title' | grep -Fxq "$title"; then
    echo "milestone exists: $title"
  else
    gh api --method POST "repos/$REPO/milestones" -f title="$title" -f description="$description" >/dev/null
    echo "created milestone: $title"
  fi
}

ensure_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  local milestone="$4"

  if gh issue list --repo "$REPO" --state all --search "in:title \"$title\"" --json title --jq '.[].title' | grep -Fxq "$title"; then
    echo "issue exists: $title"
    return
  fi

  gh issue create --repo "$REPO" --title "$title" --body "$body" --label "$labels" --milestone "$milestone" >/dev/null
  echo "created issue: $title"
}

ensure_milestone "v0.1 Proof Schema" "Proof schema, synthetic examples, hashing utilities, and privacy boundary."
ensure_milestone "v0.2 Registry Contract" "Solidity proof registry, authorized issuer management, and local tests."
ensure_milestone "v0.3 CLI Utilities" "Local proof generation, validation, inspection, and verification utilities."
ensure_milestone "v0.4 SDK" "JavaScript SDK and integration helpers."
ensure_milestone "v0.5 Demo Integration" "End-to-end local demo and technical write-up."

ensure_issue "Define v0.1 proof schema" "Define the first public Smynd proof schema and document required fields, optional fields, and privacy boundaries.\n\nAcceptance criteria:\n- docs/proof-format.md is updated.\n- examples/sample-proof.json follows the schema.\n- No real user data is included." "type: docs,area: proof-schema,release: v0.1,status: planned" "v0.1 Proof Schema"

ensure_issue "Implement canonical proof hashing" "Implement deterministic canonical JSON and proof digest hashing.\n\nAcceptance criteria:\n- Unit tests cover key ordering.\n- npm run proof:hash works on the sample proof." "type: feature,area: proof-schema,release: v0.1,status: planned" "v0.1 Proof Schema"

ensure_issue "Document on-chain data policy" "Document what may and may not be stored on-chain.\n\nAcceptance criteria:\n- docs/on-chain-data-policy.md clearly says raw participant data must never be on-chain.\n- Examples use commitments only." "type: privacy,area: security,release: v0.1,status: planned" "v0.1 Proof Schema"

ensure_issue "Add proof registry contract tests" "Expand contract tests for record, revoke, duplicate proof, issuer authorization, and invalid inputs.\n\nAcceptance criteria:\n- npm run contract:test passes.\n- Tests prove unauthorized issuers cannot record proofs." "type: contract,area: contracts,release: v0.2,status: planned" "v0.2 Registry Contract"

ensure_issue "Add local registry deployment walkthrough" "Create a step-by-step local deployment walkthrough for the registry contract.\n\nAcceptance criteria:\n- docs/integration-guide.md includes local Hardhat commands.\n- README quick start points to the walkthrough." "type: docs,area: contracts,release: v0.2,status: planned" "v0.2 Registry Contract"

ensure_issue "Add CLI validate command fixtures" "Add positive and negative fixtures for CLI validation.\n\nAcceptance criteria:\n- CLI returns exit code 0 for valid proof.\n- CLI returns non-zero for malformed proof.\n- Test coverage exists." "type: feature,area: cli,release: v0.3,status: future" "v0.3 CLI Utilities"

ensure_issue "Design JavaScript SDK package boundary" "Define what should be exported by the SDK and what should remain internal.\n\nAcceptance criteria:\n- docs/sdk-boundary.md exists.\n- src/index.ts exports stable public helpers only." "type: docs,area: sdk,release: v0.4,status: future" "v0.4 SDK"

ensure_issue "Create end-to-end local demo" "Create a local demo that hashes a proof, records the digest in the registry, and verifies it.\n\nAcceptance criteria:\n- Demo uses synthetic data.\n- Demo runs locally without production services." "type: feature,area: contracts,area: cli,release: v0.5,status: future" "v0.5 Demo Integration"
