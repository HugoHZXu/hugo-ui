# Hugo UI

[English](./README.md) | 简体中文

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Hugo UI 是一个独立的设计系统 monorepo，用于构建可复用的 React 和 Vue 组件库。项目包含可直接发布的组件包，以及用于交互演示和视觉测试的 Storybook 应用。

所有示例和文档均使用中性模拟数据，确保组件可在不同产品场景中复用。

## 包含的包

| Package                                                              | 说明                                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`@hugo-ui/mui`](./packages/mui/README.zh-CN.md)                     | 基于 MUI + Emotion 的 React 组件，内置主题和国际化支持。              |
| [`@hugo-ui/shadcn`](./packages/shadcn/README.zh-CN.md)               | 基于 Tailwind CSS 的轻量 React 组件，采用 shadcn 风格设计。           |
| [`@hugo-ui/shadcn-vue`](./packages/shadcn-vue/README.zh-CN.md)       | 基于 Tailwind CSS 的 Vue 3 组件，遵循 shadcn-vue 设计约定。           |
| [`@hugo-ui/storybook`](./packages/storybook/README.zh-CN.md)         | React Storybook 演示环境，用于组件展示和视觉测试。                    |
| [`@hugo-ui/storybook-vue`](./packages/storybook-vue/README.zh-CN.md) | Vue Storybook 演示环境，用于组件展示和视觉测试。                      |

## 在线演示

可直接访问在线 Storybook 查看组件效果：

| Demo            | URL                                                                                |
| --------------- | ---------------------------------------------------------------------------------- |
| React Storybook | [https://hugohzxu.github.io/hugo-ui/](https://hugohzxu.github.io/hugo-ui/)         |
| Vue Storybook   | [https://hugohzxu.github.io/hugo-ui/vue/](https://hugohzxu.github.io/hugo-ui/vue/) |

## 环境要求

- Node.js `>=22.12.0`
- pnpm `>=10.34.1 <11`（通过 `packageManager` 字段固定为 `pnpm@10.34.1`）

## 快速开始

安装依赖并在项目中使用：

```bash
# MUI + Emotion 组件
npm install @hugo-ui/mui @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom react-intl

# shadcn 风格 React 组件
npm install @hugo-ui/shadcn react react-dom
```

导入并使用组件：

```tsx
import { DataGrid, HugoUIProvider, Table } from '@hugo-ui/mui';
import { Button } from '@hugo-ui/shadcn';
import '@hugo-ui/shadcn/styles.css';
```

各组件包的详细使用方法请参考对应包的 README。

## 项目结构

```txt
hugo-ui/
  packages/
    mui/             # MUI + Emotion React 组件
    shadcn/          # Tailwind/shadcn React 组件
    shadcn-vue/      # Tailwind/shadcn Vue 组件
    storybook/       # React Storybook 应用
    storybook-vue/   # Vue Storybook 应用
```

## 本地开发

在仓库根目录运行以下命令：

```bash
pnpm install
pnpm run typecheck
pnpm run test:all
pnpm run build:all

# 启动 Storybook 开发服务器
pnpm run storybook      # React Storybook，访问 http://localhost:6006
pnpm run storybook-vue  # Vue Storybook，访问 http://localhost:6007
```

> **注意**：建议使用 `./scripts/codex-node.sh <命令>` 运行脚本，以确保从 `.nvmrc` 加载正确的 Node 版本。

## 发布

版本管理和发布通过 Changesets 进行：

```bash
pnpm run changeset          # 创建新的 changeset
pnpm run changeset:version  # 更新版本号和 changelog
pnpm run changeset:publish  # 发布到 npm
```

发布到 npm 需要拥有 `@hugo-ui` 组织的权限。

## 开源协议

MIT © Hugo UI contributors
