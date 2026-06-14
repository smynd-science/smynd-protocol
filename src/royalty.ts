import { computeMerkleRoot } from "./merkle.js";
import { hashDatasetManifest, hashRewardLedgerEntry, hashUsageEvent } from "./hash.js";
import {
  ContributionRecordV01,
  DatasetManifestV01,
  HexString,
  RewardLedgerEntryV01,
  RewardLedgerV01,
  UsageEventV01
} from "./types.js";
import { validateContributionRecordShape, validateDatasetManifestShape, validateUsageEventShape } from "./validate.js";

export interface CreateRewardLedgerInput {
  ledgerId: string;
  generatedAt: string;
  datasetManifest: DatasetManifestV01;
  usageEvent: UsageEventV01;
  contributionRecords: ContributionRecordV01[];
  metadataUri?: string;
}

function assertValid(name: string, validation: { valid: boolean; errors: string[] }): void {
  if (!validation.valid) throw new Error(`${name} is invalid: ${validation.errors.join("; ")}`);
}

function qualityWeight(record: ContributionRecordV01, manifest: DatasetManifestV01): number {
  if (manifest.royaltyPolicy.weighting === "equal") return 1;
  return Math.max(0, Math.round(record.qualityScore * 1_000_000));
}

function allocateMinorUnits(pool: bigint, weights: Array<{ key: string; weight: number }>): Map<string, bigint> {
  const result = new Map<string, bigint>();
  if (pool === 0n || weights.length === 0) return result;

  const totalWeight = BigInt(weights.reduce((sum, item) => sum + item.weight, 0));
  if (totalWeight === 0n) return result;

  let distributed = 0n;
  const sorted = [...weights].sort((a, b) => a.key.localeCompare(b.key));
  for (const item of sorted) {
    const amount = (pool * BigInt(item.weight)) / totalWeight;
    result.set(item.key, amount);
    distributed += amount;
  }

  let remainder = pool - distributed;
  for (const item of sorted) {
    if (remainder === 0n) break;
    result.set(item.key, (result.get(item.key) ?? 0n) + 1n);
    remainder -= 1n;
  }
  return result;
}

export function createRewardLedger(input: CreateRewardLedgerInput): RewardLedgerV01 {
  assertValid("datasetManifest", validateDatasetManifestShape(input.datasetManifest));
  assertValid("usageEvent", validateUsageEventShape(input.usageEvent));

  for (const [index, record] of input.contributionRecords.entries()) {
    assertValid(`contributionRecords[${index}]`, validateContributionRecordShape(record));
  }

  const datasetManifestHash = hashDatasetManifest(input.datasetManifest);
  if (input.usageEvent.datasetManifestHash.toLowerCase() !== datasetManifestHash.toLowerCase()) {
    throw new Error("usageEvent.datasetManifestHash does not match datasetManifest hash");
  }

  if (input.usageEvent.licenseHash.toLowerCase() !== input.datasetManifest.licenseHash.toLowerCase()) {
    throw new Error("usageEvent.licenseHash does not match datasetManifest licenseHash");
  }

  const includedCommitments = new Set(input.datasetManifest.recordCommitments.map((value) => value.toLowerCase()));
  const minQualityScore = input.datasetManifest.royaltyPolicy.minQualityScore ?? 0;
  const eligibleRecords = input.contributionRecords
    .filter((record) => includedCommitments.has(record.recordCommitment.toLowerCase()))
    .filter((record) => record.eligibility.royaltyEligible && record.eligibility.futureUseAllowed)
    .filter((record) => record.qualityScore >= minQualityScore)
    .sort((a, b) => a.recordCommitment.localeCompare(b.recordCommitment));

  const weighted = eligibleRecords.map((record) => ({
    key: record.recordCommitment.toLowerCase(),
    weight: qualityWeight(record, input.datasetManifest),
    record
  }));

  const allocations = allocateMinorUnits(BigInt(input.usageEvent.royaltyPoolMinorUnits), weighted);
  const entries: RewardLedgerEntryV01[] = weighted
    .filter((item) => item.weight > 0)
    .map((item) => ({
      participantCommitment: item.record.participantCommitment,
      recordCommitment: item.record.recordCommitment,
      weight: item.weight,
      amountMinorUnits: (allocations.get(item.key) ?? 0n).toString()
    }));

  const entryHashes = entries.map(hashRewardLedgerEntry);
  const merkleRoot = computeMerkleRoot(entryHashes);

  return {
    schemaVersion: "smynd-reward-ledger-v0.1",
    ledgerId: input.ledgerId,
    usageEventHash: hashUsageEvent(input.usageEvent),
    datasetManifestHash: datasetManifestHash as HexString,
    generatedAt: input.generatedAt,
    currency: input.usageEvent.currency,
    totalRoyaltyPoolMinorUnits: input.usageEvent.royaltyPoolMinorUnits,
    settlementMode: input.usageEvent.settlementMode,
    entries,
    merkleRoot,
    metadataUri: input.metadataUri
  };
}
