# AGENTS

## 语言偏好

- 默认始终使用简体中文回复用户，包括计划、进度更新、解释、总结和最终结果。
- 代码、命令、文件路径、API 名称、错误信息、日志、第三方输出和专有名词可以保留英文。

## Repo Role

- This repository is the standalone `hugo-ui` pnpm workspace for design-system development.
- `packages/mui` is the primary MUI + Emotion component package and source of truth for shared components.
- `packages/shadcn` is the Tailwind/shadcn-style component package. Keep it separate from `packages/mui`.
- `packages/storybook` is the private interactive verification surface for both packages.
- The repository is public-safe design-system work. It should contain generic reusable UI, not private application code or identifiable data.

## Core Boundaries

- Prefer small, package-scoped changes. Avoid mixing unrelated edits across packages.
- Do not edit generated output in `dist`, `coverage`, `storybook-static`, `node_modules`, or `*.tsbuildinfo`.
- Preserve user changes already present in the worktree. Do not revert unrelated edits.
- Keep `@hugo-ui/mui` and `@hugo-ui/shadcn` responsibilities separate. Do not move shadcn implementations into MUI unless explicitly requested.
- When touching shared infra such as providers, aliases, tokens, exports, package manifests, or Storybook config, prefer the smallest viable change.
- Do not add private code, identifiable data, real endpoints, access tokens, screenshots, production logs, or private operational rules.
- Storybook examples should use neutral UI concepts such as items, examples, components, sections, panels, files, notes, and visual states.

## Design System Rules

- `packages/mui/src/styles/color.ts` is the raw palette.
- `packages/mui/src/styles/colorRoles.ts` is the semantic role layer.
- Components should consume `theme.hugoUIColorRoles` first. Use `theme.hugoUIColors` only when no semantic role fits.
- If the same raw color is needed by more than one component for the same purpose, prefer adding or reusing a semantic role instead of repeating raw palette references.
- Do not use `alpha(...)` to invent hover, selected, active, or status colors when an existing token or semantic role fits.
- Hover and selected surfaces should prefer low-contrast semantic surface roles such as `surface.tinted`, not high-contrast brand or accent colors.
- Public component styling should be split into component logic, style files, and token files.
- `Table` must stay generic. Do not add page-level search, filters, batch actions, route navigation, data fetching, or application query behavior directly to `Table`.
- Render visual state pills with `StatusTag`; keep domain-state-to-tone mapping outside the generic component.
- Public component changes require aligned tests, Storybook stories, exports, README examples, and a changeset when consumer-visible behavior changes.

## Current Architecture Boundaries

- `packages/mui`: MUI + Emotion design system, generic components, provider, theme tokens, component tests.
- `packages/shadcn`: Tailwind/shadcn-style components, Radix primitives, package stylesheet.
- `packages/storybook`: component demos, docs, visual state coverage, provider/locale verification. Do not place component source of truth here.
- `.changeset`: package versioning and release notes for publishable packages.

## Project Skills

- Use `$hugo-ui-component-change` when changing or adding `@hugo-ui/mui` components, props, exports, stories, tests, provider behavior, or component tokens.
- Use `$design-token-audit` before changing color roles, raw palette usage, hover/selected states, status colors, headers, surfaces, or alpha-based styling.
- Use `$component-change-verification` after component, Storybook, export, provider, alias, package wiring, or token changes to choose the smallest sufficient verification path.
- Use `$portfolio-desensitization-review` when adding Storybook examples, docs, README content, sample data, or public-facing copy.

## Plan Before Editing

- Make a brief plan first when the task changes package boundaries, touches shared infra, changes public APIs, affects Storybook setup, or modifies publish/package infrastructure.
- Skip formal planning only for narrow, low-risk edits such as a focused component fix, local test update, or typo-level documentation change.
- For investigation-only tasks, prefer no-edit analysis first. Gather evidence before proposing code changes.

## High-Risk Changes

Treat these as high risk and call out the impact surface before editing:

- Changes to `packages/storybook/.storybook/main.ts` or `packages/storybook/.storybook/preview.tsx`
- Changes to package exports, subpath exports, or root `src/index.ts` files
- Changes to providers, theme setup, aliases, tokens, or shared style infrastructure
- Changes to public component props or consumer-facing package APIs
- Changes to package manifests, peer dependencies, publish metadata, or Changesets config

For high-risk changes:

- Prefer a minimal patch over a broad refactor.
- Validate more than the local file you changed.
- Mention likely downstream effects in the final summary.

## Frontend-Specific Risks

- If public props change, sync implementation, tests, stories, exports, and README examples.
- If exports change, check package entrypoints, subpath exports, Storybook imports, and changeset needs.
- If aliases or provider wiring change, verify Storybook still resolves local package imports.
- If theme or token files change, assume cross-component blast radius until verified.
- If a story or docs page relies on locale, keep `preview.tsx` provider setup working for `en`, `zh`, and `ar`.
- Do not let `@hugo-ui/shadcn` utility patterns or styling decisions silently leak into `@hugo-ui/mui`.

## React Compiler Guardrails

- React Compiler is not enabled for this repository.
- Do not add React Compiler config, `"use memo"` directives, or compiler-driven memoization changes unless explicitly requested.
- Do not delete `useMemo` or `useCallback` from provider, context, locale, RTL, or package API boundaries just because a compiler could manage it elsewhere.

## Definition Of Done

- Component behavior changes in `packages/mui` or `packages/shadcn` include tests when behavior changed.
- Public-facing visible changes update or add Storybook stories in `packages/storybook`.
- Public API or consumer-visible package changes require a changeset unless explicitly waived.
- Export changes keep package entrypoints, consumer import paths, Storybook imports, and README examples aligned.
- Generated output must not be left behind as tracked files.
- Do not start Storybook or any local dev server after code updates unless explicitly asked.
- Validation must follow the default ladder unless the task is investigation-only or the user requested a narrower scope.

## Default Validation Ladder

- First: run the nearest unit, package, or file-scoped validation that matches the change.
- Then: run the affected package build for public component, export, package wiring, or styling changes.
- Then: run Storybook build validation if shared UI surface, provider wiring, aliasing, docs rendering, or stories were affected.
- Finally: use root-level validation only for cross-package, shared infra, or broad-impact changes.

## Validation Routing

### Component Implementation Changes

- For one `@hugo-ui/mui` component under `packages/mui/src/<Component>/`, run the closest package tests first.
- If the component has a matching story, update or verify the story in `packages/storybook/src/stories/`.
- After a public component change, run `./scripts/codex-node.sh pnpm run build-mui`.

### `@hugo-ui/shadcn` Component Changes

- For changes under `packages/shadcn/src/components/ui/`, run `./scripts/codex-node.sh pnpm run test-shadcn` first.
- If the component is used in Storybook, verify or update the relevant story.
- After a public component change, run `./scripts/codex-node.sh pnpm run build-shadcn`.

### Export Surface Changes

- If you changed `packages/mui/src/index.ts`, package subpath exports, or `packages/shadcn/src/index.ts`, check all affected exports compile and remain consumable.
- Review nearby README examples when consumer-facing imports changed.
- Check whether the change requires a changeset.

### Storybook Changes

- If you changed files under `packages/storybook/src/stories/`, run the local validation that proves the story still compiles.
- If you changed `.storybook/main.ts`, `.storybook/preview.tsx`, decorators, aliases, or provider wiring, treat it as high risk and run Storybook build validation.
- If you changed story-only docs content with no runtime impact, typecheck may be enough.

### Shared Styling And Provider Changes

- For changes to theme, token, global style, provider, locale, or alias files, do not stop at a single test file.
- Run package builds for affected libraries.
- If Storybook consumes the changed surface, run Storybook build validation too.

### Cross-Package Changes

- If the change spans `@hugo-ui/mui`, `@hugo-ui/shadcn`, and `@hugo-ui/storybook`, prefer root validation commands.
- Use `./scripts/codex-node.sh pnpm run typecheck`, `./scripts/codex-node.sh pnpm run test:all`, `./scripts/codex-node.sh pnpm run build:all`, or `./scripts/codex-node.sh pnpm run verify` when the impact surface is broad.

## Validation Failures And Stop Conditions

- If validation fails, first determine whether the failure was introduced by the current change or already existed.
- Do not fix unrelated pre-existing failures unless asked for broader repair.
- If a new failure is caused by the current patch, prefer shrinking the change over expanding into a broader refactor.
- If reliable validation is not possible, report the unverified area explicitly instead of implying success.
- If Storybook runtime behavior, browser-specific behavior, or visual regressions cannot be confirmed locally, say so clearly.

## Common Commands

- Install dependencies: `./scripts/codex-node.sh pnpm install`
- Start Storybook: `./scripts/codex-node.sh pnpm run storybook`
- Lint all workspaces: `./scripts/codex-node.sh pnpm run lint`
- Typecheck all workspaces: `./scripts/codex-node.sh pnpm run typecheck`
- Test `@hugo-ui/mui`: `./scripts/codex-node.sh pnpm run test-mui`
- Test `@hugo-ui/shadcn`: `./scripts/codex-node.sh pnpm run test-shadcn`
- Test all component packages: `./scripts/codex-node.sh pnpm run test:all`
- Build `@hugo-ui/mui`: `./scripts/codex-node.sh pnpm run build-mui`
- Build `@hugo-ui/shadcn`: `./scripts/codex-node.sh pnpm run build-shadcn`
- Build Storybook: `./scripts/codex-node.sh pnpm run build-storybook`
- Build all packages and Storybook: `./scripts/codex-node.sh pnpm run build:all`
- Full repo verification: `./scripts/codex-node.sh pnpm run verify`
- Create a changeset: `./scripts/codex-node.sh pnpm run changeset`

Codex command sessions may not inherit the interactive terminal's nvm PATH. When running Node.js, pnpm, or package scripts in this repository, use `./scripts/codex-node.sh <command>` so `.nvmrc` is loaded before the command runs.

## Package Notes

### `packages/mui`

- Uses React, TypeScript, Vite, Jest, MUI, Emotion, and React Intl.
- Main public exports live in `packages/mui/src/index.ts` and component `index.ts` files.
- When public APIs change, keep exports, tests, stories, changesets, and README usage aligned.

### `packages/shadcn`

- Uses React, TypeScript, Vite, Jest, Tailwind CSS v4, Radix, and shadcn-style primitives.
- Main public exports live in `packages/shadcn/src/index.ts`.
- Keep stylesheet imports and Storybook aliases aligned when moving files or changing paths.

### `packages/storybook`

- Storybook is the main interactive verification surface.
- Local package aliases are configured in `packages/storybook/.storybook/main.ts`.
- Locale-aware examples depend on provider setup in `packages/storybook/.storybook/preview.tsx`.
- Story changes should reflect real package APIs rather than private implementation details.
