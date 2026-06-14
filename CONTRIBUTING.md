# Contributing

Thanks for considering a contribution to Smynd Protocol.

## Good first contributions

- Improve proof-format documentation.
- Add synthetic examples.
- Add tests for canonical JSON and proof hashing.
- Improve CLI error messages.
- Expand the privacy model.
- Improve contract tests.

## Contribution workflow

1. Open or pick an issue.
2. Create a branch from `main`.
3. Keep the change small and focused.
4. Add tests or documentation.
5. Open a pull request.
6. Wait for CI and review.

## Branch names

Use short names such as:

```text
feat/proof-schema-v01
fix/cli-validation-error
chore/update-threat-model
```

## Pull request checklist

Before opening a PR:

- No real user data is included.
- No secrets are included.
- Examples are synthetic.
- `npm run lint` passes.
- `npm run test` passes.
- Contract changes include tests.
- Documentation is updated when public behavior changes.

## Public data rule

If a contribution includes example data, it must be synthetic and clearly marked as synthetic.
