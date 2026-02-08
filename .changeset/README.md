# Changesets

We use Changesets to version and publish npm packages from this monorepo:
- `@idbridge/client`
- `@idbridge/shared` (published because `@idbridge/client` depends on it)

## Typical flow
- Add a changeset when you change `packages/client` and/or `packages/shared`:
  - `pnpm changeset`
- Release (CI or maintainer):
  - `pnpm changeset version`
  - `pnpm changeset publish`


