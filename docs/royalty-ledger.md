# Research Contribution Royalty Ledger v0.1

This document defines the first experimental economic layer for Smynd Protocol: a privacy-preserving royalty ledger for approved reuse of research contributions.

The goal is to make future dataset usage auditable and rewardable without publishing raw participant data, participant identity, questionnaire answers, cognitive-task events, or internal fraud signals.

## Core idea

A participant can receive an initial reward for completing a study. Later, if a researcher, institution, or approved customer uses a dataset that includes eligible contribution records from that participant, Smynd can calculate an additional royalty share.

The protocol is intentionally split into two layers:

1. **Off-chain accounting**: private records, consent state, eligibility, usage events, and amount allocation are calculated in the product system.
2. **Optional on-chain anchoring**: a Merkle root of the reward ledger can be anchored on-chain to make settlement evidence tamper-evident without exposing private data.

## New objects

### ContributionRecord

A private/off-chain record commitment for a participant contribution. It includes only commitments and policy flags in public examples.

Important fields:

- `recordCommitment`
- `participantCommitment`
- `studyCommitment`
- `taskCommitment`
- `consentScopeHash`
- `consentVersionHash`
- `qualityScore`
- `eligibility.royaltyEligible`
- `eligibility.futureUseAllowed`

### DatasetManifest

A manifest for an approved dataset export or dataset product. It commits to the included records and defines the royalty policy.

Important fields:

- `datasetId`
- `studyCommitment`
- `recordCommitments`
- `licenseHash`
- `royaltyPolicy.poolShareBps`
- `royaltyPolicy.weighting`

### UsageEvent

A record that an approved dataset was used under a specific license and economic condition.

Important fields:

- `usageId`
- `datasetManifestHash`
- `researcherCommitment`
- `usageType`
- `grossAmountMinorUnits`
- `royaltyPoolMinorUnits`
- `settlementMode`

### RewardLedger

The deterministic allocation output. It maps eligible contribution records to participant commitments and amount shares.

Important fields:

- `usageEventHash`
- `datasetManifestHash`
- `entries`
- `merkleRoot`

## Eligibility rules in v0.1

A record is included in a reward ledger only if all of the following are true:

- the record commitment is included in the dataset manifest;
- `royaltyEligible` is true;
- `futureUseAllowed` is true;
- the record quality score is greater than or equal to the manifest minimum quality score.

Records with withdrawn future-use consent or disabled future-use eligibility are excluded from new ledgers. Past lawful usage may require separate policy/legal handling.

## Allocation rule in v0.1

Two weighting modes are supported:

- `equal`: every eligible record has weight 1;
- `quality-score`: each record weight is derived from its quality score.

The royalty pool is expressed in minor currency units, for example cents for USD. Integer allocation is deterministic. Any rounding remainder is distributed in stable sorted order by record commitment.

## On-chain boundary

The chain should not receive the reward ledger entries directly. It should receive only:

- reward root ID;
- usage event hash;
- dataset manifest hash;
- reward ledger hash;
- Merkle root;
- schema version;
- optional metadata URI with no private data.

The experimental contract is `contracts/ResearchRewardRootRegistry.sol`.

## Example command

```bash
npm run royalty:ledger -- \
  examples/sample-dataset-manifest.json \
  examples/sample-usage-event.json \
  examples/sample-contribution-records.json
```

This emits a synthetic reward ledger JSON.

## Non-goals

This hotfix does not implement:

- token issuance;
- stablecoin payout;
- tax handling;
- KYC;
- user wallet flows;
- automatic detection of unauthorized off-platform dataset reuse;
- production legal enforcement.

Those require separate marketplace, legal, governance, and compliance work.
