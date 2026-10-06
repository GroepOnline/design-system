# Runtime package releases

`packages/release.json` is the version and package-set authority. The repository root `package.json` is upstream research material and is deliberately not a Signaal workspace manifest.

Runtime packages remain `private: true` while the API is alpha. The release workflow builds inspectable npm tarballs, checksums and a manifest, but does not publish to a registry.

## Verify locally

```sh
python3 scripts/verify-runtime-packages.py
python3 scripts/build-release-bundle.py
python3 scripts/smoke-runtime-bundle.py
```

A release candidate must pack only declared files, keep all internal package versions aligned, pass `node --check`, and import from the actual tarballs in an isolated consumer.

## Bundle

Push a tag matching `signaal-v*` or run **Package release bundle** manually. CI uploads the three tarballs, `SHA256SUMS` and `release-manifest.json` as one workflow artifact.

Publishing is a separate future decision. Enabling it requires an explicit registry policy, package visibility decision and removal of `private: true` in the same reviewed change.
