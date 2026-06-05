---
name: hugo-ui-component-change
description: Guide implementation and verification for hugo-ui component changes. Use when adding or changing generic components, component props, exports, component tokens, tests, or Storybook stories in packages/mui.
---

# Hugo UI Component Change

Use this skill before editing `packages/mui` component code or immediately after inheriting a component patch.

## Step 1: Classify The Component Change

Decide whether the change is:

- new component
- component behavior change
- style/token-only change
- public prop/API change
- export-only change
- Storybook/test-only change

If props, exports, shared tokens, or theme behavior change, treat it as public surface.

## Step 2: Read Local Patterns First

Before editing:

- inspect a similar component under `packages/mui/src`
- inspect its `styles/*Tokens.ts`, `styles/*Styles.ts`, tests, and Storybook story
- prefer existing MUI, Emotion, provider, RTL, locale, and token patterns

Do not import application-domain concepts into `@hugo-ui/mui`. Components must stay generic.

## Step 3: Keep API And Responsibility Small

- Keep public props minimal and composable.
- Do not put application-domain logic or sample data into generic components.
- Do not add table search/filter/query behavior to `Table`.
- Keep domain state to visual tone mapping outside visual components like `StatusTag`.
- Use generic names such as `SearchBox`, `Toggle`, and `ContentTemplate`, not domain-specific variants.

## Step 4: Use The Design System Layer

- Consume `theme.hugoUIColorRoles` first.
- Use `theme.hugoUIColors` only when no semantic role exists.
- Do not use `alpha(...)` for ordinary hover, selected, active, or status colors when an existing token fits.
- Split component logic, token files, and style files.
- Add or update token files for reusable component-specific decisions.

If the task changes colors or roles, run `$design-token-audit`.

## Step 5: Required Follow-Through

For public or visible changes:

- add/update Jest tests
- add/update Storybook stories
- update package exports
- add/update README examples when usage changes
- add/update changeset for consumer-visible changes
- check Storybook imports in `packages/storybook`

## Step 6: Validate

Prefer Node 22.12+ through the local wrapper:

```bash
./scripts/codex-node.sh pnpm --filter @hugo-ui/mui run typecheck
./scripts/codex-node.sh pnpm --filter @hugo-ui/mui run lint
./scripts/codex-node.sh pnpm --filter @hugo-ui/mui run test -- --runTestsByPath <changed-test-file>
./scripts/codex-node.sh pnpm run build-mui
```

Escalate to Storybook or root validation when exports, stories, theme, provider, or cross-package consumers changed.

Do not start Storybook unless the user explicitly asks.
