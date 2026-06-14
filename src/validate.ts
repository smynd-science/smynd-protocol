import {
  ContributionRecordV01,
  DatasetManifestV01,
  ProofValidationResult,
  RewardLedgerV01,
  SmyndProofV01,
  UsageEventV01
} from "./types.js";

const HEX_32 = /^0x[0-9a-fA-F]{64}$/;
const HEX_ANY = /^0x[0-9a-fA-F]+$/;
const ISO_CURRENCY = /^[A-Z]{3}$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDatetime(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isHex32(value: unknown): value is `0x${string}` {
  return typeof value === "string" && HEX_32.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isMinorUnitString(value: unknown): value is string {
  return typeof value === "string" && /^\d+$/.test(value);
}

export function validateProofShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];

  if (!isObject(value)) {
    return { valid: false, errors: ["proof must be a JSON object"] };
  }

  const proof = value as Partial<SmyndProofV01>;

  if (proof.schemaVersion !== "smynd-proof-v0.1") {
    errors.push("schemaVersion must be smynd-proof-v0.1");
  }

  for (const field of ["proofId", "studyCommitment", "taskCommitment", "contributionCommitment", "approvalCommitment"] as const) {
    const candidate = proof[field];
    if (!isHex32(candidate)) {
      errors.push(`${field} must be a 32-byte hex string`);
    }
  }

  if (!isNonEmptyString(proof.issuer)) {
    errors.push("issuer is required");
  }

  if (!isIsoDatetime(proof.issuedAt)) {
    errors.push("issuedAt must be an ISO-8601 datetime string");
  }

  if (proof.signature !== undefined && (typeof proof.signature !== "string" || !HEX_ANY.test(proof.signature))) {
    errors.push("signature must be a hex string when provided");
  }

  if (proof.chainId !== undefined && (!Number.isInteger(proof.chainId) || proof.chainId <= 0)) {
    errors.push("chainId must be a positive integer when provided");
  }

  return { valid: errors.length === 0, errors };
}

export function validateContributionRecordShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];
  if (!isObject(value)) return { valid: false, errors: ["contribution record must be a JSON object"] };
  const record = value as Partial<ContributionRecordV01>;

  if (record.schemaVersion !== "smynd-contribution-record-v0.1") errors.push("schemaVersion must be smynd-contribution-record-v0.1");
  for (const field of ["recordCommitment", "participantCommitment", "studyCommitment", "taskCommitment", "consentScopeHash", "consentVersionHash"] as const) {
    if (!isHex32(record[field])) errors.push(`${field} must be a 32-byte hex string`);
  }
  if (typeof record.qualityScore !== "number" || record.qualityScore < 0 || record.qualityScore > 1) {
    errors.push("qualityScore must be a number between 0 and 1");
  }
  if (!isIsoDatetime(record.createdAt)) errors.push("createdAt must be an ISO-8601 datetime string");
  if (!isObject(record.eligibility)) {
    errors.push("eligibility is required");
  } else {
    if (typeof record.eligibility.royaltyEligible !== "boolean") errors.push("eligibility.royaltyEligible must be boolean");
    if (typeof record.eligibility.futureUseAllowed !== "boolean") errors.push("eligibility.futureUseAllowed must be boolean");
    if (record.eligibility.withdrawalEffectiveAt !== undefined && !isIsoDatetime(record.eligibility.withdrawalEffectiveAt)) {
      errors.push("eligibility.withdrawalEffectiveAt must be an ISO-8601 datetime string when provided");
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateDatasetManifestShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];
  if (!isObject(value)) return { valid: false, errors: ["dataset manifest must be a JSON object"] };
  const manifest = value as Partial<DatasetManifestV01>;

  if (manifest.schemaVersion !== "smynd-dataset-manifest-v0.1") errors.push("schemaVersion must be smynd-dataset-manifest-v0.1");
  if (!isNonEmptyString(manifest.datasetId)) errors.push("datasetId is required");
  if (!isNonEmptyString(manifest.title)) errors.push("title is required");
  if (!isIsoDatetime(manifest.createdAt)) errors.push("createdAt must be an ISO-8601 datetime string");
  if (!isHex32(manifest.studyCommitment)) errors.push("studyCommitment must be a 32-byte hex string");
  if (!isHex32(manifest.licenseHash)) errors.push("licenseHash must be a 32-byte hex string");
  if (!Array.isArray(manifest.recordCommitments) || manifest.recordCommitments.length === 0) {
    errors.push("recordCommitments must be a non-empty array");
  } else {
    const unique = new Set<string>();
    for (const [index, commitment] of manifest.recordCommitments.entries()) {
      if (!isHex32(commitment)) errors.push(`recordCommitments[${index}] must be a 32-byte hex string`);
      unique.add(String(commitment).toLowerCase());
    }
    if (unique.size !== manifest.recordCommitments.length) errors.push("recordCommitments must not contain duplicates");
  }
  if (!Number.isInteger(manifest.recordCount) || (manifest.recordCount ?? 0) < 1) errors.push("recordCount must be a positive integer");
  if (Array.isArray(manifest.recordCommitments) && manifest.recordCount !== undefined && manifest.recordCount !== manifest.recordCommitments.length) {
    errors.push("recordCount must equal recordCommitments.length");
  }
  if (!isObject(manifest.royaltyPolicy)) {
    errors.push("royaltyPolicy is required");
  } else {
    if (!isNonEmptyString(manifest.royaltyPolicy.policyId)) errors.push("royaltyPolicy.policyId is required");
    if (!Number.isInteger(manifest.royaltyPolicy.poolShareBps) || manifest.royaltyPolicy.poolShareBps < 0 || manifest.royaltyPolicy.poolShareBps > 10000) {
      errors.push("royaltyPolicy.poolShareBps must be an integer between 0 and 10000");
    }
    if (manifest.royaltyPolicy.weighting !== "equal" && manifest.royaltyPolicy.weighting !== "quality-score") {
      errors.push("royaltyPolicy.weighting must be equal or quality-score");
    }
    if (manifest.royaltyPolicy.minQualityScore !== undefined && (typeof manifest.royaltyPolicy.minQualityScore !== "number" || manifest.royaltyPolicy.minQualityScore < 0 || manifest.royaltyPolicy.minQualityScore > 1)) {
      errors.push("royaltyPolicy.minQualityScore must be a number between 0 and 1 when provided");
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateUsageEventShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];
  if (!isObject(value)) return { valid: false, errors: ["usage event must be a JSON object"] };
  const event = value as Partial<UsageEventV01>;
  const validUsageTypes = new Set(["academic-analysis", "commercial-analysis", "model-training", "derivative-dataset", "internal-validation"]);
  const validSettlementModes = new Set(["off-chain", "on-chain-root-only", "on-chain-payout"]);

  if (event.schemaVersion !== "smynd-usage-event-v0.1") errors.push("schemaVersion must be smynd-usage-event-v0.1");
  if (!isNonEmptyString(event.usageId)) errors.push("usageId is required");
  if (!isHex32(event.datasetManifestHash)) errors.push("datasetManifestHash must be a 32-byte hex string");
  if (!isHex32(event.researcherCommitment)) errors.push("researcherCommitment must be a 32-byte hex string");
  if (!isHex32(event.licenseHash)) errors.push("licenseHash must be a 32-byte hex string");
  if (typeof event.usageType !== "string" || !validUsageTypes.has(event.usageType)) errors.push("usageType is invalid");
  if (!isIsoDatetime(event.usedAt)) errors.push("usedAt must be an ISO-8601 datetime string");
  if (typeof event.currency !== "string" || !ISO_CURRENCY.test(event.currency)) errors.push("currency must be an ISO-4217 uppercase code");
  if (!isMinorUnitString(event.grossAmountMinorUnits)) errors.push("grossAmountMinorUnits must be a non-negative integer string");
  if (!isMinorUnitString(event.royaltyPoolMinorUnits)) errors.push("royaltyPoolMinorUnits must be a non-negative integer string");
  if (isMinorUnitString(event.grossAmountMinorUnits) && isMinorUnitString(event.royaltyPoolMinorUnits) && BigInt(event.royaltyPoolMinorUnits) > BigInt(event.grossAmountMinorUnits)) {
    errors.push("royaltyPoolMinorUnits must not exceed grossAmountMinorUnits");
  }
  if (typeof event.settlementMode !== "string" || !validSettlementModes.has(event.settlementMode)) errors.push("settlementMode is invalid");
  return { valid: errors.length === 0, errors };
}

export function validateRewardLedgerShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];
  if (!isObject(value)) return { valid: false, errors: ["reward ledger must be a JSON object"] };
  const ledger = value as Partial<RewardLedgerV01>;
  const validSettlementModes = new Set(["off-chain", "on-chain-root-only", "on-chain-payout"]);

  if (ledger.schemaVersion !== "smynd-reward-ledger-v0.1") errors.push("schemaVersion must be smynd-reward-ledger-v0.1");
  if (!isNonEmptyString(ledger.ledgerId)) errors.push("ledgerId is required");
  if (!isHex32(ledger.usageEventHash)) errors.push("usageEventHash must be a 32-byte hex string");
  if (!isHex32(ledger.datasetManifestHash)) errors.push("datasetManifestHash must be a 32-byte hex string");
  if (!isIsoDatetime(ledger.generatedAt)) errors.push("generatedAt must be an ISO-8601 datetime string");
  if (typeof ledger.currency !== "string" || !ISO_CURRENCY.test(ledger.currency)) errors.push("currency must be an ISO-4217 uppercase code");
  if (!isMinorUnitString(ledger.totalRoyaltyPoolMinorUnits)) errors.push("totalRoyaltyPoolMinorUnits must be a non-negative integer string");
  if (typeof ledger.settlementMode !== "string" || !validSettlementModes.has(ledger.settlementMode)) errors.push("settlementMode is invalid");
  if (!Array.isArray(ledger.entries)) {
    errors.push("entries must be an array");
  } else {
    for (const [index, entry] of ledger.entries.entries()) {
      if (!isHex32(entry.participantCommitment)) errors.push(`entries[${index}].participantCommitment must be a 32-byte hex string`);
      if (!isHex32(entry.recordCommitment)) errors.push(`entries[${index}].recordCommitment must be a 32-byte hex string`);
      if (typeof entry.weight !== "number" || entry.weight < 0) errors.push(`entries[${index}].weight must be a non-negative number`);
      if (!isMinorUnitString(entry.amountMinorUnits)) errors.push(`entries[${index}].amountMinorUnits must be a non-negative integer string`);
    }
  }
  if (!isHex32(ledger.merkleRoot)) errors.push("merkleRoot must be a 32-byte hex string");
  return { valid: errors.length === 0, errors };
}
