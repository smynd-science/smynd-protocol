#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  canonicalStringify,
  createRewardLedger,
  hashContributionRecord,
  hashDatasetManifest,
  hashProof,
  hashRewardLedger,
  hashUsageEvent,
  validateContributionRecordShape,
  validateDatasetManifestShape,
  validateProofShape,
  validateRewardLedgerShape,
  validateUsageEventShape
} from "../src/index.js";
import {
  ContributionRecordV01,
  DatasetManifestV01,
  RewardLedgerV01,
  SmyndProofV01,
  UsageEventV01
} from "../src/types.js";

type ObjectKind = "proof" | "record" | "manifest" | "usage" | "ledger";

function usage(exitCode = 0): never {
  const output = `
Usage:
  smynd-proof hash <proof.json>
  smynd-proof validate <proof.json>
  smynd-proof inspect <proof.json>

  smynd-proof hash-object <proof|record|manifest|usage|ledger> <file.json>
  smynd-proof validate-object <proof|record|manifest|usage|ledger> <file.json>
  smynd-proof royalty-ledger <dataset-manifest.json> <usage-event.json> <contribution-records.json> [ledger-id]

Examples:
  npm run proof:hash -- examples/sample-proof.json
  npm run proof:validate -- examples/sample-proof.json
  npx tsx cli/smynd-proof.ts hash-object manifest examples/sample-dataset-manifest.json
  npx tsx cli/smynd-proof.ts royalty-ledger examples/sample-dataset-manifest.json examples/sample-usage-event.json examples/sample-contribution-records.json
`;
  console.log(output.trim());
  process.exit(exitCode);
}

function readJson(filePath: string): unknown {
  const resolved = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(resolved, "utf8");
  return JSON.parse(raw);
}

function assertKind(value: string | undefined): ObjectKind {
  if (value === "proof" || value === "record" || value === "manifest" || value === "usage" || value === "ledger") return value;
  console.error("Object kind must be one of: proof, record, manifest, usage, ledger");
  usage(1);
}

function validateByKind(kind: ObjectKind, value: unknown) {
  switch (kind) {
    case "proof": return validateProofShape(value);
    case "record": return validateContributionRecordShape(value);
    case "manifest": return validateDatasetManifestShape(value);
    case "usage": return validateUsageEventShape(value);
    case "ledger": return validateRewardLedgerShape(value);
  }
}

function hashByKind(kind: ObjectKind, value: unknown): string {
  const validation = validateByKind(kind, value);
  if (!validation.valid) {
    console.error(`${kind} is invalid:`);
    for (const error of validation.errors) console.error(`- ${error}`);
    process.exit(1);
  }

  switch (kind) {
    case "proof": return hashProof(value as SmyndProofV01);
    case "record": return hashContributionRecord(value as ContributionRecordV01);
    case "manifest": return hashDatasetManifest(value as DatasetManifestV01);
    case "usage": return hashUsageEvent(value as UsageEventV01);
    case "ledger": return hashRewardLedger(value as RewardLedgerV01);
  }
}

const [, , command, firstArg, secondArg, thirdArg, fourthArg] = process.argv;

if (!command || command === "help" || command === "--help" || command === "-h") {
  usage(0);
}

if (command === "validate-object") {
  const kind = assertKind(firstArg);
  if (!secondArg) usage(1);
  const value = readJson(secondArg);
  const validation = validateByKind(kind, value);
  if (validation.valid) {
    console.log("valid");
    process.exit(0);
  }
  console.error("invalid");
  for (const error of validation.errors) console.error(`- ${error}`);
  process.exit(1);
}

if (command === "hash-object") {
  const kind = assertKind(firstArg);
  if (!secondArg) usage(1);
  console.log(hashByKind(kind, readJson(secondArg)));
  process.exit(0);
}

if (command === "royalty-ledger") {
  if (!firstArg || !secondArg || !thirdArg) usage(1);
  const datasetManifest = readJson(firstArg) as DatasetManifestV01;
  const usageEvent = readJson(secondArg) as UsageEventV01;
  const recordsValue = readJson(thirdArg);
  if (!Array.isArray(recordsValue)) {
    console.error("contribution-records.json must contain an array");
    process.exit(1);
  }
  const ledger = createRewardLedger({
    ledgerId: fourthArg ?? `ledger-${usageEvent.usageId}`,
    generatedAt: new Date().toISOString(),
    datasetManifest,
    usageEvent,
    contributionRecords: recordsValue as ContributionRecordV01[]
  });
  console.log(canonicalStringify(ledger));
  process.exit(0);
}

if (!firstArg) {
  console.error("Missing proof file path.");
  usage(1);
}

const value = readJson(firstArg);
const validation = validateProofShape(value);

if (command === "validate") {
  if (validation.valid) {
    console.log("valid");
    process.exit(0);
  }

  console.error("invalid");
  for (const error of validation.errors) console.error(`- ${error}`);
  process.exit(1);
}

if (!validation.valid) {
  console.error("Proof is invalid:");
  for (const error of validation.errors) console.error(`- ${error}`);
  process.exit(1);
}

const proof = value as SmyndProofV01;

if (command === "hash") {
  console.log(hashProof(proof));
  process.exit(0);
}

if (command === "inspect") {
  console.log(canonicalStringify({
    schemaVersion: proof.schemaVersion,
    proofId: proof.proofId,
    issuer: proof.issuer,
    issuedAt: proof.issuedAt,
    digest: hashProof(proof),
    hasSignature: Boolean(proof.signature),
    hasRegistry: Boolean(proof.registryAddress),
    chainId: proof.chainId ?? null
  }));
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
usage(1);
