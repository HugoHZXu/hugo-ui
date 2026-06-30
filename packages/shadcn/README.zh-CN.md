# @hugo-ui/shadcn

[English](./README.md) | 简体中文

Hugo UI 的轻量 React 组件库，基于 Tailwind CSS、Radix UI 原语和 shadcn 风格组合模式构建。作为 `@hugo-ui/mui` 的轻量替代方案，它自带独立的样式表和设计 token。

## 安装

```bash
npm install @hugo-ui/shadcn react react-dom
```

> **注意**：使用前请确保你的应用已配置 Tailwind CSS。在应用入口文件处导入一次样式表即可。

## 快速开始

```tsx
import { useState } from 'react';
import '@hugo-ui/shadcn/styles.css';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HugoUIShadcnProvider,
  Input,
  Modal,
  ModalContentText,
} from '@hugo-ui/shadcn';

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <HugoUIShadcnProvider>
      <Card>
        <CardHeader>
          <CardTitle>示例面板</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="项目名称" />
          <Button className="mt-4" onClick={() => setOpen(true)} tone="brand" variant="solid">
            保存
          </Button>
        </CardContent>
      </Card>
      <Modal
        buttonDefs={{ primary: { onClick: () => setOpen(false) } }}
        onClose={() => setOpen(false)}
        onOpenChange={setOpen}
        open={open}
        title="示例弹窗"
      >
        <ModalContentText>请确认后保存。</ModalContentText>
      </Modal>
    </HugoUIShadcnProvider>
  );
}
```

## 组件列表

- **操作与徽标**：`Button`（按钮）、`Badge`（徽标）
- **表单**：`Input`（输入框）
- **布局**：`Card`（卡片）、`CardHeader`（卡片头部）、`CardContent`（卡片内容）、`CardFooter`（卡片底部）、`CardTitle`（卡片标题）、`CardDescription`（卡片描述）
- **Dialog 基础组件**：`Dialog`、`DialogContent`、`DialogTitle`、`DialogDescription`
- **Modal 语义层**：`Modal`（弹窗）、`ModalTitle`（弹窗标题）、`ModalFooter`（弹窗底部）、`ModalContentText`（弹窗内容文本）、`ModalLoadingIndicator`（弹窗加载指示器）
- **工具**：`HugoUIShadcnProvider`、`cn`

## 样式架构

发布的样式表包含 Tailwind 指令、设计 token、基础样式和组件样式：

- `src/styles/globals.css` - 样式表主入口
- `src/styles/tokens.css` - Hugo UI 色彩角色和 Tailwind 主题变量
- `src/styles/base.css` - 基础样式重置
- 需要样式变体的组件使用 `class-variance-authority` 管理
- 组件通过稳定的 `data-*` 属性选择器和 `className` 支持自定义样式

## 本地开发

在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/shadcn run test
pnpm --filter @hugo-ui/shadcn run typecheck
pnpm --filter @hugo-ui/shadcn run build
```
