import { keccak256, toUtf8Bytes } from "ethers";
import { canonicalStringify } from "./canonical-json.js";
import { HexString, SmyndProofV01 } from "./types.js";

export function hashText(input: string): HexString {
  return keccak256(toUtf8Bytes(input)) as HexString;
}

export function hashJson(value: unknown): HexString {
  return hashText(canonicalStringify(value));
}

export function hashProof(proof: SmyndProofV01, options?: { includeSignature?: boolean }): HexString {
  const includeSignature = options?.includeSignature ?? false;
  const normalized = includeSignature ? proof : { ...proof, signature: undefined };
  return hashJson(normalized);
}

export function makeCommitment(namespace: string, value: string, salt: string): HexString {
  if (!namespace || !value || !salt) {
    throw new Error("namespace, value, and salt are required to create a commitment");
  }

  return hashJson({ namespace, value, salt });
}
