# Roadmap

This roadmap is intentionally small and execution-focused. The goal is continuous public progress without exposing the main Smynd product codebase.

## v0.1 — Proof schema and local verification

Status: planned

- Define the first public proof schema.
- Add synthetic proof examples.
- Implement canonical JSON serialization.
- Implement proof digest hashing.
- Add local proof verification checks.
- Document privacy boundaries.

Exit criteria:

- `npm run proof:hash -- examples/sample-proof.json` works.
- Proof format is documented in `docs/proof-format.md`.
- No real user data is present in examples.

## v0.2 — On-chain registry experiment

Status: planned

- Add Solidity registry contract.
- Add authorized issuer management.
- Add proof recording and revocation.
- Add Hardhat local deployment.
- Add contract tests.

Exit criteria:

- `npm run contract:test` passes.
- Local deployment script emits a registry address.
- Contract stores only commitments and proof digests.

## v0.3 — CLI utilities

Status: future

- Add CLI commands for hashing proof files.
- Add CLI commands for validating proof shape.
- Add local verification command.
- Add sample output snapshots.

Exit criteria:

- CLI supports `hash`, `validate`, and `inspect` commands.
- CLI works against synthetic examples only.

## v0.4 — JavaScript SDK

Status: future

- Package proof helpers into a small SDK module.
- Add typed proof interfaces.
- Add integration examples.
- Add browser and Node.js usage notes.

Exit criteria:

- SDK helpers can be imported from `src/index.ts`.
- Example code demonstrates proof hashing and verification.

## v0.5 — Demo integration

Status: future

- Add end-to-end local demo.
- Add mock issuer signing flow.
- Add proof registry interaction script.
- Add documentation for how a backend could integrate with the protocol.

Exit criteria:

- A developer can run a local proof creation and registry verification demo.

## v0.6 — Review and hardening

Status: future

- Expand threat model.
- Add public security checklist.
- Add external-review notes.
- Add stricter test fixtures.

Exit criteria:

- Risks and non-goals are clear enough for outside contributors and reviewers.
