# HugoUI

React component library for the HugoUI design system.

## Package shape

This package is structured like a publishable npm package, while this workspace consumes it through
`pnpm` workspace links during local development.

Consumer-facing imports intentionally keep npm-style package names, as shown below.

## Usage

```tsx
import { useState } from 'react';
import { Button, DataGrid, Input, HugoUIProvider, hugoUITheme } from '@hugo-ui/mui';
import type { DataGridSort } from '@hugo-ui/mui';

const rows = [{ id: 'entry-1', label: 'Sample entry' }];
const columns = [
  {
    id: 'label',
    header: 'Item',
    sortable: true,
    minWidth: 160,
    render: (row: (typeof rows)[number]) => row.label,
  },
];

export function App() {
  const [sort, setSort] = useState<DataGridSort>(null);

  return (
    <HugoUIProvider theme={hugoUITheme}>
      <Button>Click</Button>
      <Input label="Name" />
      <DataGrid
        ariaLabel="Example entries"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
      />
    </HugoUIProvider>
  );
}
```

## Fonts (online/offline)

HugoUI can load Noto Sans automatically at runtime. By default, `HugoUIProvider` tries to load
local `@fontsource` files first (offline), and falls back to Google Fonts if they are not present.

Install the local font packages for offline use:

```bash
npm install @fontsource/noto-sans @fontsource/noto-sans-jp @fontsource/noto-sans-thai @fontsource/noto-sans-arabic
```

You can control loading behavior:

```tsx
<HugoUIProvider theme={hugoUITheme} fontLoading="auto" />
// fontLoading: 'auto' | 'local' | 'remote' | 'none'
```

## Subpath exports

```ts
import { onEnterKeyPress } from '@hugo-ui/mui/utils/wcagUtils';
import { hugoUITheme } from '@hugo-ui/mui/styles/theme';
```
