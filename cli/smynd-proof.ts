#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { canonicalStringify, hashProof, validateProofShape } from "../src/index.js";
import { SmyndProofV01 } from "../src/types.js";

function usage(exitCode = 0): never {
  const output = `
Usage:
  smynd-proof hash <proof.json>
  smynd-proof validate <proof.json>
  smynd-proof inspect <proof.json>

Examples:
  npm run proof:hash -- examples/sample-proof.json
  npm run proof:validate -- examples/sample-proof.json
  npm run proof:inspect -- examples/sample-proof.json
`;
  console.log(output.trim());
  process.exit(exitCode);
}

function readJson(filePath: string): unknown {
  const resolved = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(resolved, "utf8");
  return JSON.parse(raw);
}

const [, , command, filePath] = process.argv;

if (!command || command === "help" || command === "--help" || command === "-h") {
  usage(0);
}

if (!filePath) {
  console.error("Missing proof file path.");
  usage(1);
}

const value = readJson(filePath);
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
