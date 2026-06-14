# GitHub Commands

This file lists the recommended `gh` and `git` commands for creating and maintaining the public repository.

## Create the repository on GitHub

SSH remote:

```bash
gh repo create smynd-science/smynd-protocol \
  --public \
  --description "Open protocol experiments for privacy-preserving research proofs and future Smynd ecosystem primitives" \
  --homepage "https://smynd.science" \
  --clone=false
```

HTTPS remote alternative:

```bash
gh repo create smynd-science/smynd-protocol \
  --public \
  --description "Open protocol experiments for privacy-preserving research proofs and future Smynd ecosystem primitives" \
  --homepage "https://smynd.science" \
  --clone=false
```

## Push the local repository

From inside the extracted `smynd-protocol` directory:

```bash
git init
git branch -M main
git add .
git commit -m "Initialize Smynd Protocol public repository"
git remote add origin git@github.com:smynd-science/smynd-protocol.git
git push -u origin main
```

HTTPS remote alternative:

```bash
git remote add origin https://github.com/smynd-science/smynd-protocol.git
git push -u origin main
```

## Enable repository features

```bash
gh repo edit smynd-science/smynd-protocol \
  --enable-issues=true \
  --enable-projects=true \
  --enable-wiki=false \
  --enable-discussions=true
```

## Create labels and starter issues

```bash
chmod +x scripts/bootstrap-labels.sh scripts/bootstrap-issues.sh
./scripts/bootstrap-labels.sh smynd-science/smynd-protocol
./scripts/bootstrap-issues.sh smynd-science/smynd-protocol
```

## Normal update workflow

```bash
git switch main
git pull --ff-only

git switch -c feat/proof-schema-v01
# edit files
npm run build
npm run test
npm run contract:test

git add .
git commit -m "Define v0.1 proof schema"
git push -u origin feat/proof-schema-v01

gh pr create \
  --repo smynd-science/smynd-protocol \
  --base main \
  --head feat/proof-schema-v01 \
  --title "Define v0.1 proof schema" \
  --body "Adds the first public proof schema, synthetic example, and validation notes."
```

After review and CI:

```bash
gh pr merge --repo smynd-science/smynd-protocol --squash --delete-branch
```

## Release a small version

```bash
git switch main
git pull --ff-only
gh release create v0.1.0 \
  --repo smynd-science/smynd-protocol \
  --title "v0.1.0 Proof Schema" \
  --notes "Initial public proof schema, sample proof, local hashing helper, and privacy model."
```
