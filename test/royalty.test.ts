import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  createRewardLedger,
  hashDatasetManifest,
  validateDatasetManifestShape,
  validateRewardLedgerShape,
  validateUsageEventShape
} from "../src/index.js";
import { ContributionRecordV01, DatasetManifestV01, UsageEventV01 } from "../src/types.js";

function readJson<T>(relativePath: string): T {
  const filePath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

test("dataset manifest validates", () => {
  const manifest = readJson<DatasetManifestV01>("examples/sample-dataset-manifest.json");
  assert.deepEqual(validateDatasetManifestShape(manifest), { valid: true, errors: [] });
});

test("usage event validates after manifest hash is set", () => {
  const event = readJson<UsageEventV01>("examples/sample-usage-event.json");
  assert.deepEqual(validateUsageEventShape(event), { valid: true, errors: [] });
});

test("createRewardLedger allocates only eligible future-use records", () => {
  const manifest = readJson<DatasetManifestV01>("examples/sample-dataset-manifest.json");
  const event = readJson<UsageEventV01>("examples/sample-usage-event.json");
  const records = readJson<ContributionRecordV01[]>("examples/sample-contribution-records.json");

  assert.equal(event.datasetManifestHash, hashDatasetManifest(manifest));

  const ledger = createRewardLedger({
    ledgerId: "ledger-synthetic-001",
    generatedAt: "2026-06-20T12:05:00.000Z",
    datasetManifest: manifest,
    usageEvent: event,
    contributionRecords: records
  });

  assert.deepEqual(validateRewardLedgerShape(ledger), { valid: true, errors: [] });
  assert.equal(ledger.entries.length, 2, "withdrawn/future-use-disabled record is excluded");

  const total = ledger.entries.reduce((sum, entry) => sum + BigInt(entry.amountMinorUnits), 0n);
  assert.equal(total.toString(), event.royaltyPoolMinorUnits);
  assert.match(ledger.merkleRoot, /^0x[0-9a-f]{64}$/);
});

