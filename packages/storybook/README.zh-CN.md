# @hugo-ui/storybook

[English](./README.md) | 简体中文

Hugo UI 的 React Storybook 开发环境。这是一个内部 workspace 包，作为 `@hugo-ui/mui` 和 `@hugo-ui/shadcn` 组件的交互式试验场，用于探索视觉状态、验证可访问性以及测试多语言行为。

## 包含内容

- **MUI 组件**：Button（按钮）、Input（输入框）、Modal（弹窗）、Table（表格）、DataGrid（数据表格）、PageTemplate（页面模板）、ContentTemplate（内容模板）、StatusTag（状态标签）、SearchBox（搜索框）、Toggle（开关）、Link（链接）、DetailCard（详情卡片）、Message（消息提示）、Loading（加载中）和 Typography（排版）的 stories
- **shadcn 组件**：Button（按钮）、Input（输入框）和 Modal（弹窗）的 stories
- **文档页面**：色彩 token、阴影层级和排版的 MDX 文档
- **国际化**：支持 English（英文）、简体中文和 Arabic（阿拉伯语，含 RTL 布局）的 locale 工具栏
- **开发配置**：本地 Vite alias 将包导入直接指向源码文件，方便快速开发调试

## 命令

在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/storybook run storybook        # 启动开发服务器 http://localhost:6006
pnpm --filter @hugo-ui/storybook run build-storybook  # 构建静态 Storybook
pnpm --filter @hugo-ui/storybook run typecheck        # TypeScript 类型检查
```
