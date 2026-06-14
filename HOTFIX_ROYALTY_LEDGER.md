# Hotfix: Research Contribution Royalty Ledger

This hotfix adds an experimental privacy-preserving royalty ledger layer to Smynd Protocol.

## Apply

From the root of your `smynd-protocol` repository:

```bash
unzip -o smynd-protocol-royalty-ledger-hotfix.zip
npm install
npm run build
npm run test
npm run contract:compile
npm run contract:test
npm run royalty:ledger -- examples/sample-dataset-manifest.json examples/sample-usage-event.json examples/sample-contribution-records.json
```

## Commit workflow

```bash
git switch main
git pull --ff-only
git switch -c feat/research-contribution-royalty-ledger

git status --short
npm run build
npm run test
npm run contract:compile
npm run contract:test

git add .
git commit -m "Add research contribution royalty ledger prototype"
git push -u origin feat/research-contribution-royalty-ledger

gh pr create \
  --repo smynd-science/smynd-protocol \
  --base main \
  --head feat/research-contribution-royalty-ledger \
  --title "Add research contribution royalty ledger prototype" \
  --body "Adds experimental contribution records, dataset manifests, usage events, reward ledgers, deterministic royalty allocation, Merkle-root generation, reward-root anchoring contract, tests, examples, CLI command, and documentation."
```

## Important boundary

This does not implement production payouts, a token, KYC, taxes, or automatic detection of off-platform dataset reuse. It only adds a public experimental protocol layer for auditable future-use accounting.
