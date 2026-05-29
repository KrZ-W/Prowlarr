# syntax=docker/dockerfile:1.7
#
# Custom Prowlarr image built from this fork's source.
# Conventions match lscr.io/linuxserver/prowlarr so it's a drop-in
# image swap in existing docker-compose stacks:
#   - /config volume for app data
#   - PUID/PGID/TZ/UMASK env vars
#   - port 9696
#
# Build:
#   docker build -t krz-w/prowlarr:dev .
# Run:
#   docker run -d --name prowlarr -p 9696:9696 \
#       -e PUID=1000 -e PGID=1000 -e TZ=Europe/Paris \
#       -v /opt/stacks/prowlarr/config:/config krz-w/prowlarr:dev

# ----- frontend stage -----
FROM node:20.11.1-bookworm-slim AS frontend
WORKDIR /src

COPY package.json yarn.lock .yarnrc tsconfig.json ./
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY frontend ./frontend
RUN yarn build --env production

# ----- backend stage -----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend
WORKDIR /src

# Override the strict SDK pin in global.json so the build uses whatever
# 8.x SDK ships in the base image. The pin in source targets the dev
# machine's exact SDK and is not load-bearing for a container build.
RUN printf '{"sdk":{"version":"8.0.0","rollForward":"latestMajor"}}\n' > global.json
COPY src ./src
COPY Logo ./Logo

RUN dotnet msbuild -restore src/Prowlarr.sln \
        -p:SelfContained=true \
        -p:Configuration=Release \
        -p:Platform=Posix \
        -p:RuntimeIdentifiers=linux-x64 \
        -p:NuGetAudit=false \
        -p:RunAnalyzersDuringBuild=false \
        -p:TreatWarningsAsErrors=false \
        -t:PublishAllRids

# ----- runtime stage -----
FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-bookworm-slim AS runtime

ENV PUID=1000 \
    PGID=1000 \
    TZ=Etc/UTC \
    UMASK=002 \
    XDG_CONFIG_HOME=/config \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Prowlarr is an indexer manager — no media probing, so (unlike Radarr/Sonarr)
# ffmpeg/ffprobe are intentionally omitted.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gosu \
        tzdata \
        curl \
        ca-certificates \
        sqlite3 \
        libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=backend /src/_output/net8.0/linux-x64/publish/ /app/
COPY --from=backend /src/_output/Prowlarr.Update/net8.0/linux-x64/publish/ /app/Prowlarr.Update/
COPY --from=frontend /src/_output/UI/ /app/UI/

RUN rm -f /app/ServiceInstall.* /app/ServiceUninstall.* /app/Prowlarr.Windows.*

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh /app/Prowlarr

VOLUME ["/config"]
EXPOSE 9696

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -fsS http://localhost:9696/ping || exit 1

ENTRYPOINT ["/entrypoint.sh"]
