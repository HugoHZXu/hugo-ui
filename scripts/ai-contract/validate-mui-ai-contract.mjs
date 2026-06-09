import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath = 'ai-contract/packages/mui/manifest.json';
const schemaPaths = [
  'ai-contract/schema/component-contract.schema.json',
  'ai-contract/schema/package-contract-manifest.schema.json',
];
const packageName = '@hugo-ui/mui';
const forbiddenPatterns = ['@hugo-ui/shadcn', 'packages/shadcn', '@demo/design-system'];
const supportedSchemaKeywords = new Set([
  '$schema',
  '$id',
  'title',
  'type',
  'required',
  'properties',
  'const',
  'items',
  'minItems',
  'additionalProperties',
]);
const failures = [];
const warnings = [];

const componentSchema = readJson(schemaPaths[0]);
const manifestSchema = readJson(schemaPaths[1]);
assertSupportedSchemaKeywords(componentSchema, schemaPaths[0]);
assertSupportedSchemaKeywords(manifestSchema, schemaPaths[1]);

const manifest = readJson(manifestPath);
validateSchemaSubset(manifestSchema, manifest, manifestPath);
assert(manifest.schemaVersion === 'package-contract-manifest/v1', 'Invalid manifest schemaVersion');
assert(manifest.packageName === packageName, `Manifest packageName must be ${packageName}`);
assert(
  manifest.sourcePackagePath === 'packages/mui',
  'Manifest sourcePackagePath must be packages/mui'
);
assert(
  Array.isArray(manifest.components) && manifest.components.length > 0,
  'Manifest components must be non-empty'
);
assert(typeof manifest.tokenContract === 'string', 'Manifest tokenContract must be a string');
assertNoForbiddenPatterns(manifest, manifestPath);

const publicExports = readPublicExports('packages/mui/src/index.ts');

for (const entry of manifest.components ?? []) {
  assert(
    entry.importName && publicExports.has(entry.importName),
    `${entry.importName} is not exported from packages/mui/src/index.ts`
  );
  assert(
    typeof entry.contract === 'string',
    `${entry.componentName} manifest entry is missing contract`
  );

  const contractPath = path.posix.join('ai-contract/packages/mui', entry.contract);
  assertFileExists(contractPath, `Missing contract file: ${contractPath}`);
  const contract = readJson(contractPath);
  validateSchemaSubset(componentSchema, contract, contractPath);

  assert(
    contract.schemaVersion === 'component-contract/v1',
    `${contractPath} has invalid schemaVersion`
  );
  assert(
    contract.packageName === packageName,
    `${contractPath} packageName must be ${packageName}`
  );
  assert(
    contract.importName === entry.importName,
    `${contractPath} importName does not match manifest`
  );
  assert(
    publicExports.has(contract.importName),
    `${contract.importName} is not a public MUI export`
  );
  assert(
    Array.isArray(contract.props) && contract.props.length > 0,
    `${contractPath} props must be non-empty`
  );
  assert(
    Array.isArray(contract.sourceFiles) && contract.sourceFiles.length > 0,
    `${contractPath} sourceFiles must be non-empty`
  );
  assertNoForbiddenPatterns(contract, contractPath);

  for (const sourceFile of contract.sourceFiles ?? []) {
    assert(
      !sourceFile.includes('packages/shadcn'),
      `${contractPath} references non-MUI source file ${sourceFile}`
    );
    assertFileExists(sourceFile, `${contractPath} references missing source file ${sourceFile}`);
  }

  const propNames = new Set((contract.props ?? []).map((prop) => prop.name));
  for (const forbiddenProp of contract.forbiddenProps ?? []) {
    if (propNames.has(forbiddenProp.name)) {
      failures.push(
        `${contractPath} marks public prop ${forbiddenProp.name} as forbidden. Use discouragedProps or generationRules instead.`
      );
    }
  }

  if (contract.needsReview) {
    warnings.push(
      `${contract.componentName}.contract.json needs review: ${contract.needsReviewReason || 'no reason provided'}`
    );
  }
}

const tokenPath = path.posix.join('ai-contract/packages/mui', manifest.tokenContract);
assertFileExists(tokenPath, `Missing token contract: ${tokenPath}`);
const tokenContract = readJson(tokenPath);
assert(
  tokenContract.packageName === packageName,
  `${tokenPath} packageName must be ${packageName}`
);
assert(Array.isArray(tokenContract.rawPalette), `${tokenPath} rawPalette must be an array`);
assert(
  Array.isArray(tokenContract.semanticColorRoles),
  `${tokenPath} semanticColorRoles must be an array`
);
assertNoForbiddenPatterns(tokenContract, tokenPath);
for (const sourceFile of tokenContract.sourceFiles ?? []) {
  assertFileExists(sourceFile, `${tokenPath} references missing source file ${sourceFile}`);
}

for (const warning of warnings) {
  console.warn(`[ai-contract] Warning: ${warning}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[ai-contract] Error: ${failure}`);
  }
  process.exit(1);
}

console.log(
  `[ai-contract] Validated ${manifest.components.length} ${packageName} component contracts and token map`
);

function readJson(relativePath) {
  assertFileExists(relativePath, `Missing JSON file: ${relativePath}`);
  try {
    return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    return {};
  }
}

function assertFileExists(relativePath, message) {
  if (!fs.existsSync(path.join(repoRoot, relativePath))) {
    failures.push(message);
  }
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function assertNoForbiddenPatterns(value, label) {
  const serialized = JSON.stringify(value);
  for (const pattern of forbiddenPatterns) {
    assert(!serialized.includes(pattern), `${label} contains forbidden pattern ${pattern}`);
  }
}

function readPublicExports(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  const source = ts.createSourceFile(
    fullPath,
    fs.readFileSync(fullPath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const names = new Set();
  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause) {
      continue;
    }
    if (!ts.isNamedExports(statement.exportClause)) {
      continue;
    }
    for (const element of statement.exportClause.elements) {
      names.add(element.name.text);
    }
  }
  return names;
}

function validateSchemaSubset(schema, value, label) {
  validateNode(schema, value, label);
}

function assertSupportedSchemaKeywords(schema, label) {
  walkSchemaKeywords(schema, label);
}

function walkSchemaKeywords(schema, label) {
  if (!isPlainObject(schema)) {
    return;
  }

  for (const key of Object.keys(schema)) {
    if (!supportedSchemaKeywords.has(key)) {
      failures.push(`${label} uses unsupported schema keyword ${key}`);
    }
  }

  if (Object.hasOwn(schema, 'additionalProperties') && schema.additionalProperties !== true) {
    failures.push(
      `${label} uses unsupported additionalProperties value ${schema.additionalProperties}`
    );
  }

  for (const [propertyName, propertySchema] of Object.entries(schema.properties ?? {})) {
    walkSchemaKeywords(propertySchema, `${label}.properties.${propertyName}`);
  }

  if (schema.items) {
    walkSchemaKeywords(schema.items, `${label}.items`);
  }
}

function validateNode(schema, value, pathLabel) {
  if (!schema || typeof schema !== 'object') {
    return;
  }

  if (Object.hasOwn(schema, 'const') && value !== schema.const) {
    failures.push(`${pathLabel} must equal ${JSON.stringify(schema.const)}`);
  }

  if (schema.type && !matchesSchemaType(value, schema.type)) {
    const expected = Array.isArray(schema.type) ? schema.type.join(' or ') : schema.type;
    failures.push(`${pathLabel} must be ${expected}`);
    return;
  }

  if (schema.type === 'object' || schema.properties || schema.required) {
    if (!isPlainObject(value)) {
      failures.push(`${pathLabel} must be object`);
      return;
    }

    for (const requiredKey of schema.required ?? []) {
      if (!Object.hasOwn(value, requiredKey)) {
        failures.push(`${pathLabel}.${requiredKey} is required`);
      }
    }

    for (const [propertyName, propertySchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, propertyName)) {
        validateNode(propertySchema, value[propertyName], `${pathLabel}.${propertyName}`);
      }
    }
  }

  if (schema.type === 'array' || schema.items || schema.minItems !== undefined) {
    if (!Array.isArray(value)) {
      failures.push(`${pathLabel} must be array`);
      return;
    }

    if (schema.minItems !== undefined && value.length < schema.minItems) {
      failures.push(`${pathLabel} must contain at least ${schema.minItems} item(s)`);
    }

    if (schema.items) {
      value.forEach((item, index) => {
        validateNode(schema.items, item, `${pathLabel}[${index}]`);
      });
    }
  }
}

function matchesSchemaType(value, schemaType) {
  if (Array.isArray(schemaType)) {
    return schemaType.some((type) => matchesSchemaType(value, type));
  }

  switch (schemaType) {
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isPlainObject(value);
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'null':
      return value === null;
    default:
      failures.push(`Unsupported schema type ${schemaType}`);
      return true;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
