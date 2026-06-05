# Hugo UI

Design-system monorepo for reusable React component development.

This workspace contains two publish-shaped React component packages and one Storybook
verification app:

| Package              | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `@hugo-ui/mui`       | MUI + Emotion component package for shared interface UI.  |
| `@hugo-ui/shadcn`    | Tailwind/shadcn-style component package.                  |
| `@hugo-ui/storybook` | Private Storybook verification surface for both packages. |

## Package Layout

```txt
hugo-ui/
  packages/
    mui/
    shadcn/
    storybook/
```

## Usage

```tsx
import { HugoUIProvider, Table } from '@hugo-ui/mui';
import { Button } from '@hugo-ui/shadcn';
import '@hugo-ui/shadcn/styles.css';
```

## Development

From this directory:

```bash
pnpm install
pnpm run typecheck
pnpm run test:all
pnpm run build:all
pnpm run storybook
```

## AI Agent Workflow

AI agent instructions live in [`AGENTS.md`](./AGENTS.md). Supporting workflow docs and local skills
live in:

- [`docs/agent-workflow.md`](./docs/agent-workflow.md)
- [`docs/desensitization-rules.md`](./docs/desensitization-rules.md)
- [`.codex/skills`](./.codex/skills)

For non-interactive agent sessions, prefer the local Node wrapper:

```bash
./scripts/codex-node.sh pnpm run verify
```

## Publishing

The package manifests include public npm package names and publish metadata. Versioning and
publishing are managed through Changesets:

```bash
pnpm run changeset
pnpm run changeset:version
pnpm run changeset:publish
```

Actual npm publication requires access to the `@hugo-ui` npm scope.
