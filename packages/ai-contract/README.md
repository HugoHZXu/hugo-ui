# @hugo-ui/ai-contract

Private workspace package for Hugo UI AI contract tooling.

The package is CLI-first: it reads `ai-contract.config.mjs` from the workspace root and runs the
configured contract generation, validation, drift checks, release decisions, and artifact packing.

```bash
pnpm --filter @hugo-ui/ai-contract run generate:mui
pnpm --filter @hugo-ui/ai-contract run validate:mui
pnpm --filter @hugo-ui/ai-contract run check:mui
pnpm --filter @hugo-ui/ai-contract run decide:mui
pnpm --filter @hugo-ui/ai-contract run pack:mui
```

This package intentionally does not import or render design-system components. It analyzes source,
stories, tests, token files, and manual metadata declared by the root config.
