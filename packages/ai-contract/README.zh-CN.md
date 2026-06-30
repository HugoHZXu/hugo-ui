# @hugo-ui/ai-contract

[English](./README.md) | 简体中文

Hugo UI 内部 workspace 工具包，用于生成和验证组件契约文件。该工具读取仓库根目录的 `ai-contract.config.mjs` 配置，并将契约产物输出到 `ai-contract/packages/mui` 目录。

这个包不会直接导入或渲染任何设计系统组件，而是对源码文件、包导出、Storybook stories、测试、token 文件以及根配置中声明的元数据进行静态分析。

## 命令

```bash
pnpm --filter @hugo-ui/ai-contract run generate:mui   # 生成 MUI 契约产物
pnpm --filter @hugo-ui/ai-contract run validate:mui   # 验证契约结构
pnpm --filter @hugo-ui/ai-contract run check:mui      # 检查契约变更
pnpm --filter @hugo-ui/ai-contract run decide:mui     # 判断是否需要发布契约
pnpm --filter @hugo-ui/ai-contract run pack:mui       # 打包契约产物用于分发
```

## 输出文件

- `ai-contract/packages/mui/manifest.json` - 包清单入口文件
- `ai-contract/packages/mui/components/*.contract.json` - 组件契约定义
- `ai-contract/packages/mui/tokens/token-map.contract.json` - 设计 token 映射
- `ai-contract/packages/mui/metadata/components/*.ai.json` - 组件元数据
- `dist/ai-contract/` 下的打包文件（已加入 gitignore）

## 本地开发

这是一个仅供 workspace 内部使用的包。在仓库根目录运行：

```bash
pnpm --filter @hugo-ui/ai-contract run check:mui
```
