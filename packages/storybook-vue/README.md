# @hugo-ui/storybook-vue

English | [简体中文](./README.zh-CN.md)

Vue Storybook development environment for Hugo UI. This is an internal workspace package that serves as an interactive playground for testing `@hugo-ui/shadcn-vue` components, exploring visual states, and validating accessibility.

## What's Included

- **Basic Components**: Button, Badge, Card, Input, Checkbox, Select, Combobox, Link, Modal, DropdownMenu
- **Data & Navigation**: DataGrid, Pagination, Progress, StatusBadge, MetricTile, WorkflowStepper, EmptyState, ErrorState, FileDropzone
- **Layout**: PageTemplate and ContentTemplate for common page patterns
- **Development Setup**: Local Vite aliases that resolve `@hugo-ui/shadcn-vue` imports directly to source files for fast iteration

## Commands

Run these from the repository root:

```bash
pnpm --filter @hugo-ui/storybook-vue run storybook        # Start dev server on http://localhost:6007
pnpm --filter @hugo-ui/storybook-vue run build-storybook  # Build static Storybook
pnpm --filter @hugo-ui/storybook-vue run typecheck        # Run TypeScript checks
```
