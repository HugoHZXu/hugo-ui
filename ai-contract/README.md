# Hugo UI Component Contract Artifacts

This directory contains generated component contract artifacts for `@hugo-ui/mui`.

The source component package remains the single source of truth for implementation. Contract files are automatically generated from public exports, component props, Storybook examples, tests, theme tokens, and package metadata.

## Current Coverage

The current contract artifacts include:

- `Button`
- `Input`
- `Modal`

## Commands

Run these from the repository root:

```bash
./scripts/codex-node.sh pnpm run contract:generate:mui   # Generate contract artifacts
./scripts/codex-node.sh pnpm run contract:validate:mui   # Validate contract structure
./scripts/codex-node.sh pnpm run contract:check:mui      # Check for changes
./scripts/codex-node.sh pnpm run contract:pack:mui       # Pack artifacts
```

The pack command creates the following git-ignored files under `dist/ai-contract/`:

```text
hugo-ui-mui-ai-contract-v<contractVersion>.tgz
hugo-ui-mui-ai-contract-v<contractVersion>.tgz.sha256
```

## Artifact Structure

```text
manifest.json
schema/
components/
tokens/
metadata/
provenance.json
README.md
```

The MUI package manifest is the entry point:

```text
ai-contract/packages/mui/manifest.json
```
