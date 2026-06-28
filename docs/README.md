# KrZ-W/Prowlarr Documentation

Documentation for the KrZ-W fork of Prowlarr. For the high-level overview and versioning
scheme, see [`../FORK.md`](../FORK.md). For the release history, see
[`../CHANGELOG.md`](../CHANGELOG.md).

This is the smallest of the three KrZ-W *arr forks. Its two features each have a clear
**Configuration** section in their reference page, so there is no separate user guide —
the feature pages double as the how-to.

## Feature Reference

| Feature | Summary |
|---|---|
| [Configurable Indexer Cooldown](features/configurable-indexer-cooldown.md) | Editable indexer back-off/escalation schedule (new Indexers → Options section) |
| [Docker / GHCR Deployment](features/docker-deployment.md) | LinuxServer.io-style image published to GHCR (no ffmpeg) |

## Maintainer

- **[Releasing](releasing.md)** — how to cut a versioned release (tag → image → GitHub release).

## Conventions used in these docs

- The fork remote is **`origin`** (`KrZ-W/Prowlarr`); the real project is **`upstream`**
  (`Prowlarr/Prowlarr`).
- Versioning: `v<upstream-version>+krzw.<N>` — see [../FORK.md](../FORK.md#versioning).
