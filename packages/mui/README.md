# @hugo-ui/mui

English | [简体中文](./README.zh-CN.md)

React components for Hugo UI, built with MUI (Material UI) and Emotion. This package provides reusable UI components, layout templates, semantic theming, internationalization support, and comprehensive tests.

## Installation

```bash
npm install @hugo-ui/mui @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom react-intl
```

Optional font packages for offline font loading:

```bash
npm install @fontsource/noto-sans @fontsource/noto-sans-jp @fontsource/noto-sans-thai @fontsource/noto-sans-arabic
```

## Quick Start

Wrap your application with `HugoUIProvider` at the root, then import components directly from the package:

```tsx
import { useState } from 'react';
import { Button, DataGrid, HugoUIProvider, Input, hugoUITheme } from '@hugo-ui/mui';
import type { DataGridColumn, DataGridSort } from '@hugo-ui/mui';

type Row = { id: string; label: string; section: string };

const rows: Row[] = [{ id: 'entry-1', label: 'Sample entry', section: 'Alpha' }];
const columns: DataGridColumn<Row>[] = [
  { id: 'label', header: 'Item', sortable: true, minWidth: 160, render: (row) => row.label },
  { id: 'section', header: 'Section', minWidth: 140, render: (row) => row.section },
];

export function App() {
  const [sort, setSort] = useState<DataGridSort>(null);

  return (
    <HugoUIProvider theme={hugoUITheme} locale="en">
      <Input label="Item name" />
      <Button type="button">Save</Button>
      <DataGrid
        ariaLabel="Example entries"
        columns={columns}
        getRowId={(row) => row.id}
        onSortChange={setSort}
        rows={rows}
        sort={sort}
      />
    </HugoUIProvider>
  );
}
```

## Available Components

- **Actions & Links**: `Button`, `Link`, `ButtonLink`
- **Inputs & Controls**: `Input`, `SearchBox`, `Toggle`
- **Feedback & Status**: `Message`, `StatusTag`, `Modal`, `Feedback`
- **Data Display**: `Table`, `DataGrid`, `DetailCard`
- **Layout**: `PageTemplate`, `ContentTemplate`
- **Typography & Theming**: `Typography`, `hugoUITheme`, `HugoUIProvider`

## Provider & Internationalization

`HugoUIProvider` integrates MUI theming, Hugo UI global styles, React Intl for i18n, Emotion cache configuration, font loading, and RTL (right-to-left) layout support.

```tsx
<HugoUIProvider locale="ar" messages={messages} fontLoading="auto">
  <App />
</HugoUIProvider>
```

The `fontLoading` prop accepts: `auto`, `local`, `remote`, or `none`.

## Subpath Imports

You can also import utilities and theme tokens directly from subpaths:

```ts
import { hugoUITheme } from '@hugo-ui/mui/styles/theme';
import { onEnterKeyPress } from '@hugo-ui/mui/utils/wcagUtils';
```

## Local Development

From the repository root:

```bash
pnpm --filter @hugo-ui/mui run test
pnpm --filter @hugo-ui/mui run typecheck
pnpm --filter @hugo-ui/mui run build
```
