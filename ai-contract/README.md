# Hugo UI AI Component Contracts

This directory contains machine-readable component contracts for AI agents, MCP tools, and
validators that need to generate or check Hugo UI usage.

An AI component contract describes how a public component should be imported and used. It includes
the public import name, source evidence, props, examples, design mappings, token policy,
accessibility rules, generation rules, validation rules, and review status.

These contracts are not Figma Code Connect, do not publish anything to Figma, and do not replace
the React component source. The source package remains the implementation source of truth.

The generator and validator are implemented in the private workspace package
`@hugo-ui/ai-contract`. Package-specific inputs such as component source files, Storybook examples,
token files, metadata roots, artifact naming, and release tag patterns are declared in
`ai-contract.config.mjs` at the repository root.

## Current Scope

The first phase covers `@hugo-ui/mui` only:

- `Button`
- `Input`
- `Modal`

`@hugo-ui/shadcn` is intentionally not covered in this phase.

## Generate And Validate

From the repository root, run:

```bash
./scripts/codex-node.sh pnpm run contract:generate:mui
./scripts/codex-node.sh pnpm run contract:validate:mui
```

To regenerate and validate in one step:

```bash
./scripts/codex-node.sh pnpm run contract:check:mui
```

`contract:generate:mui` writes contract artifacts only when stable contract content changes. Volatile
provenance fields such as `generatedAt` and `sourceCommit` are preserved when they are the only
differences, so repeated generation does not dirty the workspace.

`contract:check:mui` is a read-only drift check. It regenerates the expected artifacts in memory,
compares them with the checked-in files while ignoring volatile provenance fields, and then runs the
validator.

## Release Decision

Not every `@hugo-ui/mui` package change needs a new AI Contract release. Internal implementation
changes, style-only changes, tests, or package version bumps do not require a new contract artifact
when the stable contract content is unchanged.

Before creating a `mui-ai-contract-v*` release tag, run:

```bash
./scripts/codex-node.sh pnpm run contract:decide:mui
```

The decision script is read-only. It first runs the MUI contract drift check and validator, then
compares current stable contract files against the latest local `mui-ai-contract-v*` tag. It ignores
volatile provenance fields such as `generatedAt` and `sourceCommit`.

The script writes a JSON decision to stdout:

```json
{
  "decision": "publish",
  "needsPublish": true,
  "baseRelease": "mui-ai-contract-v1.0.2",
  "reason": "Stable MUI AI contract content changed.",
  "changedContractFiles": ["ai-contract/packages/mui/components/Button.contract.json"],
  "ignoredChanges": ["generatedAt", "sourceCommit"],
  "contractCheckPassed": true
}
```

Decision meanings:

- `publish`: stable contract content changed and a new release artifact is warranted.
- `skip`: stable contract content matches the comparison release; do not publish a new artifact.
- `manual-review`: the script could not make a safe automatic decision, for example because no
  comparison tag exists, the base ref is missing locally, or contract validation failed.

To compare against a specific release or commit instead of the latest local contract tag, set
`CONTRACT_BASE_REF`:

```bash
CONTRACT_BASE_REF=mui-ai-contract-v1.0.2 ./scripts/codex-node.sh pnpm run contract:decide:mui
```

The comparison covers:

- `ai-contract/packages/mui/manifest.json`
- `ai-contract/packages/mui/components/*.contract.json`
- `ai-contract/packages/mui/tokens/token-map.contract.json`
- `ai-contract/packages/mui/metadata/components/*.ai.json`
- `ai-contract/schema/**`
- `ai-contract/README.md`

Publishing is usually required for public import or prop changes, generated contract changes, token
contract changes, schema changes, or metadata changes that affect AI guidance. Publishing is usually
not required for internal logic, visual styling, or tests when those stable files do not change.

To package the generated MUI contract as a downstream-consumable artifact:

```bash
./scripts/codex-node.sh pnpm run contract:pack:mui
```

The pack command writes ignored local files under `dist/ai-contract/`:

```text
hugo-ui-mui-ai-contract-v<contractVersion>.tgz
hugo-ui-mui-ai-contract-v<contractVersion>.tgz.sha256
```

The tarball expands to:

```text
manifest.json
schema/
components/
tokens/
metadata/
provenance.json
README.md
```

The generator reads the real `@hugo-ui/mui` package manifest, public exports, component props,
Storybook stories, tests, and theme token files. The manual metadata files in
`ai-contract/packages/mui/metadata/components/` provide AI-specific guidance that TypeScript cannot
reliably infer.

## GitHub Release Artifact

`.github/workflows/mui-ai-contract.yml` generates, validates, drift-checks, typechecks, packs, and
uploads the MUI AI contract as a CI artifact. Use `contract:decide:mui` before creating a release
tag to avoid publishing unchanged contract content.

When a tag matching `mui-ai-contract-v*` is pushed, the workflow publishes the packed `.tgz` and
`.tgz.sha256` files as GitHub Release assets. The tag suffix becomes the contract artifact version:
`mui-ai-contract-v0.1.0` publishes `hugo-ui-mui-ai-contract-v0.1.0.tgz`, and the workflow checks
that `provenance.json` uses the same `contractVersion`. This does not publish an npm package.

## Downstream Consumption

A downstream Figma/MCP demo should copy or sync these generated files:

- `ai-contract/packages/mui/manifest.json`
- `ai-contract/packages/mui/components/*.contract.json`
- `ai-contract/packages/mui/tokens/token-map.contract.json`

The downstream sync should record:

- source repository
- source commit
- package version
- sync time
- contract artifact version

The MUI manifest is the entry point for consumers:

```text
ai-contract/packages/mui/manifest.json
```
