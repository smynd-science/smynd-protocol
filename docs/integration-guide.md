# Integration Guide

This guide describes a local-only integration flow. It does not connect to the production Smynd backend.

## Local flow

1. Create a private contribution record in your backend.
2. Create salted commitments for study, task, contribution, and approval.
3. Build a proof document.
4. Hash the proof document.
5. Optionally record the digest in the registry contract.
6. Verify the digest later.

## Local commands

Install:

```bash
npm install
```

Validate sample proof:

```bash
npm run proof:validate -- examples/sample-proof.json
```

Hash sample proof:

```bash
npm run proof:hash -- examples/sample-proof.json
```

Compile contract:

```bash
npm run contract:compile
```

Run tests:

```bash
npm run contract:test
```

Run a local chain:

```bash
npx hardhat node
```

Deploy locally in another terminal:

```bash
npm run contract:deploy:local
```

## Production warning

Before any production integration:

- complete a privacy review;
- complete a smart-contract security review;
- define issuer governance;
- define revocation policy;
- define deletion/anonymization behavior;
- define public communication boundaries.
