import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function findRepoRoot(startDirectory = process.cwd()) {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    if (
      fs.existsSync(path.join(currentDirectory, 'pnpm-workspace.yaml')) &&
      fs.existsSync(path.join(currentDirectory, 'package.json'))
    ) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error(`Unable to locate workspace root from ${startDirectory}`);
    }
    currentDirectory = parentDirectory;
  }
}

export const repoRoot = process.env.HUGO_AI_CONTRACT_REPO_ROOT || findRepoRoot();
export const packageKey = process.env.HUGO_AI_CONTRACT_PACKAGE_KEY || 'mui';

export async function loadContractConfig() {
  const configPath =
    process.env.HUGO_AI_CONTRACT_CONFIG || path.join(repoRoot, 'ai-contract.config.mjs');

  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing AI contract config: ${configPath}`);
  }

  const module = await import(pathToFileURL(configPath).href);
  return module.default ?? module;
}

export async function loadPackageContractConfig(requestedPackageKey = packageKey) {
  const config = await loadContractConfig();
  const packageConfig = config.packages?.[requestedPackageKey];

  if (!packageConfig) {
    throw new Error(`Missing AI contract package config for "${requestedPackageKey}"`);
  }

  return {
    schemaRoot: config.schemaRoot ?? 'ai-contract/schema',
    readmePath: config.readmePath ?? 'ai-contract/README.md',
    ...packageConfig,
    packageKey: requestedPackageKey,
  };
}
