# Privacy Model

## Goal

Allow public verification of limited research contribution facts without publishing private participant data.

## Data categories

### Private and never public

- participant name;
- email;
- phone number;
- IP address;
- device fingerprint;
- raw questionnaire answers;
- raw cognitive task events;
- free-text responses;
- clinical or psychometric interpretation;
- internal fraud signals;
- direct database IDs.

### Public only as commitments

- study identity;
- task identity;
- contribution identity;
- approval identity.

### Potentially public metadata

- proof schema version;
- issuer identifier;
- issued timestamp;
- public manifest URI;
- registry address;
- revocation state.

## Re-identification risks

Even hashes can be unsafe if the input space is small or guessable. For that reason:

- never hash emails directly;
- never hash direct participant IDs directly;
- use domain separation;
- use strong salts;
- rotate salts where appropriate;
- separate per-study and global commitments;
- avoid publishing enough metadata to link a participant across contexts.

## Withdrawal and deletion

Blockchain data may be immutable. Therefore, only minimal commitments should be recorded, and revocation should be supported.

If a participant later exercises deletion rights, the private product system should delete or anonymize private data according to policy. Public registries may only be able to revoke or mark a proof as invalid.


## Future-use and royalty eligibility

The royalty ledger must treat consent and future-use eligibility as private governance inputs. Public examples may include only synthetic flags. Production systems must not publish why a record is excluded, because exclusion reasons could reveal withdrawal, low quality, policy state, or sensitive account history.

For future dataset usage, records should be eligible only when the product system confirms:

- the relevant consent scope allows future use;
- the consent version is valid for the dataset license;
- the record is not withdrawn from future use;
- the record meets the dataset quality policy;
- the usage event is approved under the dataset license.
