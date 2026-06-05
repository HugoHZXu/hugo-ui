---
name: component-change-verification
description: Validate component-library code changes in this React/Storybook monorepo. Use when Codex changes components, props, exports, stories, providers, aliases, theme tokens, package manifests, or package wiring and needs the smallest sufficient local verification path.
---

# Component Change Verification

Use this skill after component-related edits, Storybook edits, package wiring changes, or when asked what should be verified before finishing a patch.

This repository has three important roles:

- `packages/mui`: primary component library and source of truth
- `packages/shadcn`: Tailwind/shadcn-style package that should not silently drive `@hugo-ui/mui` decisions
- `packages/storybook`: demo and verification surface for both libraries, not the source of truth for component behavior

Prefer the smallest reliable validation path. Expand only when the change touches shared surfaces or high-risk files.

## Step 1: Classify The Change

Classify the patch before running commands.

- `component-local`: one component implementation, test, or story changed
- `public-api`: props, exports, entrypoints, package manifests, consumer imports, or README usage changed
- `storybook-surface`: stories, decorators, preview, main config, provider wiring, aliasing, or docs rendering changed
- `shared-style`: tokens, theme, provider, global styles, locale, RTL, or shared hooks changed
- `cross-package`: changes span multiple packages or package boundaries
- `investigation-only`: the user asked for analysis, root cause, audit, or planning without asking for code changes

Use these priority rules:

- Prefer `storybook-surface` for `.storybook/main.ts`, `.storybook/preview.tsx`, decorators, aliasing, docs rendering, or provider wiring specific to Storybook composition.
- Prefer `shared-style` for theme, tokens, global styles, locale, RTL, or shared hooks even if Storybook also consumes them.
- Prefer `public-api` when exports, props, manifests, or consumer imports changed.
- Prefer `cross-package` when the patch materially changes more than one package boundary.

If the task is `investigation-only`, do not run edit-oriented validation by default. Inspect affected files and suggest the smallest future validation set.

## Step 2: Check Required Follow-Through

- Behavior changed: require tests.
- Public-facing usage changed: require stories.
- Consumer-visible package change: require changeset unless explicitly waived.
- Export change: require entrypoint alignment and import-path review.
- Docs or README examples affected: require example sync.
- Peer dependency or publish metadata changed: verify package build and lockfile/package manifest consistency.

## Step 3: Use The Validation Ladder

1. Nearest unit or package-scoped validation
2. Affected package build
3. Storybook build when shared UI surface is affected
4. Root-level verification only for cross-package or infra-heavy changes

## Step 4: Choose Commands By Change Type

Use repository-defined scripts:

- `./scripts/codex-node.sh pnpm run test-mui`
- `./scripts/codex-node.sh pnpm run test-shadcn`
- `./scripts/codex-node.sh pnpm run build-mui`
- `./scripts/codex-node.sh pnpm run build-shadcn`
- `./scripts/codex-node.sh pnpm run build-storybook`
- `./scripts/codex-node.sh pnpm run typecheck`
- `./scripts/codex-node.sh pnpm run test:all`
- `./scripts/codex-node.sh pnpm run build:all`
- `./scripts/codex-node.sh pnpm run verify`

### `component-local`

- Run nearest relevant tests first.
- If the component has a story, verify or update that story.
- Run the package build if the change affects exported behavior or styling visible to consumers.

Examples:

- `packages/mui/src/<Component>/...`: `pnpm run test-mui`, then `pnpm run build-mui` if public behavior changed.
- `packages/shadcn/src/components/ui/...`: `pnpm run test-shadcn`, then `pnpm run build-shadcn` if public behavior changed.

### `public-api`

- Verify tests for changed behavior.
- Verify stories for visible usage changes.
- Run affected package build.
- Review package entrypoints and README examples.
- Check whether a changeset is required.
- For `@hugo-ui/mui`, public API changes may require Storybook updates in `@hugo-ui/storybook`.

### `storybook-surface`

- Treat `.storybook/main.ts`, `.storybook/preview.tsx`, decorators, alias changes, and provider wiring as high risk.
- Run type-level validation if the change is docs-only.
- Run Storybook build when runtime composition, aliasing, provider setup, or shared rendering behavior changed.
- If locale or provider behavior changed in Storybook, keep `en`, `zh`, and `ar` assumptions intact unless asked otherwise.

### `shared-style`

- Assume broad blast radius until proven otherwise.
- Run affected package builds.
- Run Storybook build if stories consume the changed styling surface.
- Treat locale, theme, token, and provider changes as repo-wide UX risks even when the code diff is small.

### `cross-package`

- Start with the closest package checks if they are cheap and informative.
- Then escalate to root commands such as `pnpm run typecheck`, `pnpm run test:all`, `pnpm run build:all`, or `pnpm run verify`.
- If Storybook conflicts with library behavior, prefer library truth over demo convenience unless the user explicitly wants demo-driven behavior.

## Step 5: Handle Failures Conservatively

- First decide whether the failure predated the current change.
- Do not fix unrelated failures unless the user asked for broader repair.
- If the patch introduced the failure, prefer shrinking the patch over adding more refactors.
- If reliable validation is impossible, report the gap instead of implying success.

## Step 6: Report Outcome Clearly

End with:

- `Change class`
- `Required follow-through`
- `Commands run`
- `Commands intentionally skipped`
- `Remaining risks`
