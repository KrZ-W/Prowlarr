# Changelog

All notable **fork-specific** changes to KrZ-W/Prowlarr are documented here.
This changelog covers only what this fork adds on top of upstream Prowlarr — it does
**not** reproduce [upstream's own changelog](https://github.com/Prowlarr/Prowlarr/releases).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this fork's versioning is described in [FORK.md](FORK.md#versioning):
`v<upstream-version>+krzw.<N>`.

## [Unreleased]

_Nothing yet._

## [v2.5.0.5422+krzw.1] — based on Prowlarr 2.5.0.5422

Maintenance release — rebased the fork onto upstream Prowlarr **2.5.0.5422** (from `2.3.7.5365`).
All fork features carry forward unchanged; the rebase was clean (no conflicts). The full feature set is unchanged
from the previous release (below).

### Changed

- Rebased onto upstream Prowlarr **2.5.0.5422** (from 2.3.7.5365), picking up upstream's fixes
  between those versions. No fork feature behavior changed.

Container image: `ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1`.

## [v2.3.7.5365+krzw.1] — based on Prowlarr 2.3.7.5365

First documented fork release. Bundles every feature currently merged into
`personal/all-features-master`. Container image:
`ghcr.io/krz-w/prowlarr:2.3.7.5365-krzw.1`.

### Added

- **Configurable indexer cooldown** — `IndexerCooldownPeriods` (CSV of minutes) in a new
  *Settings → Indexers → Options (advanced)* section, replacing the hard-coded escalation
  schedule for indexers only. Prowlarr had no indexer-config section, so this also adds a
  `config/indexer` API endpoint (`IndexerConfigController` + `IndexerConfigResource`) and
  the Options form. See [docs](docs/features/configurable-indexer-cooldown.md).
- **Docker image + GHCR publishing** — multi-stage `Dockerfile` (.NET 8),
  LinuxServer.io-compatible entrypoint (PUID/PGID/TZ/UMASK, `/config` volume, port 9696),
  and a GitHub Actions workflow that pushes to `ghcr.io/krz-w/prowlarr`. ffmpeg/ffprobe
  are intentionally omitted — Prowlarr does no media probing. See
  [docs](docs/features/docker-deployment.md).

### Fixed

- **`groupadd`/`useradd` use `-o`** in the Docker entrypoint so PUID/PGID can reuse an
  existing GID/UID; avoids container start failure when `PGID=100` collides with Debian's
  `users` group.

[Unreleased]: https://github.com/KrZ-W/Prowlarr/compare/v2.5.0.5422+krzw.1...HEAD
[v2.5.0.5422+krzw.1]: https://github.com/KrZ-W/Prowlarr/releases/tag/v2.5.0.5422%2Bkrzw.1
[v2.3.7.5365+krzw.1]: https://github.com/KrZ-W/Prowlarr/releases/tag/v2.3.7.5365%2Bkrzw.1
