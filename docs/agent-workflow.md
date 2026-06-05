# Agent Workflow

This repository is a standalone design-system monorepo. AI agents should treat it as a reusable
component library, not as an application domain.

## Working Context

- `packages/mui` owns generic MUI + Emotion components, design tokens, theme roles, provider logic, and component tests.
- `packages/shadcn` owns Tailwind/shadcn-style components and stylesheet exports.
- `packages/storybook` owns examples, visual states, docs, and provider/locale verification.
- `.changeset` owns release notes and versioning for publishable packages.

## Skill Routing

| Skill                               | Use When                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `$hugo-ui-component-change`         | Adding or changing `@hugo-ui/mui` components, props, exports, component tokens, tests, stories |
| `$design-token-audit`               | Changing colors, semantic roles, hover/selected/status states, surfaces, or alpha usage        |
| `$component-change-verification`    | Choosing verification after component, Storybook, package, export, provider, or alias changes  |
| `$portfolio-desensitization-review` | Adding public docs, Storybook examples, README copy, sample data, or public-facing narrative   |

## Default Flow

1. Inspect local patterns before editing. Use nearby components, token files, tests, and stories as the guide.
2. State the impact surface before high-risk edits such as exports, providers, aliases, tokens, or Storybook config.
3. Keep `@hugo-ui/mui` and `@hugo-ui/shadcn` responsibilities separate.
4. Make the smallest scoped patch that satisfies the request.
5. Add tests, stories, README examples, and changesets when the public surface changes.
6. Validate from the nearest relevant package outward.

## Validation Cheatsheet

Use the local Node wrapper so non-interactive shells load `.nvmrc`:

```bash
./scripts/codex-node.sh pnpm run lint
./scripts/codex-node.sh pnpm run typecheck
./scripts/codex-node.sh pnpm run test:all
./scripts/codex-node.sh pnpm run build:all
./scripts/codex-node.sh pnpm run verify
```

For narrow changes:

```bash
./scripts/codex-node.sh pnpm run test-mui
./scripts/codex-node.sh pnpm run test-shadcn
./scripts/codex-node.sh pnpm run build-mui
./scripts/codex-node.sh pnpm run build-shadcn
./scripts/codex-node.sh pnpm run build-storybook
```

Do not start Storybook unless the user explicitly asks for a running server.

## Public Safety

- Do not add private code, private token names, identifiable data, production logs, private screenshots, real endpoints, or secrets.
- Storybook examples must remain synthetic, neutral, and UI-focused.
- Component names and token names should describe reusable UI decisions, not application-domain concepts.
