# Releasing (maintainer notes)

How to cut a versioned release of the KrZ-W/Prowlarr fork. See
[../FORK.md](../FORK.md#versioning) for the versioning scheme.

> **Note:** in this repo the fork remote is **`origin`** (`KrZ-W/Prowlarr`) and the real
> project is **`upstream`** (`Prowlarr/Prowlarr`) — the opposite naming from the Radarr
> and Sonarr forks, where the fork is `myfork`.

## Version format recap

```
git tag / GitHub release :  v<upstream-version>+krzw.<N>     e.g. v2.3.7.5365+krzw.1
docker image tag         :  <upstream-version>-krzw.<N>      e.g. 2.5.0.5422-krzw.1
```

- `<upstream-version>` = the Prowlarr version `personal/all-features-master` is rebased
  onto. Confirm it with:

  ```bash
  git describe --tags --abbrev=0 --match 'v*' \
    "$(git merge-base upstream/develop personal/all-features-master)"
  ```

- `<N>` starts at `1` for each new upstream base and increments for subsequent fork
  releases on that **same** base. After a rebase onto a newer upstream, reset to `1`.

## Steps

1. **Make sure `personal/all-features-master` is in the state you want to ship** and the
   image builds (the `docker-image.yml` workflow builds branch pushes).

2. **Update `CHANGELOG.md`:**
   - Move the entries under `[Unreleased]` into a new
     `## [v<ver>+krzw.<N>] — based on Prowlarr <upstream-version>` section.
   - Reset `[Unreleased]` to `_Nothing yet._`.
   - Update the two link-reference lines at the bottom of the file.

3. **Commit** the changelog (and any doc updates):

   ```bash
   git commit -am "docs: release v2.3.7.5365+krzw.1"
   git push origin personal/all-features-master
   ```

4. **Tag and push the tag.** The `+` is fine in a git tag:

   ```bash
   git tag -a 'v2.3.7.5365+krzw.1' -m 'Fork release based on Prowlarr 2.3.7.5365'
   git push origin 'v2.3.7.5365+krzw.1'
   ```

   This triggers `docker-release.yml`, which builds and pushes the immutable image tag
   `ghcr.io/krz-w/prowlarr:2.5.0.5422-krzw.1` (it maps `+` → `-` automatically).

5. **Create the GitHub release** from the tag, using the changelog section as the body:

   ```bash
   gh release create 'v2.3.7.5365+krzw.1' \
     --repo KrZ-W/Prowlarr \
     --title 'v2.3.7.5365+krzw.1' \
     --notes-file <(sed -n '/## \[v2.3.7.5365+krzw.1\]/,/## \[/p' CHANGELOG.md | sed '$d')
   ```

## After rebasing onto a newer upstream

1. Rebase the `feature/*` branch(es) onto the new `upstream/develop`, re-merge into
   `personal/all-features-master`, resolve conflicts.
2. Re-confirm the new `<upstream-version>` with the `git describe` command above.
3. Add an `[Unreleased]` → new-version section noting the rebase, then release as
   `v<new-upstream-version>+krzw.1`.

## CI overview

| Workflow | Trigger | Produces |
|---|---|---|
| `docker-image.yml` | push to `personal/**`, `feature/**`, `fix/**` | `:latest` (primary branch), `:<branch>`, `:sha-<short>` |
| `docker-release.yml` | push of a `v*` tag | `:<upstream-version>-krzw.<N>` (immutable release image) |
