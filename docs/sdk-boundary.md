# SDK Boundary

The public SDK should expose stable helpers only.

## Public exports

- proof types;
- canonical JSON serialization;
- proof hashing;
- proof shape validation;
- commitment helper.

## Not public in early versions

- production issuer keys;
- backend API clients;
- anti-fraud logic;
- participant identity logic;
- token withdrawal logic.
