# @hugo-ui/shadcn-vue

[English](./README.md) | 简体中文

Hugo UI 的 Vue 3 组件库，基于 Tailwind CSS、reka-ui 原语和 shadcn-vue 风格约定构建。这是 Hugo UI 的 Vue 3 实现版本。

## 安装

```bash
npm install @hugo-ui/shadcn-vue vue
```

> **注意**：使用前请确保你的应用已配置 Tailwind CSS。在应用入口文件处导入一次样式表即可。

## 快速开始

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
  { label: '保存', value: 'save' },
  { label: '归档', value: 'archive' },
];

const searchableItems = [
  { label: '项目 Alpha', value: 'alpha', description: '第一组中的项目' },
  { label: '项目 Beta', value: 'beta', description: '第二组中的项目' },
];
</script>

<template>
  <form class="grid gap-4">
    <Input label="项目名称" placeholder="添加标签" required />
    <Select v-model="action" label="操作" :options="actions" />
    <Combobox v-model="selectedItem" label="可搜索项目" :options="searchableItems" clearable />
    <Checkbox label="启用示例选项" />
    <Button type="button" @click="open = true">打开弹窗</Button>
  </form>

  <Modal v-model:open="open" title="示例弹窗">
    <ModalContentText>请确认所选项目后保存。</ModalContentText>
  </Modal>

  <StatusBadge status="ready" show-dot />
  <FileDropzone v-model="files" accept=".csv,.txt" title="上传示例文件" />
</template>
```

## 组件列表

- **操作与链接**：`Button`（按钮）、`Link`（链接）
- **表单与选择**：`Input`（输入框）、`Select`（选择器）、`Combobox`（组合框）、`Checkbox`（复选框）、`FileDropzone`（文件拖拽上传）
- **反馈与状态**：`Badge`（徽标）、`StatusBadge`（状态徽标）、`Progress`（进度条）、`EmptyState`（空状态）、`ErrorState`（错误状态）
- **布局与摘要**：`Card`（卡片）、`MetricTile`（指标卡片）、`ContentTemplate`（内容模板）、`PageTemplate`（页面模板）
- **浮层与菜单**：`Modal`（弹窗）、`DropdownMenu`（下拉菜单）
- **导航**：`Pagination`（分页）、`WorkflowStepper`（工作流步骤条）
- **数据展示**：`DataGrid`（数据表格）

## 样式架构

发布的样式表包含 Tailwind 指令、设计 token、基础样式和组件样式：

- 组件通过稳定的 `data-*` 属性选择器支持定向样式覆盖
- 需要深层定制的组件暴露 `classNames` 或 `slotProps`
- reka-ui 原语为选择器、菜单、分页和弹窗提供键盘导航和焦点管理
- 文件上传逻辑由应用层处理；`FileDropzone` 会触发事件返回所选文件和被拒绝的文件

## 本地开发

在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/shadcn-vue run test
pnpm --filter @hugo-ui/shadcn-vue run typecheck
pnpm --filter @hugo-ui/shadcn-vue run build
```
