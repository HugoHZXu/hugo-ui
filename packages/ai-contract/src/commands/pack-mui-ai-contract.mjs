import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { loadPackageContractConfig, repoRoot } from '../context.mjs';

const contractConfig = await loadPackageContractConfig();
const outputRoot = contractConfig.outputRoot;
const tokenContractPath = contractConfig.tokenContract ?? 'tokens/token-map.contract.json';
const outputDir = path.join(repoRoot, contractConfig.artifactOutputDir ?? 'dist/ai-contract');
const sourcePackagePath = contractConfig.sourcePackagePath;
const sourcePackage = contractConfig.packageName;
const artifactFormat = contractConfig.artifactFormat ?? `${sourcePackage}-ai-contract/v1`;
const artifactNamePrefix =
  contractConfig.artifactNamePrefix ?? sourcePackage.replace(/^@/, '').replace('/', '-');

const packageJson = JSON.parse(
  await fs.readFile(path.join(repoRoot, `${sourcePackagePath}/package.json`), 'utf8')
);
const packageVersion = packageJson.version;
const contractVersion = resolveContractVersion();
const artifactName = `${artifactNamePrefix}-v${contractVersion}.tgz`;
const artifactPath = path.join(outputDir, artifactName);
const checksumPath = `${artifactPath}.sha256`;

const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'hugo-ui-mui-ai-contract-'));
const payloadDir = path.join(tempRoot, 'payload');

try {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(payloadDir, { recursive: true });

  await copyFile(`${outputRoot}/manifest.json`, 'manifest.json');
  await copyDirectory(contractConfig.schemaRoot, 'schema');
  await copyDirectory(
    contractConfig.componentOutputDir ?? `${outputRoot}/components`,
    'components'
  );
  await copyDirectory(path.posix.dirname(path.posix.join(outputRoot, tokenContractPath)), 'tokens');
  await copyDirectory(contractConfig.metadataRoot ?? `${outputRoot}/metadata`, 'metadata');
  await copyFile(contractConfig.readmePath, 'README.md');

  const provenance = {
    sourceRepo: getSourceRepo(),
    sourceCommit: getSourceCommit(),
    sourcePackage,
    sourcePackagePath,
    packageVersion,
    contractVersion,
    generatedAt: new Date().toISOString(),
    artifactFormat,
  };
  await fs.writeFile(
    path.join(payloadDir, 'provenance.json'),
    `${JSON.stringify(provenance, null, 2)}\n`
  );

  execFileSync('tar', ['-czf', artifactPath, '-C', payloadDir, '.'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  const checksum = await sha256File(artifactPath);
  await fs.writeFile(checksumPath, `${checksum}  ${artifactName}\n`);

  console.log(`[ai-contract] Packed ${path.relative(repoRoot, artifactPath)}`);
  console.log(`[ai-contract] Wrote ${path.relative(repoRoot, checksumPath)}`);
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

async function copyFile(sourceRelativePath, targetRelativePath) {
  const targetPath = path.join(payloadDir, targetRelativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(path.join(repoRoot, sourceRelativePath), targetPath);
}

async function copyDirectory(sourceRelativePath, targetRelativePath) {
  await fs.cp(path.join(repoRoot, sourceRelativePath), path.join(payloadDir, targetRelativePath), {
    recursive: true,
  });
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  const content = await fs.readFile(filePath);
  hash.update(content);
  return hash.digest('hex');
}

function getSourceCommit() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

function getSourceRepo() {
  if (process.env.GITHUB_REPOSITORY) {
    return `github.com/${process.env.GITHUB_REPOSITORY}`;
  }

  try {
    const remoteUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: repoRoot,
      encoding: 'utf8',
    }).trim();
    return normalizeGitHubRemote(remoteUrl);
  } catch {
    return 'unknown';
  }
}

function normalizeGitHubRemote(remoteUrl) {
  const httpsMatch = remoteUrl.match(/^https:\/\/github\.com\/(.+?)(?:\.git)?$/);
  if (httpsMatch) {
    return `github.com/${httpsMatch[1]}`;
  }

  const sshMatch = remoteUrl.match(/^git@github\.com:(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return `github.com/${sshMatch[1]}`;
  }

  return remoteUrl;
}

function resolveContractVersion() {
  const version = process.env.CONTRACT_VERSION || packageVersion;
  if (!/^[0-9A-Za-z][0-9A-Za-z._-]*$/.test(version)) {
    throw new Error(
      `Invalid CONTRACT_VERSION "${version}". Use only letters, numbers, dots, underscores, and hyphens.`
    );
  }
  return version;
}
