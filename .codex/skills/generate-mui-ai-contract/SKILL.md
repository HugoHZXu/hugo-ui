---
name: generate-mui-ai-contract
description: Generate and validate @hugo-ui/mui AI component contracts when MUI public component props, component exports, Storybook stories, tests, token usage, or downstream Figma/MCP demo contract sync requirements change.
---

# Generate MUI AI Contract

Use this skill when the task needs to refresh or inspect the AI component contract artifacts for
`@hugo-ui/mui`.

## Scope

Only process `@hugo-ui/mui` contract artifacts under:

- `ai-contract/packages/mui/manifest.json`
- `ai-contract/packages/mui/components/*.contract.json`
- `ai-contract/packages/mui/tokens/token-map.contract.json`
- `ai-contract/packages/mui/metadata/components/*.ai.json`
- `dist/ai-contract/hugo-ui-mui-ai-contract-v*.tgz`
- `dist/ai-contract/hugo-ui-mui-ai-contract-v*.tgz.sha256`

Do not generate or validate contract artifacts for any other component package in this skill.

## Input Priority

Read sources in this order:

1. `packages/mui/src/index.ts`
2. Component props type and source files
3. Component directory `index.ts` exports
4. Storybook stories in `packages/storybook/src/stories/`
5. Component tests in `packages/mui/src/`
6. Token and theme files under `packages/mui/src/styles/`
7. Manual metadata under `ai-contract/packages/mui/metadata/`

Treat TypeScript public exports and props as source of truth. Treat metadata as an AI guidance layer
for examples, token policy, a11y rules, discouraged escape hatches, and review notes that TypeScript
cannot express reliably.

## Guardrails

- Do not invent props or component capabilities.
- Do not treat internal variables, CSS class names, or helper functions as public API.
- Do not recommend every inherited MUI prop by default; inherited props are escape hatches unless
  stories, tests, or component source show normal usage.
- Do not mark a public prop as forbidden. If a public prop is supported but should not be the
  default generated path, put it in `discouragedProps` or `generationRules`.
- Do not connect to Figma APIs or Code Connect publish workflows.
- Do not write contract artifacts to a downstream demo repository.
- Do not edit generated output such as `dist`, `coverage`, `storybook-static`, `node_modules`, or
  `*.tsbuildinfo`.

## Workflow

1. Inspect the relevant MUI component source, public exports, stories, tests, and metadata.
2. Update metadata only for AI-specific guidance that TypeScript cannot infer.
3. Run:

```bash
./scripts/codex-node.sh pnpm run contract:generate:mui
./scripts/codex-node.sh pnpm run contract:validate:mui
./scripts/codex-node.sh pnpm run contract:check:mui
./scripts/codex-node.sh pnpm run contract:pack:mui
```

`contract:check:mui` is a read-only drift check. It compares regenerated artifacts with the
checked-in contract files while ignoring volatile provenance fields.

`contract:pack:mui` writes ignored release payload files under `dist/ai-contract/`. Do not commit
the generated `.tgz` or `.sha256` files unless the repository explicitly changes its release policy.
For release tags matching `mui-ai-contract-v*`, pass the tag suffix as `CONTRACT_VERSION` so the
artifact filename and `provenance.json` contract version match the GitHub Release tag.

4. If component source or public exports changed, also run the repository validations required by
   `AGENTS.md`, normally:

```bash
./scripts/codex-node.sh pnpm run typecheck
./scripts/codex-node.sh pnpm run test-mui
./scripts/codex-node.sh pnpm run build-mui
```

## Final Report

Report:

- which contract files were updated
- which props came from TypeScript
- which examples or behaviors came from Storybook and tests
- which fields came from metadata
- which contracts still have `needsReview`
- which manifest downstream Figma/MCP demos should consume
- which packed artifact downstream Figma/MCP demos can download from GitHub Releases
