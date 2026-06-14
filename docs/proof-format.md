# Proof Format v0.1

The first proof format is intentionally small.

## JSON shape

```json
{
  "schemaVersion": "smynd-proof-v0.1",
  "proofId": "0x...32-byte-hex",
  "issuer": "smynd-science:local-demo-issuer",
  "issuedAt": "2026-06-14T00:00:00.000Z",
  "studyCommitment": "0x...32-byte-hex",
  "taskCommitment": "0x...32-byte-hex",
  "contributionCommitment": "0x...32-byte-hex",
  "approvalCommitment": "0x...32-byte-hex",
  "metadataUri": "https://example.invalid/synthetic-manifest.json",
  "chainId": 31337,
  "registryAddress": "0x...",
  "signature": "0x..."
}
```

## Required fields

| Field | Purpose |
|---|---|
| `schemaVersion` | Version of the proof schema. |
| `proofId` | Public identifier for the proof. Must not be a direct user ID. |
| `issuer` | Human-readable issuer identifier. |
| `issuedAt` | ISO-8601 issue timestamp. |
| `studyCommitment` | Commitment to study identity/version. |
| `taskCommitment` | Commitment to task identity/version. |
| `contributionCommitment` | Commitment to the submitted contribution. |
| `approvalCommitment` | Commitment to the approval decision. |

## Optional fields

| Field | Purpose |
|---|---|
| `metadataUri` | Optional URI to public metadata that contains no private data. |
| `chainId` | Chain ID if recorded on-chain. |
| `registryAddress` | Registry address if recorded on-chain. |
| `signature` | Optional issuer signature. |

## Commitment rule

A commitment should be produced from a namespace, value, and a strong salt. A direct database ID is not enough.

Bad:

```text
hash(user.email)
hash(participantId)
hash(rawAnswers)
```

Better:

```text
hash({ namespace, internalValue, per-study salt, schemaVersion })
```

## Hashing rule

Smynd Protocol uses canonical JSON and Keccak-256 in the current TypeScript helper.

The signature field is excluded from the default proof digest unless explicitly included.
