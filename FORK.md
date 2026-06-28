# KrZ-W/Prowlarr — Fork Notes

This is a personal fork of [Prowlarr](https://github.com/Prowlarr/Prowlarr) that adds a
configurable indexer cooldown schedule and a self-hosted Docker/GHCR deployment. It is
maintained by a single person for a private *arr stack and is not affiliated with the
Prowlarr team.

It is the smallest of the three KrZ-W *arr forks — Prowlarr is an indexer manager, so it
doesn't carry the language/custom-format features of the sibling
[Radarr](https://github.com/KrZ-W/Radarr) and [Sonarr](https://github.com/KrZ-W/Sonarr)
forks.

- **Upstream base:** Prowlarr `2.5.0.5422`
- **Primary branch:** `personal/all-features-master`
- **Container image:** `ghcr.io/krz-w/prowlarr`
- **Current fork version:** `v2.5.0.5422+krzw.1`

> The stock upstream `README.md` is preserved below this fork section. Everything
> KrZ-W-specific lives in [`docs/`](docs/) and [`CHANGELOG.md`](CHANGELOG.md).

## Features at a glance

| Feature | What it does | Docs |
|---|---|---|
| **Configurable Indexer Cooldown** | Make the indexer back-off/escalation schedule editable (adds a new Indexers → Options section that Prowlarr didn't have) | [features/configurable-indexer-cooldown.md](docs/features/configurable-indexer-cooldown.md) |
| **Docker / GHCR Deployment** | LinuxServer.io-style image (PUID/PGID/TZ/UMASK, `/config`, port 9696) published to GHCR — **no** ffmpeg (not needed) | [features/docker-deployment.md](docs/features/docker-deployment.md) |

## Versioning

This fork uses the upstream build version plus a fork counter as
[SemVer build metadata](https://semver.org/#spec-item-10):

```
v<upstream-version>+krzw.<N>
        │                │
        │                └─ fork release number on this base; resets to 1 on each rebase
        └─ the Prowlarr version this fork is rebased onto (e.g. 2.3.7.5365)
```

The `+` is valid in git tags / GitHub releases / SemVer but **not** in container image
tags, so the Docker tag replaces `+` with `-`:

```
git tag      v2.3.7.5365+krzw.1
docker image ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1
```

See [docs/releasing.md](docs/releasing.md) for how to cut a release.

> **In-app version:** the version Prowlarr shows in *System → Status* comes from
> upstream's build machinery and is **not** changed by this fork. Use the git/image tag
> above as the source of truth for "which fork build am I running".

## Pulling the image

```bash
# Pinned to a release (recommended for stability)
docker pull ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1

# Bleeding edge — tip of personal/all-features-master
docker pull ghcr.io/krz-w/prowlarr:latest
```

See [features/docker-deployment.md](docs/features/docker-deployment.md) for a full
`docker run` / compose example.

## Relationship to upstream

- `upstream` remote → `Prowlarr/Prowlarr` (the real project)
- `origin` remote → `KrZ-W/Prowlarr` (this fork)
- Each feature lives on its own `feature/*` branch and is merged into
  `personal/all-features-master`. See [CHANGELOG.md](CHANGELOG.md) for per-feature history.
