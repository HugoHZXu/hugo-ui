#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRepoRoot } from './context.mjs';

const commandModules = {
  generate: './commands/generate-mui-ai-contract.mjs',
  validate: './commands/validate-mui-ai-contract.mjs',
  decide: './commands/decide-mui-ai-contract-release.mjs',
  pack: './commands/pack-mui-ai-contract.mjs',
};

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(command ? 0 : 1);
}

const options = parseOptions(args.slice(1));
const repoRoot = findRepoRoot(process.cwd());
process.chdir(repoRoot);

process.env.HUGO_AI_CONTRACT_REPO_ROOT = repoRoot;
process.env.HUGO_AI_CONTRACT_PACKAGE_KEY = options.packageKey;
if (options.configPath) {
  process.env.HUGO_AI_CONTRACT_CONFIG = path.resolve(repoRoot, options.configPath);
}

if (options.packageKey !== 'mui') {
  throw new Error(
    `Unsupported AI contract package "${options.packageKey}". This demo currently supports "mui".`
  );
}

if (command === 'check') {
  process.env.HUGO_AI_CONTRACT_CHECK = '1';
  await import(commandModules.generate);
  await import(commandModules.validate);
} else if (commandModules[command]) {
  if (command === 'generate' && options.check) {
    process.env.HUGO_AI_CONTRACT_CHECK = '1';
  }
  await import(commandModules[command]);
} else {
  throw new Error(`Unknown AI contract command "${command}"`);
}

function parseOptions(rawArgs) {
  const options = {
    packageKey: 'mui',
    configPath: null,
    check: false,
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === '--package' || arg === '-p') {
      options.packageKey = requireOptionValue(rawArgs, index, arg);
      index += 1;
      continue;
    }
    if (arg === '--config') {
      options.configPath = requireOptionValue(rawArgs, index, arg);
      index += 1;
      continue;
    }
    if (arg === '--check') {
      options.check = true;
      continue;
    }
    throw new Error(`Unknown AI contract option "${arg}"`);
  }

  return options;
}

function requireOptionValue(rawArgs, index, optionName) {
  const value = rawArgs[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${optionName}`);
  }
  return value;
}

function printHelp() {
  const binName = path.basename(fileURLToPath(import.meta.url));
  console.log(
    `Usage: ${binName} <generate|validate|check|decide|pack> --package mui [--config ai-contract.config.mjs]`
  );
}
