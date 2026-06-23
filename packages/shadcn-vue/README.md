# @hugo-ui/shadcn-vue

Vue + Tailwind + shadcn-vue components for Hugo UI experiments.

## Usage

Import the library stylesheet once in your app entry:

```vue
<script setup lang="ts">
import '@hugo-ui/shadcn-vue/styles.css';
import { Button, Checkbox, Input } from '@hugo-ui/shadcn-vue';
</script>

<template>
  <form class="grid gap-4">
    <Input label="Item name" placeholder="Add a label" required />
    <Checkbox label="Enable sample option" />
    <Button type="submit">Save</Button>
  </form>
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

`DataGrid` can show an optional checkbox selection column with `showCheckboxColumn`. Control the
checked rows with `selectedRowIds` and listen for `selectedRowIdsChange`; row checkbox events are
kept separate from `rowClick` and `selectedRowIdChange`. Use `showHeaderCheckbox` to hide the
header select-all checkbox when bulk selection is not desired. The checkbox column participates in
column resizing.

`DataGrid` also exposes an `endReached` event for infinite-scroll integrations. Use `hasMore`,
`loadingMore`, and `endReachedThreshold` to coordinate external paging logic; the grid does not fetch
data directly.
