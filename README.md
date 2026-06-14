# Smynd Protocol

Open protocol experiments for privacy-preserving research contribution proofs, approval verification, and future Smynd ecosystem primitives.

Smynd Protocol is a public, open-source repository for building the **proof layer** around Smynd Science. The goal is to make research participation verifiable without exposing participant identity, questionnaire answers, cognitive-task raw data, IP addresses, emails, phone numbers, or other sensitive records.

> This repository is intentionally separate from the main Smynd product codebase. It contains protocol experiments, sample contracts, proof schemas, CLI utilities, SDK helpers, and documentation that can be safely developed in public.

## What this repository is for

Smynd Protocol explores how a research marketplace can publish or verify limited evidence such as:

- a contribution was submitted;
- a contribution was approved;
- a proof was issued by an authorized issuer;
- a proof digest exists in a registry;
- a proof can be revoked if issued incorrectly;
- public verification can happen without publishing raw participant data.

## What this repository is not

This repository is **not** the main Smynd web application, backend, database, scoring system, wallet system, or production token implementation.

It does **not** contain:

- participant personal data;
- real study responses;
- production secrets;
- deployment keys;
- anti-fraud internals;
- clinical or diagnostic logic;
- production reward or token withdrawal rails.

## Repository status

Current status: **experimental / pre-production**.

The repository is useful for public collaboration, transparent architecture work, and early proof-of-concept development. It should not be used as a production financial, legal, medical, or identity system without additional audit and governance review.

## Quick start

Requirements:

- Node.js 20+
- npm 10+
- GitHub CLI if you want to use the repository bootstrap scripts

Install dependencies:

```bash
npm install
```

Run checks:

```bash
npm run lint
npm run test
npm run build
```

Compile contracts:

```bash
npm run contract:compile
```

Run contract tests:

```bash
npm run contract:test
```

Generate and hash a sample proof:

```bash
npm run proof:hash -- examples/sample-proof.json
```

Deploy to a local Hardhat network:

```bash
npx hardhat node
npm run contract:deploy:local
```

## Core idea

The public chain or registry should only receive cryptographic commitments and proof digests.

```text
Private Smynd data
  participant identity
  raw answers
  cognitive trial data
  approval details
        |
        | local/off-chain canonicalization + salted commitments
        v
Proof document
  schema version
  study commitment
  task commitment
  contribution commitment
  approval commitment
  issuer signature
        |
        | hash proof document
        v
Public registry
  proofId
  proofDigest
  minimal metadata
  revocation state
```

## Suggested public roadmap

- v0.1: proof schema, examples, hashing utilities, privacy model
- v0.2: Solidity proof registry and local tests
- v0.3: CLI for proof generation and verification
- v0.4: JavaScript SDK package structure
- v0.5: demo integration and public technical note
- v0.6: external review and threat-model hardening

See [`ROADMAP.md`](ROADMAP.md) for details.

## Repository layout

```text
contracts/      Solidity proof registry experiments
src/            TypeScript proof schema, canonical JSON, and hashing helpers
cli/            CLI entrypoint for local proof utilities
scripts/        Deployment and GitHub bootstrap scripts
examples/       Synthetic proof and manifest examples
docs/           Architecture, privacy model, threat model, integration notes
test/           Contract and TypeScript tests
.github/        CI, issue templates, PR template, funding/security metadata
```

## Security and privacy boundary

Never put real Smynd user data in this repository. Never commit secrets. Never publish raw participant responses. Never put direct user identifiers on-chain.

Read:

- [`SECURITY.md`](SECURITY.md)
- [`docs/privacy-model.md`](docs/privacy-model.md)
- [`docs/threat-model.md`](docs/threat-model.md)
- [`docs/on-chain-data-policy.md`](docs/on-chain-data-policy.md)

## License

Apache License 2.0. See [`LICENSE`](LICENSE).

## Maintainers

Smynd Science.

Website: https://smynd.science
