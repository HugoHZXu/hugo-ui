# @hugo-ui/ai-contract

English | [简体中文](./README.zh-CN.md)

Internal workspace tooling for generating and validating Hugo UI component contract artifacts. This tool reads the repository's `ai-contract.config.mjs` configuration and outputs contract files to the `ai-contract/packages/mui` directory.

This package does not import or render any design system components directly. Instead, it statically analyzes source files, package exports, Storybook stories, tests, token files, and metadata declared in the root configuration.

## Commands

```bash
pnpm --filter @hugo-ui/ai-contract run generate:mui   # Generate MUI contract artifacts
pnpm --filter @hugo-ui/ai-contract run validate:mui   # Validate contract structure
pnpm --filter @hugo-ui/ai-contract run check:mui      # Check for contract changes
pnpm --filter @hugo-ui/ai-contract run decide:mui     # Decide if contract release is needed
pnpm --filter @hugo-ui/ai-contract run pack:mui       # Pack contract artifacts for distribution
```

## Output Files

- `ai-contract/packages/mui/manifest.json` - Package manifest entry point
- `ai-contract/packages/mui/components/*.contract.json` - Component contract definitions
- `ai-contract/packages/mui/tokens/token-map.contract.json` - Design token mappings
- `ai-contract/packages/mui/metadata/components/*.ai.json` - Component metadata
- Packaged archives under `dist/ai-contract/` (git-ignored)

## Local Development

This is an internal workspace package only. From the repository root:

```bash
pnpm --filter @hugo-ui/ai-contract run check:mui
```
