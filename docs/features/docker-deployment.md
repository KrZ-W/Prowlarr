# Docker / GHCR Deployment

> **Status:** stable · **Since:** `v2.3.7.5365+krzw.1` · **Image:** `ghcr.io/krz-w/prowlarr`

## What it does

Adds a multi-stage **`Dockerfile`** that builds Prowlarr from source against **.NET 8**
and produces a runtime image following **LinuxServer.io-compatible** conventions, plus a
**GitHub Actions** workflow that publishes to **GitHub Container Registry (GHCR)** at
`ghcr.io/krz-w/prowlarr`.

## Image conventions

| Aspect | Value |
|---|---|
| Registry / image | `ghcr.io/krz-w/prowlarr` |
| Web UI port | `9696` |
| Config volume | `/config` |
| User mapping | `PUID` / `PGID` (default `1000` / `1000`) |
| Timezone | `TZ` (default `Etc/UTC`) |
| File mode | `UMASK` (default `002`) |
| Healthcheck | `GET http://localhost:9696/ping` |
| Base | `mcr.microsoft.com/dotnet/runtime-deps:8.0-bookworm-slim` |

## Why there's no ffmpeg

The sibling Radarr and Sonarr images bundle **ffprobe** (from ffmpeg) because those apps
probe media files at import. **Prowlarr does not** — it is an indexer manager that proxies
searches and pushes releases to other apps; it has no media-files pipeline and no
`FFMpegCore` dependency in its source. So ffmpeg is **intentionally omitted**:

- **No functional loss** — nothing in Prowlarr ever calls ffprobe.
- **Smaller image / smaller attack surface** — ffmpeg pulls in a large dependency tree.

If a future Prowlarr feature ever needed media probing, ffmpeg would have to be added
back — but as of this base version, nothing does.

## Image tags

| Tag | Points at | Use for |
|---|---|---|
| `2.5.0.5422-krzw.1` | a tagged release (immutable) | **production — pin to this** |
| `latest` | tip of `personal/all-features-master` | bleeding edge |
| `personal-all-features-master` | same branch (ref tag) | bleeding edge |
| `sha-<short>` | a specific commit | debugging / rollback |

> Release tags use `-krzw.N` because container registries don't allow `+` in tags; the
> matching git tag / GitHub release uses `+krzw.N`. See [../../FORK.md](../../FORK.md#versioning).

## Quick start

### docker run

```bash
docker run -d --name prowlarr \
  -p 9696:9696 \
  -e PUID=1000 -e PGID=1000 -e TZ=Europe/Paris -e UMASK=002 \
  -v /path/to/config:/config \
  ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1
```

### docker-compose

```yaml
services:
  prowlarr:
    image: ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1
    container_name: prowlarr
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Paris
      - UMASK=002
    volumes:
      - /path/to/config:/config
    ports:
      - 9696:9696
    restart: unless-stopped
```

> Prowlarr only needs its `/config` volume — it manages indexers, not media, so there are
> no media/download mounts.

## Notes & gotchas

- **PUID/PGID can reuse existing IDs.** The entrypoint runs `groupadd -o` / `useradd -o`,
  so a `PGID=100` (a common Proxmox/LXC default that collides with Debian's `users`
  group) no longer crashes container start.
- **`:latest` is bleeding edge, not stable.** It tracks the primary branch tip. Pin a
  `…-krzw.N` tag for anything you care about.
- **Platform:** images are built for `linux/amd64`.

## Building locally

```bash
docker build -t prowlarr-fork .
```

## Source

Commit: `b5bff1d30`. Key files: `Dockerfile`, `docker/entrypoint.sh`, `.dockerignore`,
`.github/workflows/docker-image.yml`.
