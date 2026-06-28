# Configurable Indexer Cooldown

> **Status:** stable · **Since:** `v2.3.7.5365+krzw.1` · **Surface:** Settings → Indexers → Options (advanced)

## What it does

Makes the **indexer back-off / escalation schedule** editable. When an indexer fails,
Prowlarr disables it for an increasing amount of time (the "cooldown"). Upstream
hard-codes this schedule; this fork exposes it as a setting so you can make a flaky
indexer back off faster or slower.

Because Prowlarr had **no indexer-config section at all**, this feature also adds the
plumbing for one: a new `config/indexer` API endpoint and an **Options** form on the
existing *Settings → Indexers* page.

## Why it exists

The default escalation is `[0, 1, 5, 15, 30, 60, 180, 360, 720, 1440]` minutes and is not
user-adjustable. Depending on your indexers you may want shorter cooldowns (retry sooner)
or longer ones (stop hammering a rate-limited indexer).

## Settings

**Settings → Indexers → Options** (a new *advanced* section) gains:

| Setting | Format |
|---|---|
| **Indexer Cooldown Periods** | CSV of minutes, e.g. `0,2,10,30,120` |

Rules:

- The **first value must be `0`** (auto-prepended if you omit it).
- **Empty** falls back to the upstream default `0,1,5,15,30,60,180,360,720,1440`.
- Values are the successive cooldown durations after each consecutive failure.

## Behavior & edge cases

- **Indexers only.** Download clients, notifications, and **applications** (Radarr/Sonarr
  sync targets) keep their existing escalation behavior (enforced via a
  `_maximumEscalationLevelOverride` backing field on the shared `ProviderStatusServiceBase`).
- Once the failure count exceeds the number of entries, the last (longest) period
  continues to apply.

## Configuration

1. **Settings → Indexers** — make sure *Advanced Settings* (top-right toggle) is shown.
2. **Options → Indexer Cooldown Periods** — enter your CSV, e.g. `0,2,10,30,120`.
3. Save.

## Source

Commit: `7f28070e0`. Key files: `Configuration/ConfigService.cs`,
`Indexers/IndexerStatusService.cs`, `ThingiProvider/Status/ProviderStatusServiceBase.cs`,
`Prowlarr.Api.V1/Config/IndexerConfigController.cs`,
`Prowlarr.Api.V1/Config/IndexerConfigResource.cs`,
`frontend/src/Settings/Indexers/Options/IndexerOptions.js`.

> This feature also exists in the KrZ-W forks of **Radarr** and **Sonarr** (where the
> Indexers → Options section already existed).
