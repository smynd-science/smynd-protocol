# Security Policy

## Scope

This repository contains experimental protocol code, smart-contract examples, proof schemas, local CLI utilities, and public documentation.

It does not contain the production Smynd backend, production identity system, production participant database, production secrets, or real participant research data.

## Reporting a vulnerability

Please report security issues privately before public disclosure.

Contact: security@smynd.science

Include:

- affected file or component;
- steps to reproduce;
- expected impact;
- whether any real data, key, or chain deployment is involved.

## Do not report by opening a public issue

Do not open public GitHub issues for vulnerabilities that could expose:

- private keys;
- deployment secrets;
- user data;
- proof forgery paths;
- re-identification risks;
- chain deployment vulnerabilities.

## Public issue topics that are acceptable

Public issues are acceptable for:

- documentation improvements;
- test failures using synthetic examples;
- feature requests;
- architecture questions;
- non-sensitive bugs in local-only demo code.

## Data safety rules

Never commit:

- real participant data;
- raw questionnaire answers;
- raw cognitive trial data;
- real identity fields;
- private keys;
- `.env` files;
- wallet seed phrases;
- production endpoints;
- secret tokens.

## Smart-contract status

Contracts in this repository are experimental. They are not audited and must not be used to hold funds or manage production rewards.
