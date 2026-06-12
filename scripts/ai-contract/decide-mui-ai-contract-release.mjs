import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const tagPattern = 'mui-ai-contract-v*';
const volatileKeys = new Set(['generatedAt', 'sourceCommit']);
const explicitPaths = [
  'ai-contract/packages/mui/manifest.json',
  'ai-contract/packages/mui/tokens/token-map.contract.json',
  'ai-contract/README.md',
];
const scopedDirectories = [
  'ai-contract/packages/mui/components',
  'ai-contract/packages/mui/metadata/components',
  'ai-contract/schema',
];
let contractCheckPassed = false;

try {
  runContractCheck();
  contractCheckPassed = true;

  const baseRelease = resolveBaseRef();
  if (!baseRelease) {
    emitDecision({
      decision: 'manual-review',
      needsPublish: false,
      baseRelease: null,
      reason: `No ${tagPattern} tag was found. Set CONTRACT_BASE_REF to compare against a known release.`,
      changedContractFiles: [],
      ignoredChanges: [...volatileKeys],
      contractCheckPassed,
    });
    process.exit(0);
  }

  const comparison = compareStableContractFiles(baseRelease);
  const needsPublish = comparison.changedContractFiles.length > 0;

  emitDecision({
    decision: needsPublish ? 'publish' : 'skip',
    needsPublish,
    baseRelease,
    reason: needsPublish
      ? 'Stable MUI AI contract content changed.'
      : 'Stable MUI AI contract content matches the base release.',
    changedContractFiles: comparison.changedContractFiles,
    ignoredChanges: [...volatileKeys],
    contractCheckPassed,
  });
} catch (error) {
  emitDecision({
    decision: 'manual-review',
    needsPublish: false,
    baseRelease: resolveBaseRef({ quiet: true }),
    reason: error.message,
    changedContractFiles: [],
    ignoredChanges: [...volatileKeys],
    contractCheckPassed,
  });
  process.exit(1);
}

function runContractCheck() {
  runNodeScript(['scripts/ai-contract/generate-mui-ai-contract.mjs', '--check']);
  runNodeScript(['scripts/ai-contract/validate-mui-ai-contract.mjs']);
}

function runNodeScript(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout?.trim()) {
    console.error(result.stdout.trim());
  }
  if (result.stderr?.trim()) {
    console.error(result.stderr.trim());
  }

  if (result.error || result.status !== 0) {
    throw new Error(`Contract check failed while running: node ${args.join(' ')}`);
  }
}

function resolveBaseRef(options = {}) {
  if (process.env.CONTRACT_BASE_REF) {
    return process.env.CONTRACT_BASE_REF;
  }

  try {
    return execFileSync('git', ['tag', '--list', tagPattern, '--sort=-v:refname'], {
      cwd: repoRoot,
      encoding: 'utf8',
    })
      .split('\n')
      .map((tag) => tag.trim())
      .filter(Boolean)[0];
  } catch (error) {
    if (!options.quiet) {
      throw new Error(`Unable to list ${tagPattern} tags: ${error.message}`);
    }
    return null;
  }
}

function compareStableContractFiles(baseRef) {
  assertGitRefExists(baseRef);

  const currentFiles = listCurrentContractFiles();
  const baseFiles = listBaseContractFiles(baseRef);
  const allFiles = [...new Set([...currentFiles, ...baseFiles])].sort();
  const changedContractFiles = [];

  for (const relativePath of allFiles) {
    const currentContent = readCurrentFile(relativePath);
    const baseContent = readBaseFile(baseRef, relativePath);

    if (!stableEquivalent(relativePath, currentContent, baseContent)) {
      changedContractFiles.push(relativePath);
    }
  }

  return { changedContractFiles };
}

function assertGitRefExists(ref) {
  try {
    execFileSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], {
      cwd: repoRoot,
      stdio: 'ignore',
    });
  } catch {
    throw new Error(`Base ref ${ref} was not found. Fetch tags or set CONTRACT_BASE_REF.`);
  }
}

function listCurrentContractFiles() {
  const files = [];

  for (const relativePath of explicitPaths) {
    if (fs.existsSync(path.join(repoRoot, relativePath))) {
      files.push(relativePath);
    }
  }

  for (const directory of scopedDirectories) {
    files.push(...listCurrentDirectoryFiles(directory));
  }

  return [...new Set(files)].sort();
}

function listCurrentDirectoryFiles(relativeDirectory) {
  const absoluteDirectory = path.join(repoRoot, relativeDirectory);
  if (!fs.existsSync(absoluteDirectory)) {
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(absoluteDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.posix.join(relativeDirectory, entry.name);
    const absoluteEntryPath = path.join(repoRoot, entryPath);
    if (entry.isDirectory()) {
      files.push(...listCurrentDirectoryFiles(entryPath));
    } else if (entry.isFile() || fs.statSync(absoluteEntryPath).isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function listBaseContractFiles(baseRef) {
  const baseFiles = new Set();

  for (const relativePath of explicitPaths) {
    if (readBaseFile(baseRef, relativePath) !== null) {
      baseFiles.add(relativePath);
    }
  }

  for (const directory of scopedDirectories) {
    for (const relativePath of listBaseDirectoryFiles(baseRef, directory)) {
      baseFiles.add(relativePath);
    }
  }

  return [...baseFiles].sort();
}

function listBaseDirectoryFiles(baseRef, relativeDirectory) {
  try {
    return execFileSync('git', ['ls-tree', '-r', '--name-only', baseRef, '--', relativeDirectory], {
      cwd: repoRoot,
      encoding: 'utf8',
    })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function readCurrentFile(relativePath) {
  try {
    return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function readBaseFile(baseRef, relativePath) {
  try {
    return execFileSync('git', ['show', `${baseRef}:${relativePath}`], {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function stableEquivalent(relativePath, currentContent, baseContent) {
  if (currentContent === null || baseContent === null) {
    return currentContent === baseContent;
  }

  if (relativePath.endsWith('.json')) {
    return stableJson(currentContent, relativePath) === stableJson(baseContent, relativePath);
  }

  return normalizeText(currentContent) === normalizeText(baseContent);
}

function stableJson(content, relativePath) {
  try {
    return `${JSON.stringify(normalizeForArtifactComparison(JSON.parse(content)), null, 2)}\n`;
  } catch (error) {
    throw new Error(`Invalid JSON in ${relativePath}: ${error.message}`);
  }
}

function normalizeForArtifactComparison(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeForArtifactComparison);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !volatileKeys.has(key))
        .map(([key, entryValue]) => [key, normalizeForArtifactComparison(entryValue)])
    );
  }
  return value;
}

function normalizeText(content) {
  return content.replace(/\r\n/g, '\n');
}

function emitDecision(decision) {
  const json = `${JSON.stringify(decision, null, 2)}\n`;
  process.stdout.write(json);
  writeGitHubOutput(decision);
}

function writeGitHubOutput(decision) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const lines = [
    `decision=${decision.decision}`,
    `needs_publish=${String(decision.needsPublish)}`,
    `base_release=${decision.baseRelease ?? ''}`,
    `changed_contract_files=${decision.changedContractFiles.join(',')}`,
  ];
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join('\n')}\n`);
}
