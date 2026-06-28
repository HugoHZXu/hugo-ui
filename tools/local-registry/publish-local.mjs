#!/usr/bin/env node
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const [, , packagePathArg] = process.argv;

if (!packagePathArg) {
  console.error('Usage: node tools/local-registry/publish-local.mjs <package-dir>');
  process.exit(1);
}

const registry = process.env.LOCAL_NPM_REGISTRY ?? 'http://localhost:4873';
const tag = process.env.LOCAL_NPM_TAG ?? 'local';
const packageDir = resolve(process.cwd(), packagePathArg);
const manifestPath = resolve(packageDir, 'package.json');

if (!existsSync(manifestPath)) {
  console.error(`Package manifest not found: ${manifestPath}`);
  process.exit(1);
}

const sourceManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

if (sourceManifest.private) {
  console.error(`Refusing to publish private package: ${sourceManifest.name}`);
  process.exit(1);
}

if (!sourceManifest.name || !sourceManifest.version) {
  console.error(`Package manifest must include name and version: ${manifestPath}`);
  process.exit(1);
}

const files = Array.isArray(sourceManifest.files) ? sourceManifest.files : ['dist', 'README.md', 'package.json'];
const tempDir = mkdtempSync(resolve(tmpdir(), `${basename(packageDir)}-local-`));
const localVersion = `${sourceManifest.version}-local.${Date.now()}`;

try {
  for (const file of files) {
    if (file === 'package.json') {
      continue;
    }

    const from = resolve(packageDir, file);
    const to = resolve(tempDir, file);

    if (!existsSync(from)) {
      throw new Error(`Expected package file is missing: ${from}`);
    }

    cpSync(from, to, { recursive: true });
  }

  const tempManifest = {
    ...sourceManifest,
    version: localVersion,
  };

  // Avoid recursive npm publish lifecycle scripts in local snapshot publishes.
  if (tempManifest.scripts?.publish) {
    tempManifest.scripts = { ...tempManifest.scripts };
    delete tempManifest.scripts.publish;
  }

  writeFileSync(resolve(tempDir, 'package.json'), `${JSON.stringify(tempManifest, null, 2)}\n`);

  console.log(`Publishing ${sourceManifest.name}@${localVersion}`);
  console.log(`Registry: ${registry}`);
  console.log(`Tag: ${tag}`);
  console.log(`Package temp dir: ${tempDir}`);

  const publish = spawnSync(
    'npm',
    ['publish', '--registry', registry, '--tag', tag, '--access', 'public', '--ignore-scripts'],
    {
      cwd: tempDir,
      stdio: 'inherit',
    },
  );

  if (publish.status !== 0) {
    process.exit(publish.status ?? 1);
  }

  const view = spawnSync('npm', ['view', `${sourceManifest.name}@${tag}`, 'version', '--registry', registry], {
    cwd: tempDir,
    encoding: 'utf8',
  });

  if (view.status !== 0) {
    process.stdout.write(view.stdout);
    process.stderr.write(view.stderr);
    process.exit(view.status ?? 1);
  }

  console.log(`${sourceManifest.name}@${tag} -> ${view.stdout.trim()}`);
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
