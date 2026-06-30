# @hugo-ui/shadcn-vue

English | [简体中文](./README.zh-CN.md)

Vue 3 components for Hugo UI, built with Tailwind CSS, reka-ui primitives, and shadcn-vue style conventions. This package provides the Vue 3 implementation of Hugo UI.

## Installation

```bash
npm install @hugo-ui/shadcn-vue vue
```

> **Note**: Your application needs to have Tailwind CSS configured. Import the package stylesheet once at your app entry point.

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue';
import '@hugo-ui/shadcn-vue/styles.css';
import {
  Button,
  Checkbox,
  Combobox,
  FileDropzone,
  Input,
  Modal,
  ModalContentText,
  Select,
  StatusBadge,
} from '@hugo-ui/shadcn-vue';

const open = ref(false);
const files = ref<File[]>([]);
const action = ref('save');
const selectedItem = ref<string | number | null>(null);

const actions = [
  { label: 'Save', value: 'save' },
  { label: 'Archive', value: 'archive' },
];

const searchableItems = [
  { label: 'Alpha item', value: 'alpha', description: 'Available in the first section' },
  { label: 'Beta item', value: 'beta', description: 'Available in the second section' },
];
</script>

<template>
  <form class="grid gap-4">
    <Input label="Item name" placeholder="Add a label" required />
    <Select v-model="action" label="Action" :options="actions" />
    <Combobox v-model="selectedItem" label="Searchable item" :options="searchableItems" clearable />
    <Checkbox label="Enable sample option" />
    <Button type="button" @click="open = true">Open modal</Button>
  </form>

  <Modal v-model:open="open" title="Sample modal">
    <ModalContentText>Confirm the selected example before saving.</ModalContentText>
  </Modal>

  <StatusBadge status="ready" show-dot />
  <FileDropzone v-model="files" accept=".csv,.txt" title="Upload a sample file" />
</template>
```

## Available Components

- **Actions & Links**: `Button`, `Link`
- **Forms & Selection**: `Input`, `Select`, `Combobox`, `Checkbox`, `FileDropzone`
- **Feedback & Status**: `Badge`, `StatusBadge`, `Progress`, `EmptyState`, `ErrorState`
- **Layout & Summaries**: `Card`, `MetricTile`, `ContentTemplate`, `PageTemplate`
- **Overlays & Menus**: `Modal`, `DropdownMenu`
- **Navigation**: `Pagination`, `WorkflowStepper`
- **Data Display**: `DataGrid`

## Styling Architecture

The distributed stylesheet includes Tailwind directives, design tokens, base styles, and component styles:

- Components expose stable `data-*` attributes for targeted styling
- Components requiring deeper customization expose `classNames` or `slotProps`
- reka-ui primitives provide keyboard navigation and focus management for selections, menus, pagination, and modals
- File upload logic is handled by your application; `FileDropzone` emits selected files and rejections

## Local Development

From the repository root:

```bash
pnpm --filter @hugo-ui/shadcn-vue run test
pnpm --filter @hugo-ui/shadcn-vue run typecheck
pnpm --filter @hugo-ui/shadcn-vue run build
```
