import { ProofValidationResult, SmyndProofV01 } from "./types.js";

const HEX_32 = /^0x[0-9a-fA-F]{64}$/;
const HEX_ANY = /^0x[0-9a-fA-F]+$/;

export function validateProofShape(value: unknown): ProofValidationResult {
  const errors: string[] = [];

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { valid: false, errors: ["proof must be a JSON object"] };
  }

  const proof = value as Partial<SmyndProofV01>;

  if (proof.schemaVersion !== "smynd-proof-v0.1") {
    errors.push("schemaVersion must be smynd-proof-v0.1");
  }

  for (const field of ["proofId", "studyCommitment", "taskCommitment", "contributionCommitment", "approvalCommitment"] as const) {
    const candidate = proof[field];
    if (typeof candidate !== "string" || !HEX_32.test(candidate)) {
      errors.push(`${field} must be a 32-byte hex string`);
    }
  }

  if (typeof proof.issuer !== "string" || proof.issuer.trim().length === 0) {
    errors.push("issuer is required");
  }

  if (typeof proof.issuedAt !== "string" || Number.isNaN(Date.parse(proof.issuedAt))) {
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
