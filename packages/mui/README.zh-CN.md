# @hugo-ui/mui

[English](./README.md) | 简体中文

Hugo UI 的 React 组件库，基于 MUI (Material UI) 和 Emotion 构建。提供可复用的 UI 组件、布局模板、语义化主题系统、国际化支持以及完整的测试覆盖。

## 安装

```bash
npm install @hugo-ui/mui @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom react-intl
```

如需离线字体支持，可额外安装字体包：

```bash
npm install @fontsource/noto-sans @fontsource/noto-sans-jp @fontsource/noto-sans-thai @fontsource/noto-sans-arabic
```

## 快速开始

在应用根组件使用 `HugoUIProvider` 包裹，然后直接从包中导入组件：

```tsx
import { useState } from 'react';
import { Button, DataGrid, HugoUIProvider, Input, hugoUITheme } from '@hugo-ui/mui';
import type { DataGridColumn, DataGridSort } from '@hugo-ui/mui';

type Row = { id: string; label: string; section: string };

const rows: Row[] = [{ id: 'entry-1', label: '示例条目', section: 'Alpha' }];
const columns: DataGridColumn<Row>[] = [
  { id: 'label', header: '项目', sortable: true, minWidth: 160, render: (row) => row.label },
  { id: 'section', header: '分组', minWidth: 140, render: (row) => row.section },
];

export function App() {
  const [sort, setSort] = useState<DataGridSort>(null);

  return (
    <HugoUIProvider theme={hugoUITheme} locale="zh">
      <Input label="项目名称" />
      <Button type="button">保存</Button>
      <DataGrid
        ariaLabel="示例列表"
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

## 组件列表

- **操作与链接**：`Button`（按钮）、`Link`（链接）、`ButtonLink`（按钮链接）
- **输入与控件**：`Input`（输入框）、`SearchBox`（搜索框）、`Toggle`（开关）
- **反馈与状态**：`Message`（消息提示）、`StatusTag`（状态标签）、`Modal`（弹窗）、`Feedback`（反馈）
- **数据展示**：`Table`（表格）、`DataGrid`（数据表格）、`DetailCard`（详情卡片）
- **布局**：`PageTemplate`（页面模板）、`ContentTemplate`（内容模板）
- **排版与主题**：`Typography`（排版）、`hugoUITheme`（主题）、`HugoUIProvider`（提供者）

## Provider 与国际化

`HugoUIProvider` 整合了 MUI 主题、Hugo UI 全局样式、React Intl 国际化、Emotion 缓存配置、字体加载以及 RTL（从右到左）布局支持。

```tsx
<HugoUIProvider locale="ar" messages={messages} fontLoading="auto">
  <App />
</HugoUIProvider>
```

`fontLoading` 属性支持：`auto`、`local`、`remote`、`none`。

## 子路径导入

你也可以直接从子路径导入工具函数和主题变量：

```ts
import { hugoUITheme } from '@hugo-ui/mui/styles/theme';
import { onEnterKeyPress } from '@hugo-ui/mui/utils/wcagUtils';
```

## 本地开发

在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/mui run test
pnpm --filter @hugo-ui/mui run typecheck
pnpm --filter @hugo-ui/mui run build
```
