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
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Input,
  MetricTile,
  Modal,
  ModalContentText,
  StatusBadge,
} from '@hugo-ui/shadcn-vue';

const open = ref(false);
</script>

<template>
  <form class="grid gap-4">
    <Input label="Item name" placeholder="Add a label" required />
    <Checkbox label="Enable sample option" />
    <Button type="submit">Save</Button>
  </form>

  <Modal v-model:open="open" title="Review changes">
    <ModalContentText>Confirm the selected example before saving.</ModalContentText>
  </Modal>

  <MetricTile label="Ready" :value="24" description="items available" tone="success" />
  <StatusBadge status="ready" show-dot />

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

`EmptyState` and `ErrorState` render compact feedback blocks for empty tables, empty sections,
unavailable content, and retryable errors. Use the `action` slot for buttons or links; examples
should stay generic and avoid product-specific state rules.

`MetricTile` renders compact statistics with `label`, `value`, optional `description`, optional
`delta`, semantic `tone`, and an `icon` slot. It is intended for summary counts, not charts.

`DropdownMenu` wraps reka-ui menu primitives for trigger-based action menus. Use
`DropdownMenuItem` for regular, disabled, or destructive actions, `DropdownMenuSeparator` for visual
groups, the `icon` slot for leading icons, and `shortcut` for shortcut text.

`DataGrid` can show an optional checkbox selection column with `showCheckboxColumn`. Control the
checked rows with `selectedRowIds` and listen for `selectedRowIdsChange`; row checkbox events are
kept separate from `rowClick` and `selectedRowIdChange`. Use `showHeaderCheckbox` to hide the
header select-all checkbox when bulk selection is not desired. The checkbox column participates in
column resizing.

`DataGrid` also exposes an `endReached` event for infinite-scroll integrations. Use `hasMore`,
`loadingMore`, and `endReachedThreshold` to coordinate external paging logic; the grid does not fetch
data directly.
