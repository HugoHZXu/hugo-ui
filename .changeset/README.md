# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versions and publish the `@hugo-ui/mui`, `@hugo-ui/shadcn`, and `@hugo-ui/shadcn-vue` packages.

## Quick Start

1. **Add a changeset** when you make consumer-visible changes:

   ```bash
   pnpm run changeset
   ```

   This will prompt you to select the affected packages and choose a version bump type (patch/minor/major).

2. **Version packages** (maintainer task, usually done before release):

   ```bash
   pnpm run changeset:version
   ```

   This bumps version numbers in `package.json` files and updates CHANGELOGs.

3. **Publish to npm** (requires npm access):

   ```bash
   pnpm run changeset:publish
   ```

## When to Add a Changeset

Add a changeset when your change affects:

- Public component APIs or props
- Package exports
- Visible styling or behavior changes
- New components or features

You don't need a changeset for:

- Internal refactoring with no consumer-visible changes
- Documentation-only updates
- Test-only changes
- Storybook-only demo updates
