# GitHub Copilot Instructions

Use the repository rules in [`AGENTS.md`](../AGENTS.md) as the source of truth.

Important defaults:

- Keep `packages/mui`, `packages/shadcn`, and `packages/storybook` responsibilities separate.
- Do not edit generated output such as `dist`, `coverage`, `storybook-static`, or `node_modules`.
- Public component changes need tests, Storybook coverage, export alignment, and a changeset when consumer-visible.
- Do not add private code, identifiable data, private endpoints, secrets, screenshots, production logs, or copied private design-system wording.
- Prefer `./scripts/codex-node.sh pnpm ...` for validation commands so `.nvmrc` is loaded consistently.
