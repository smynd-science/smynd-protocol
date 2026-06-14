import test from "node:test";
import assert from "node:assert/strict";
import { canonicalStringify, hashProof, validateProofShape } from "../src/index.js";

const sampleProof = {
  schemaVersion: "smynd-proof-v0.1",
  proofId: "0x1111111111111111111111111111111111111111111111111111111111111111",
  issuer: "smynd-science:test-issuer",
  issuedAt: "2026-06-14T00:00:00.000Z",
  studyCommitment: "0x2222222222222222222222222222222222222222222222222222222222222222",
  taskCommitment: "0x3333333333333333333333333333333333333333333333333333333333333333",
  contributionCommitment: "0x4444444444444444444444444444444444444444444444444444444444444444",
  approvalCommitment: "0x5555555555555555555555555555555555555555555555555555555555555555"
} as const;

test("canonicalStringify sorts object keys", () => {
  assert.equal(canonicalStringify({ b: 2, a: 1 }), '{"a":1,"b":2}');
});

test("validateProofShape accepts sample proof", () => {
  assert.deepEqual(validateProofShape(sampleProof), { valid: true, errors: [] });
});

test("hashProof is deterministic", () => {
  const first = hashProof(sampleProof);
  const second = hashProof({ ...sampleProof });
  assert.equal(first, second);
  assert.match(first, /^0x[0-9a-f]{64}$/);
});

test("validateProofShape rejects malformed proof", () => {
  const result = validateProofShape({ ...sampleProof, proofId: "not-a-hash" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("proofId")));
});
