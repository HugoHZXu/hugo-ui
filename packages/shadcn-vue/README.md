# @hugo-ui/shadcn-vue

Vue + Tailwind + shadcn-vue components for Hugo UI experiments.

## Usage

Import the library stylesheet once in your app entry:

```vue
<script setup lang="ts">
import '@hugo-ui/shadcn-vue/styles.css';
import { Button, Input } from '@hugo-ui/shadcn-vue';
</script>

<template>
  <form class="grid gap-4">
    <Input label="Item name" placeholder="Add a label" required />
    <Button type="submit">Save</Button>
  </form>
</template>
```

## Component Notes

`Input` supports `input` and `textarea` rendering through the `as` prop. It exposes stable
`data-component="hugo-input"` and `data-slot` hooks for `root`, `label`, `control`, `input`,
`textarea`, `adornment`, `helper`, `counter`, `status`, `spinner`, and `required-mark`.
Use `slotProps` for native attributes and `classNames` for slot-level styling.
