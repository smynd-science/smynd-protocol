# Threat Model

## Assets

- participant privacy;
- integrity of issued proofs;
- issuer authorization;
- public trust in proof registry;
- ability to revoke incorrect proofs;
- separation from production product secrets.

## Threats

### Re-identification

An attacker may try to infer a participant from proof metadata or commitments.

Mitigations:

- no raw data on-chain;
- no direct identifiers;
- salted commitments;
- minimal metadata;
- public examples must be synthetic.

### Proof forgery

An attacker may create a fake proof document.

Mitigations:

- issuer authorization;
- optional issuer signatures;
- registry digest checks;
- schema validation.

### Unauthorized issuer

An unauthorized address may try to register proof digests.

Mitigations:

- owner-managed issuer list;
- tests for unauthorized writes;
- event logs for issuer changes.

### Irreversible public mistakes

A proof may be registered incorrectly.

Mitigations:

- revocation function;
- no raw data stored;
- pre-publication validation;
- staging/local testing before public chain use.

### Token confusion

Observers may interpret proof registry experiments as a token launch or financial claim.

Mitigations:

- clear documentation;
- no token contract in early versions;
- no reward withdrawal logic;
- separate tokenization from proof experiments.
