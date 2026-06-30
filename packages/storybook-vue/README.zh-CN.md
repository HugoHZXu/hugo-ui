# @hugo-ui/storybook-vue

[English](./README.md) | 简体中文

Hugo UI 的 Vue Storybook 开发环境。这是一个内部 workspace 包，作为 `@hugo-ui/shadcn-vue` 组件的交互式试验场，用于探索视觉状态和验证可访问性。

## 包含内容

- **基础组件**：Button（按钮）、Badge（徽标）、Card（卡片）、Input（输入框）、Checkbox（复选框）、Select（选择器）、Combobox（组合框）、Link（链接）、Modal（弹窗）、DropdownMenu（下拉菜单）
- **数据与导航**：DataGrid（数据表格）、Pagination（分页）、Progress（进度条）、StatusBadge（状态徽标）、MetricTile（指标卡片）、WorkflowStepper（工作流步骤条）、EmptyState（空状态）、ErrorState（错误状态）、FileDropzone（文件拖拽上传）
- **布局**：通用页面模式的 PageTemplate（页面模板）和 ContentTemplate（内容模板）
- **开发配置**：本地 Vite alias 将 `@hugo-ui/shadcn-vue` 导入直接指向源码文件，方便快速开发调试

## 命令

在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/storybook-vue run storybook        # 启动开发服务器 http://localhost:6007
pnpm --filter @hugo-ui/storybook-vue run build-storybook  # 构建静态 Storybook
pnpm --filter @hugo-ui/storybook-vue run typecheck        # TypeScript 类型检查
```
