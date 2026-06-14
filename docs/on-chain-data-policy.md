# On-chain Data Policy

## Rule

Public chains are not a database for participant research data.

## Never store on-chain

- raw answers;
- task event streams;
- reaction times;
- identity fields;
- emails;
- phone numbers;
- IP addresses;
- device fingerprints;
- diagnostic or psychometric outputs;
- rejection reasons;
- fraud indicators;
- direct internal IDs.

## Allowed experimental on-chain data

Only if reviewed:

- proof ID that is not a direct user ID;
- proof digest;
- schema version;
- issuer address;
- revocation state;
- commitments to study, task, contribution, and approval.


## Reward-ledger anchoring

For royalty ledgers, public chains may receive a Merkle root and ledger hash. They must not receive per-participant payout rows, raw dataset records, participant identifiers, or sensitive eligibility details.

Allowed experimental fields for reward-root anchoring:

- reward root ID;
- usage event hash;
- dataset manifest hash;
- reward ledger hash;
- Merkle root;
- schema version;
- optional metadata URI with no private data.

## Public messaging

Do not describe this repository as a token launch. It is a proof and verification experiment.
