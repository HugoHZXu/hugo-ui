---
name: github-pages-publish
description: Configure, verify, or repair GitHub Pages publishing for static artifacts in this repository, especially Storybook deployments from `packages/storybook/storybook-static` using GitHub Actions. Use when Codex needs to add or update Pages workflows, explain required GitHub repository settings, choose static artifact paths, or validate Storybook-to-Pages publishing behavior.
---

# GitHub Pages Publish

## Workflow

Use GitHub Actions as the Pages source. Do not commit generated static output such as `storybook-static`.

1. Identify the static build command and output directory.
   - For this repo's Storybook: run `pnpm run build-storybook`.
   - The expected artifact path is `packages/storybook/storybook-static`.
2. Add or update a workflow under `.github/workflows/`.
   - Trigger on pushes to the repository's default publish branch, currently `main`.
   - Include `workflow_dispatch` for manual publishing.
   - Keep deployment in a separate `deploy` job that depends on the build job.
   - Use minimal permissions: `contents: read` for build, `pages: write` and `id-token: write` for deploy.
3. Use the official Pages action flow.
   - `actions/configure-pages`
   - `actions/upload-pages-artifact` with the static output directory
   - `actions/deploy-pages` targeting the `github-pages` environment
4. For Node/pnpm repos, match the local runtime.
   - Use `actions/setup-node` with `node-version-file: .nvmrc`.
   - Install the `pnpm` version declared by the root `packageManager` field before running `pnpm`.
   - Avoid relying on runner-bundled Corepack when Node/Corepack signature keys fail in GitHub Actions.
   - Use `pnpm install --frozen-lockfile` in CI.

## Platform Settings

Tell the user GitHub repository settings are still required:

- Go to `Settings -> Pages`.
- Under `Build and deployment`, set `Source` to `GitHub Actions`.
- Ensure GitHub Actions is enabled under `Settings -> Actions -> General`.
- For private repositories, Pages availability may depend on the GitHub account or organization plan.

Do not promise that Codex changed platform-side settings unless a GitHub/browser tool actually performed and verified the change.

## Validation

For this repo, validate locally without starting Storybook:

```bash
./scripts/codex-node.sh pnpm run build-storybook
```

If only the workflow file changed, local Storybook build verifies the build command and artifact path. GitHub-hosted deployment itself is verified only after the workflow runs on GitHub.

When action major versions or GitHub Pages requirements matter, check current official GitHub documentation or official action READMEs before changing the workflow.
