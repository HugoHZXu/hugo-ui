# @hugo-ui/shadcn-vue

Vue + Tailwind + shadcn-vue components for Hugo UI experiments.

## Usage

Import the library stylesheet once in your app entry:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import '@hugo-ui/shadcn-vue/styles.css';
import {
  Button,
  Checkbox,
  Combobox,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  FileDropzone,
  Input,
  Link,
  MetricTile,
  Modal,
  ModalContentText,
  Progress,
  Select,
  StatusBadge,
  WorkflowStepper,
} from '@hugo-ui/shadcn-vue';

const open = ref(false);
const files = ref<File[]>([]);
const action = ref('assign');
const selectedItem = ref<string | number | null>(null);
const actions = [
  { label: 'Assign', value: 'assign' },
  { label: 'Revoke', value: 'revoke' },
];
const searchableItems = [
  { label: 'Alpha item', value: 'alpha', description: 'Available for the first section' },
  { label: 'Beta item', value: 'beta', description: 'Available for the second section' },
  { label: 'Gamma item', value: 'gamma', disabled: true },
];
const steps = [
  { id: 'prepare', title: 'Prepare', status: 'success' },
  { id: 'review', title: 'Review', status: 'active' },
  { id: 'finish', title: 'Finish' },
];
</script>

<template>
  <form class="grid gap-4">
    <Input label="Item name" placeholder="Add a label" required />
    <Select v-model="action" label="Action" :options="actions" />
    <Combobox v-model="selectedItem" label="Searchable item" :options="searchableItems" clearable />
    <Checkbox label="Enable sample option" />
    <Link href="#sample-note">Read sample note</Link>
    <Button type="submit">Save</Button>
  </form>

  <Modal v-model:open="open" title="Review changes">
    <ModalContentText>Confirm the selected example before saving.</ModalContentText>
  </Modal>

  <MetricTile label="Ready" :value="24" description="items available" tone="success" />
  <StatusBadge status="ready" show-dot />
  <Progress label="Processing" :model-value="64" show-value />
  <WorkflowStepper :steps="steps" />
  <FileDropzone v-model="files" accept=".csv,.txt" title="Upload a sample file" />

  <DropdownMenu>
    <template #trigger>
      <Button variant="outline">Actions</Button>
    </template>
    <DropdownMenuItem shortcut="Cmd+E">Export</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive>Remove</DropdownMenuItem>
  </DropdownMenu>
</template>
```

## Component Notes

`Input` supports `input` and `textarea` rendering through the `as` prop. It exposes stable
`data-component="hugo-input"` and `data-slot` hooks for `root`, `label`, `control`, `input`,
`textarea`, `adornment`, `helper`, `counter`, `status`, `spinner`, and `required-mark`.
Use `slotProps` for native attributes and `classNames` for slot-level styling.

`Select` wraps reka-ui select primitives for small fixed option sets. It supports `v-model`,
placeholder text, disabled and disabled-option states, size, error messaging, grouped options,
keyboard navigation, focus handling, and stable slot hooks for root, label, control, value, content,
groups, items, and helper text.

`Combobox` wraps reka-ui combobox primitives for searchable choices. Use local `options` for
client-side filtering or `search` with `debounce` for asynchronous results. It supports
`v-model:query`, loading and empty states, option descriptions, grouped options, clearable
selection, keyboard selection, and the same helper/error styling contract as `Select`.

`Checkbox` supports checked, unchecked, and indeterminate states through `modelValue` or
`defaultValue`. It exposes stable `data-component="hugo-checkbox"` and `data-slot` hooks for
`root`, `checkbox-control`, `checkbox-box`, `checkbox-indicator`, `checkbox-icon`,
`checkbox-content`, `checkbox-label`, and `checkbox-description`.

`Modal` provides transactional, destructive, warning, informational, and error dialog variants. Use
`buttonDefs` to override action labels or handlers, named slots for custom header/footer content,
and `classNames` or `slotProps` for slot-level styling.

`StatusBadge` maps common UI status strings such as `ready`, `warning`, `blocked`, `success`, and
`failed` to semantic tones. Override `tone` when a product needs a different mapping, and use
`variant`, `size`, `showDot`, or the `icon` slot for presentation changes.

`Link` renders inline navigation text with Hugo UI color modes, small or medium text sizes,
disabled and loading states, and automatic `_blank` accessibility labels. Use `mode="dark"` on
dark surfaces and `mode="error"` when the link represents a destructive or error-focused action.

`EmptyState` and `ErrorState` render compact feedback blocks for empty tables, empty sections,
unavailable content, and retryable errors. Use the `action` slot for buttons or links; examples
should stay generic and avoid product-specific state rules.

`MetricTile` renders compact statistics with `label`, `value`, optional `description`, optional
`delta`, semantic `tone`, and an `icon` slot. It is intended for summary counts, not charts.

`DropdownMenu` wraps reka-ui menu primitives for trigger-based action menus. Use
`DropdownMenuItem` for regular, disabled, or destructive actions, `DropdownMenuSeparator` for visual
groups, the `icon` slot for leading icons, and `shortcut` for shortcut text.

`Progress` renders determinate or indeterminate operation feedback. Use `modelValue` with
`showValue` for known progress, `indeterminate` for unknown progress, and semantic `tone` values for
success, warning, or danger states.

`WorkflowStepper` renders vertical workflow or timeline-style progress with pending, active,
success, warning, and error states. It supports optional clickable steps through `clickable` and
`v-model`; `Timeline` is exported as an alias for the same component.

`FileDropzone` handles drag and drop, click-to-select, `accept`, `maxSize`, single or multiple
selection, selected file display, error display, and status styling. It emits selected files and
rejections, but leaves the real upload request to the application. `Upload` is exported as an alias
for the same component.

`DataGrid` can show an optional checkbox selection column with `showCheckboxColumn`. Control the
checked rows with `selectedRowIds` and listen for `selectedRowIdsChange`; row checkbox events are
kept separate from `rowClick` and `selectedRowIdChange`. Use `showHeaderCheckbox` to hide the
header select-all checkbox when bulk selection is not desired. The checkbox column participates in
column resizing.

`DataGridColumn` accepts `grow: true` when a column should share the remaining horizontal width.
When no column sets `grow`, the final visible column keeps the default remaining-width behavior.
When multiple columns set `grow`, they share the remaining width evenly.

```ts
const columns = [
  { id: 'label', header: 'Item', minWidth: 220, grow: true, render: (row) => row.label },
  { id: 'section', header: 'Section', minWidth: 160, grow: true, render: (row) => row.section },
  { id: 'count', header: 'Count', width: 120, render: (row) => row.count },
];
```

For layouts where the parent owns the available height, prefer `fill` so the root, border wrapper,
and internal grid viewport form a reliable full-height scroll chain:

```vue
<DataGrid fill :columns="columns" :rows="rows" :get-row-id="getRowId" />
```

Use `height` for fixed viewport sizes, such as `<DataGrid height="420px" />`. Existing calculated
heights like `height="calc(100vh - 320px)"` remain supported for compatibility.

`DataGrid` renders every row by default, which is preferred for small tables. Pass `virtualized` for
long lists that should render only the visible row window:

```vue
<DataGrid virtualized :columns="columns" :rows="rows" :get-row-id="getRowId" />
```

`DataGrid` also exposes an `endReached` event for infinite-scroll integrations. Use `hasMore`,
`loadingMore`, and `endReachedThreshold` to coordinate external paging logic; the grid does not fetch
data directly.
