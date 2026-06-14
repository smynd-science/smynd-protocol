# Architecture

Smynd Protocol is a public proof layer around private research workflows.

## Components

1. **Private product system**
   - owns participant identity;
   - collects research responses;
   - evaluates submissions;
   - applies consent and governance rules;
   - never writes raw participant data to this repository or to public chains.

2. **Proof issuer**
   - creates commitments from private records;
   - signs or issues a proof document;
   - may publish a proof digest to a registry.

3. **Proof document**
   - contains schema version, commitments, issuer, timestamp, optional metadata URI, and optional signature;
   - does not contain raw participant responses or direct identifiers.

4. **Registry contract**
   - stores proof IDs, proof digests, commitments, issuer address, timestamps, and revocation state;
   - does not hold money;
   - does not implement token economics.


6. **Royalty ledger layer**
   - records approved dataset usage events;
   - calculates deterministic reward allocations for eligible contribution commitments;
   - produces a Merkle root that can be anchored on-chain;
   - does not perform token payouts in v0.1.

5. **Verifier**
   - receives a proof document from an authorized party;
   - hashes it locally;
   - checks whether the digest exists in the registry and is not revoked.

## Design principles

- Store less publicly.
- Commit to facts without exposing raw facts.
- Keep issuance revocable.
- Keep schema versions explicit.
- Separate protocol experiments from production product code.
- Do not mix proof experiments with token withdrawal or financial promises.
