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

export interface ProofValidationResult {
  valid: boolean;
  errors: string[];
}
