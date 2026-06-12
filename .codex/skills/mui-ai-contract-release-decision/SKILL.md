---
name: mui-ai-contract-release-decision
description: Decide whether the current @hugo-ui/mui AI contract changes require publishing a new mui-ai-contract release. Use when reviewing PRs, main-branch changes, workflow_dispatch/tag releases, or user requests about whether internal implementation, styling, public props, exports, metadata, token contracts, schema, or contract docs should trigger a new contract artifact.
---

# MUI AI Contract Release Decision

## Overview

Use this skill to separate contract validation from contract publication. The goal is to make a
release decision from stable AI Contract content, not from package version bumps, timestamps,
source commits, or internal component implementation changes.

## Decision Rule

Recommend publishing a new MUI AI Contract only when the stable contract surface changed since the
latest published `mui-ai-contract-v*` release.

Publishing is usually required for changes to:

- public `@hugo-ui/mui` exports or component import names
- public component props, prop types, defaults, supported values, or discouraged/forbidden guidance
- AI metadata under `ai-contract/packages/mui/metadata/`
- generated component contracts, token contract, manifest entries, or contract schemas
- contract README or package-level guidance consumed by downstream AI/Figma/MCP tooling

Publishing is usually not required for changes limited to:

- internal component logic that does not change the public contract
- visual styling or token implementation details that do not alter `token-map.contract.json`
- tests that only verify unchanged behavior
- Storybook layout or docs wording that does not affect contract examples or AI guidance
- package version bumps where stable contract content is unchanged

Treat uncertain cases as `manual-review`, not automatic publish.

## Workflow

1. Inspect the changed files with `git status --short` and the relevant diff.
2. Run the deterministic decision script:

```bash
./scripts/codex-node.sh pnpm run contract:decide:mui
```

This script runs the contract drift check internally before comparing release content. If it fails,
report `needsPublish: false` and `status: "blocked"` until the checked-in `ai-contract` artifacts
are regenerated and committed. Do not publish a stale contract.

3. If the script is unavailable, decide from stable file comparison:

- Find the latest published tag with `git tag --list 'mui-ai-contract-v*' --sort=-v:refname`.
- Compare current contract files against that tag.
- Ignore volatile JSON fields: `generatedAt` and `sourceCommit`.
- Compare these paths only:
  - `ai-contract/packages/mui/manifest.json`
  - `ai-contract/packages/mui/components/*.contract.json`
  - `ai-contract/packages/mui/tokens/token-map.contract.json`
  - `ai-contract/packages/mui/metadata/components/*.ai.json`
  - `ai-contract/schema/**`
  - `ai-contract/README.md`

4. Return one of three outcomes:

- `publish`: stable contract content changed and downstream consumers need a new artifact.
- `skip`: only internal, visual, test-only, or volatile changes are present.
- `manual-review`: the comparison is inconclusive, no release tag exists, a schema/doc change has
  unclear downstream impact, or the contract artifacts are stale.

## Report Format

Report a compact decision with evidence:

```json
{
  "decision": "publish | skip | manual-review",
  "needsPublish": true,
  "baseRelease": "mui-ai-contract-v1.0.2",
  "reason": "Stable Button contract props changed.",
  "changedContractFiles": ["ai-contract/packages/mui/components/Button.contract.json"],
  "ignoredChanges": ["generatedAt", "sourceCommit"]
}
```

For user-facing summaries, include:

- whether to publish
- which release/tag was used as the comparison base
- which stable contract files changed
- whether any result needs manual review
- whether `contract:check:mui` passed

## Publishing Guidance

Do not create tags, GitHub Releases, or packed artifacts unless the user explicitly asks for
publication. This skill decides whether publication is warranted; it does not publish by default.
