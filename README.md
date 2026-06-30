# Hugo UI

English | [简体中文](./README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Hugo UI is a standalone design system monorepo for building reusable React and Vue components. It includes production-ready component libraries and Storybook apps for interactive demos and visual testing.

All examples and documentation use neutral mock data to keep components reusable across different product contexts.

## Packages

| Package                                                        | Description                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`@hugo-ui/mui`](./packages/mui/README.md)                     | React components built with MUI + Emotion, with theming and i18n support.   |
| [`@hugo-ui/shadcn`](./packages/shadcn/README.md)               | Lightweight React components using Tailwind CSS and shadcn-style patterns.  |
| [`@hugo-ui/shadcn-vue`](./packages/shadcn-vue/README.md)       | Vue 3 components using Tailwind CSS and shadcn-vue conventions.             |
| [`@hugo-ui/storybook`](./packages/storybook/README.md)         | React Storybook playground for demos and visual testing.                    |
| [`@hugo-ui/storybook-vue`](./packages/storybook-vue/README.md) | Vue Storybook playground for demos and visual testing.                      |

## Live Demos

Check out the interactive Storybook demos:

| Demo            | URL                                                                                |
| --------------- | ---------------------------------------------------------------------------------- |
| React Storybook | [https://hugohzxu.github.io/hugo-ui/](https://hugohzxu.github.io/hugo-ui/)         |
| Vue Storybook   | [https://hugohzxu.github.io/hugo-ui/vue/](https://hugohzxu.github.io/hugo-ui/vue/) |

## Requirements

- Node.js `>=22.12.0`
- pnpm `>=10.34.1 <11` (pinned to `pnpm@10.34.1` via `packageManager`)

## Quick Start

Install dependencies and use components in your project:

```bash
# For MUI + Emotion components
npm install @hugo-ui/mui @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom react-intl

# For shadcn-style React components
npm install @hugo-ui/shadcn react react-dom
```

Import and use components:

```tsx
import { DataGrid, HugoUIProvider, Table } from '@hugo-ui/mui';
import { Button } from '@hugo-ui/shadcn';
import '@hugo-ui/shadcn/styles.css';
```

See individual package READMEs for detailed usage examples.

## Project Structure

```txt
hugo-ui/
  packages/
    mui/             # MUI + Emotion React components
    shadcn/          # Tailwind/shadcn React components
    shadcn-vue/      # Tailwind/shadcn Vue components
    storybook/       # React Storybook app
    storybook-vue/   # Vue Storybook app
```

## Local Development

Run these commands from the repository root:

```bash
pnpm install
pnpm run typecheck
pnpm run test:all
pnpm run build:all

# Start Storybook dev servers
pnpm run storybook      # React Storybook on http://localhost:6006
pnpm run storybook-vue  # Vue Storybook on http://localhost:6007
```

> **Note**: Use `./scripts/codex-node.sh <command>` to ensure the correct Node version is loaded from `.nvmrc`.

## Publishing

Versioning and releases are managed with Changesets:

```bash
pnpm run changeset          # Create a new changeset
pnpm run changeset:version  # Bump versions and update changelogs
pnpm run changeset:publish  # Publish to npm
```

Publishing to npm requires access to the `@hugo-ui` npm organization.

## License

MIT © Hugo UI contributors
