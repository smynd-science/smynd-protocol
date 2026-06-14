export type HexString = `0x${string}`;

export interface SmyndProofV01 {
  schemaVersion: "smynd-proof-v0.1";
  proofId: HexString;
  issuer: string;
  issuedAt: string;
  studyCommitment: HexString;
  taskCommitment: HexString;
  contributionCommitment: HexString;
  approvalCommitment: HexString;
  metadataUri?: string;
  chainId?: number;
  registryAddress?: string;
  signature?: HexString;
}

export interface ContributionRecordV01 {
  schemaVersion: "smynd-contribution-record-v0.1";
  recordCommitment: HexString;
  participantCommitment: HexString;
  studyCommitment: HexString;
  taskCommitment: HexString;
  consentScopeHash: HexString;
  consentVersionHash: HexString;
  qualityScore: number;
  createdAt: string;
  eligibility: {
    royaltyEligible: boolean;
    futureUseAllowed: boolean;
    withdrawalEffectiveAt?: string;
  };
  metadataUri?: string;
}

export interface DatasetManifestV01 {
  schemaVersion: "smynd-dataset-manifest-v0.1";
  datasetId: string;
  title: string;
  createdAt: string;
  studyCommitment: HexString;
  recordCommitments: HexString[];
  recordCount: number;
  licenseHash: HexString;
  royaltyPolicy: {
    policyId: string;
    poolShareBps: number;
    weighting: "equal" | "quality-score";
    minQualityScore?: number;
  };
  metadataUri?: string;
}

export interface UsageEventV01 {
  schemaVersion: "smynd-usage-event-v0.1";
  usageId: string;
  datasetManifestHash: HexString;
  researcherCommitment: HexString;
  licenseHash: HexString;
  usageType: "academic-analysis" | "commercial-analysis" | "model-training" | "derivative-dataset" | "internal-validation";
  usedAt: string;
  currency: string;
  grossAmountMinorUnits: string;
  royaltyPoolMinorUnits: string;
  settlementMode: "off-chain" | "on-chain-root-only" | "on-chain-payout";
  metadataUri?: string;
}

export interface RewardLedgerEntryV01 {
  participantCommitment: HexString;
  recordCommitment: HexString;
  weight: number;
  amountMinorUnits: string;
}

export interface RewardLedgerV01 {
  schemaVersion: "smynd-reward-ledger-v0.1";
  ledgerId: string;
  usageEventHash: HexString;
  datasetManifestHash: HexString;
  generatedAt: string;
  currency: string;
  totalRoyaltyPoolMinorUnits: string;
  settlementMode: UsageEventV01["settlementMode"];
  entries: RewardLedgerEntryV01[];
  merkleRoot: HexString;
  metadataUri?: string;
}

export interface ProofValidationResult {
  valid: boolean;
  errors: string[];
}
