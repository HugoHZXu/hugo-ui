# @hugo-ui/storybook

English | [简体中文](./README.zh-CN.md)

React Storybook development environment for Hugo UI. This is an internal workspace package that serves as an interactive playground for testing `@hugo-ui/mui` and `@hugo-ui/shadcn` components, exploring visual states, validating accessibility, and testing internationalization behavior.

## What's Included

- **MUI Components**: Stories for Button, Input, Modal, Table, DataGrid, PageTemplate, ContentTemplate, StatusTag, SearchBox, Toggle, Link, DetailCard, Message, Loading, and Typography
- **shadcn Components**: Stories for Button, Input, and Modal
- **Documentation**: MDX pages for color tokens, elevation, and typography
- **Internationalization**: Locale toolbar supporting English, Simplified Chinese, and Arabic (including RTL layout)
- **Development Setup**: Local Vite aliases that resolve package imports directly to source files for fast iteration

## Commands

Run these from the repository root:

```bash
pnpm --filter @hugo-ui/storybook run storybook        # Start dev server on http://localhost:6006
pnpm --filter @hugo-ui/storybook run build-storybook  # Build static Storybook
pnpm --filter @hugo-ui/storybook run typecheck        # Run TypeScript checks
```
