import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { loadPackageContractConfig, repoRoot } from '../context.mjs';

const contractConfig = await loadPackageContractConfig();
const muiPackagePath = contractConfig.sourcePackagePath;
const muiPackageJsonPath = contractConfig.packageJsonPath ?? `${muiPackagePath}/package.json`;
const muiIndexPath = contractConfig.publicEntry;
const muiTsConfigPath = contractConfig.tsconfigPath ?? `${muiPackagePath}/tsconfig.json`;
const muiSourceRoot = contractConfig.sourceRoot ?? `${muiPackagePath}/src`;
const outputRoot = contractConfig.outputRoot;
const componentOutputDir = contractConfig.componentOutputDir ?? `${outputRoot}/components`;
const metadataDir = contractConfig.metadataDir ?? `${outputRoot}/metadata/components`;
const tokenOutputDir = contractConfig.tokenOutputDir ?? `${outputRoot}/tokens`;
const tokenContractPath = contractConfig.tokenContract ?? 'tokens/token-map.contract.json';
const rawPalettePath =
  contractConfig.tokenSources?.rawPalette ?? `${muiSourceRoot}/styles/color.ts`;
const semanticColorRolesPath =
  contractConfig.tokenSources?.semanticColorRoles ?? `${muiSourceRoot}/styles/colorRoles.ts`;
const themePath = contractConfig.tokenSources?.theme ?? `${muiSourceRoot}/styles/theme.ts`;
const semanticColorRolesExportName =
  contractConfig.semanticColorRolesExportName ?? 'hugoUIColorRoles';
const isCheckMode = process.env.HUGO_AI_CONTRACT_CHECK === '1' || process.argv.includes('--check');
const volatileKeys = new Set(['generatedAt', 'sourceCommit']);
const componentConfigs = contractConfig.components ?? [];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const toAbs = (relativePath) => path.join(repoRoot, relativePath);

const packageJson = JSON.parse(await fs.readFile(toAbs(muiPackageJsonPath), 'utf8'));
const packageName = packageJson.name;
const packageVersion = packageJson.version;
const generatedAt = new Date().toISOString();
const sourceCommit = getSourceCommit();

const parsedConfig = loadTsConfig(toAbs(muiTsConfigPath));
const program = ts.createProgram({
  rootNames: parsedConfig.fileNames,
  options: parsedConfig.options,
});
const checker = program.getTypeChecker();
const publicExports = readPublicExports(toAbs(muiIndexPath));

if (!isCheckMode) {
  await fs.mkdir(toAbs(componentOutputDir), { recursive: true });
  await fs.mkdir(toAbs(tokenOutputDir), { recursive: true });
}

const contracts = [];
const artifacts = [];
for (const config of componentConfigs) {
  if (!publicExports.has(config.importName)) {
    throw new Error(`${config.importName} is not exported from ${muiIndexPath}`);
  }

  const metadata = await readMetadata(config.componentName);
  const contract = buildComponentContract(config, metadata);
  contracts.push(contract);
  artifacts.push({
    relativePath: `${componentOutputDir}/${config.componentName}.contract.json`,
    value: contract,
  });
}

const tokenContract = buildTokenContract();
artifacts.push({
  relativePath: path.posix.join(outputRoot, tokenContractPath),
  value: tokenContract,
});

const manifest = {
  schemaVersion: 'package-contract-manifest/v1',
  packageName,
  packageVersion,
  sourcePackagePath: muiPackagePath,
  generatedAt,
  sourceCommit,
  components: contracts.map((contract) => ({
    componentName: contract.componentName,
    importName: contract.importName,
    contract: `components/${contract.componentName}.contract.json`,
    metadata: `metadata/components/${contract.componentName}.ai.json`,
    sourceFiles: contract.sourceFiles,
    propsTypeName: contract.propsTypeName,
    needsReview: contract.needsReview,
    needsReviewReason: contract.needsReviewReason,
  })),
  tokenContract: tokenContractPath,
  notes: contractConfig.manifestNotes ?? [
    `This manifest covers only the ${contractConfig.packageKey} package scope.`,
    'Use the component contract files as the machine-readable entry points for AI generation and validation.',
  ],
};

artifacts.push({
  relativePath: `${outputRoot}/manifest.json`,
  value: manifest,
});

const result = await writeOrCheckArtifacts(artifacts);
if (isCheckMode) {
  if (result.drifted.length > 0) {
    for (const artifactPath of result.drifted) {
      console.error(`[ai-contract] Drift detected: ${artifactPath}`);
    }
    process.exit(1);
  }
  console.log(
    `[ai-contract] Contract artifacts are up to date for ${contracts.length} ${packageName} components`
  );
} else {
  console.log(
    `[ai-contract] Generated ${contracts.length} ${packageName} component contracts at ${outputRoot}`
  );
  if (result.preserved.length > 0) {
    console.log(
      `[ai-contract] Preserved ${result.preserved.length} artifact(s) without stable content changes`
    );
  }
}

function loadTsConfig(configPath) {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
    {},
    configPath
  );
  if (parsed.errors.length > 0) {
    const message = parsed.errors
      .map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n'))
      .join('\n');
    throw new Error(message);
  }
  return parsed;
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

function readPublicExports(indexFile) {
  const source = ts.createSourceFile(
    indexFile,
    ts.sys.readFile(indexFile) ?? '',
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

async function readMetadata(componentName) {
  const metadataPath = toAbs(`${metadataDir}/${componentName}.ai.json`);
  return JSON.parse(await fs.readFile(metadataPath, 'utf8'));
}

function buildComponentContract(config, metadata) {
  const propsType = getTypeByName(config.propsTypeName);
  if (!propsType) {
    throw new Error(`Unable to find props type ${config.propsTypeName}`);
  }

  const defaults = collectDefaultValues(config);
  const propsByName = new Map();
  const insertOrder = new Map();
  let nextOrder = 0;
  const trackedProps = config.trackedProps ?? [];
  const preferredOrder = new Map(trackedProps.map((name, index) => [name, index]));
  const typeFromValuesProps = new Set(config.typeFromValuesProps ?? []);

  const addProp = (prop) => {
    if (!insertOrder.has(prop.name)) {
      insertOrder.set(prop.name, nextOrder++);
    }
    const existing = propsByName.get(prop.name);
    if (!existing) {
      propsByName.set(prop.name, prop);
      return;
    }
    existing.required = existing.required && prop.required;
    existing.values = unique([...existing.values, ...prop.values]);
    if (typeFromValuesProps.has(existing.name)) {
      syncTypeWithValues(existing);
    }
    if (!existing.description && prop.description) {
      existing.description = prop.description;
    }
    if (!existing.defaultValue && prop.defaultValue !== null) {
      existing.defaultValue = prop.defaultValue;
    }
    if (!existing.source.includes(prop.source)) {
      existing.source = `${existing.source}; ${prop.source}`;
    }
    existing.sources = unique([...(existing.sources ?? [existing.source]), prop.source]);
  };

  for (const typeName of config.directTypeNames ?? [config.propsTypeName]) {
    for (const prop of collectDirectProps(typeName, new Set())) {
      addProp({
        ...prop,
        defaultValue: defaults.get(prop.name) ?? prop.defaultValue,
        aiUsage: 'normal',
      });
    }
  }

  for (const propName of trackedProps) {
    if (propsByName.has(propName)) {
      continue;
    }
    const prop = getPropFromType(propsType, propName, config.propsTypeName);
    if (prop) {
      addProp({
        ...prop,
        defaultValue: defaults.get(prop.name) ?? prop.defaultValue,
        aiUsage: 'normal',
      });
    }
  }

  const discouragedNames = new Set((metadata.discouragedProps ?? []).map((prop) => prop.name));
  const forbiddenNames = new Set((metadata.forbiddenProps ?? []).map((prop) => prop.name));
  for (const prop of propsByName.values()) {
    if (discouragedNames.has(prop.name)) {
      prop.aiUsage = 'discouraged';
    }
    if (forbiddenNames.has(prop.name)) {
      prop.aiUsage = 'forbidden-conflict';
    }
    const override = metadata.propOverrides?.[prop.name];
    if (override) {
      Object.assign(prop, override);
    }
    if (typeFromValuesProps.has(prop.name)) {
      syncTypeWithValues(prop);
    }
  }

  const props = [...propsByName.values()].sort((a, b) => {
    const aOrder = preferredOrder.has(a.name)
      ? preferredOrder.get(a.name)
      : 1000 + insertOrder.get(a.name);
    const bOrder = preferredOrder.has(b.name)
      ? preferredOrder.get(b.name)
      : 1000 + insertOrder.get(b.name);
    return aOrder - bOrder || a.name.localeCompare(b.name);
  });

  return {
    schemaVersion: 'component-contract/v1',
    packageName,
    packageVersion,
    componentName: config.componentName,
    importName: config.importName,
    importStatement: `import { ${config.importName} } from '${packageName}';`,
    implementationName: config.implementationName,
    propsTypeName: config.propsTypeName,
    sourceFiles: unique([config.sourceFile, config.componentIndexFile, ...config.sourceFiles]),
    props,
    relatedTypes: (config.relatedTypes ?? [])
      .map((typeName) => buildRelatedType(typeName))
      .filter(Boolean),
    examples: metadata.examples ?? [],
    forbiddenProps: metadata.forbiddenProps ?? [],
    discouragedProps: metadata.discouragedProps ?? [],
    designMappings: metadata.designMappings ?? {},
    tokenPolicy: metadata.tokenPolicy ?? {},
    a11yRules: metadata.a11yRules ?? [],
    generationRules: metadata.generationRules ?? [],
    validationRules: metadata.validationRules ?? [],
    evidence: {
      publicExport: muiIndexPath,
      propsType: config.propsTypeName,
      metadata: `${metadataDir}/${config.componentName}.ai.json`,
      stories: config.sourceFiles.filter((file) => file.includes('/storybook/')),
      tests: config.sourceFiles.filter((file) => file.endsWith('.test.tsx')),
    },
    needsReview: Boolean(metadata.needsReview),
    needsReviewReason: metadata.needsReviewReason ?? null,
    generatedAt,
    sourceCommit,
  };
}

function getTypeByName(typeName) {
  const declaration = findTypeDeclaration(typeName);
  if (!declaration) {
    return null;
  }
  if (ts.isTypeAliasDeclaration(declaration)) {
    return checker.getTypeFromTypeNode(declaration.type);
  }
  const symbol = checker.getSymbolAtLocation(declaration.name);
  return symbol ? checker.getDeclaredTypeOfSymbol(symbol) : null;
}

function findTypeDeclaration(typeName) {
  const sourceRoot = path.resolve(toAbs(muiSourceRoot));
  const sourceRootWithSeparator = `${sourceRoot}${path.sep}`;
  for (const sourceFile of program.getSourceFiles()) {
    const fileName = path.resolve(sourceFile.fileName);
    if (fileName !== sourceRoot && !fileName.startsWith(sourceRootWithSeparator)) {
      continue;
    }
    let result = null;
    const visit = (node) => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        result = node;
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    if (result) {
      return result;
    }
  }
  return null;
}

function collectDirectProps(typeName, visitedTypes) {
  if (visitedTypes.has(typeName)) {
    return [];
  }
  visitedTypes.add(typeName);

  const declaration = findTypeDeclaration(typeName);
  if (!declaration) {
    return [];
  }

  const props = [];
  const collectMember = (member) => {
    if (!ts.isPropertySignature(member) || !member.name) {
      return;
    }
    const prop = createPropFromDeclaration(member, typeName, 'typescript:component');
    if (prop) {
      props.push(prop);
    }
  };

  if (ts.isInterfaceDeclaration(declaration)) {
    declaration.members.forEach(collectMember);
    return props;
  }

  const collectFromTypeNode = (node) => {
    if (!node) {
      return;
    }
    if (ts.isTypeLiteralNode(node)) {
      node.members.forEach(collectMember);
      return;
    }
    if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
      node.types.forEach(collectFromTypeNode);
      return;
    }
    if (ts.isParenthesizedTypeNode(node)) {
      collectFromTypeNode(node.type);
      return;
    }
    if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
      props.push(...collectDirectProps(node.typeName.text, visitedTypes));
    }
  };

  collectFromTypeNode(declaration.type);
  return props;
}

function createPropFromDeclaration(member, ownerTypeName, sourceKind) {
  const name = propertyNameToString(member.name);
  if (!name) {
    return null;
  }

  const symbol = checker.getSymbolAtLocation(member.name);
  const type = symbol
    ? checker.getTypeOfSymbolAtLocation(symbol, member)
    : checker.getTypeAtLocation(member);

  return {
    name,
    type: getTypeText(type, member),
    required: !member.questionToken && !typeIncludesUndefined(type),
    values: collectStringLiteralValues(type),
    defaultValue: null,
    description: symbol ? ts.displayPartsToString(symbol.getDocumentationComment(checker)) : '',
    source: `${sourceKind}:${sourcePath(member.getSourceFile())}#${ownerTypeName}.${name}`,
  };
}

function getPropFromType(type, propName, ownerTypeName) {
  const symbol = findPropertySymbol(type, propName);
  if (!symbol) {
    return null;
  }
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
  const propType = declaration
    ? checker.getTypeOfSymbolAtLocation(symbol, declaration)
    : checker.getTypeOfSymbol(symbol);

  return {
    name: propName,
    type: getTypeText(propType, declaration),
    required: !isOptionalSymbol(symbol) && !typeIncludesUndefined(propType),
    values: collectStringLiteralValues(propType),
    defaultValue: null,
    description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
    source: `typescript:public-props:${ownerTypeName}.${propName}`,
  };
}

function findPropertySymbol(type, propName) {
  const apparent = checker.getApparentType(type);
  let symbol = type.getProperty(propName) ?? apparent.getProperty(propName);
  if (symbol) {
    return symbol;
  }
  if (type.isUnionOrIntersection()) {
    for (const part of type.types) {
      symbol = findPropertySymbol(part, propName);
      if (symbol) {
        return symbol;
      }
    }
  }
  return null;
}

function isOptionalSymbol(symbol) {
  return Boolean(symbol.flags & ts.SymbolFlags.Optional);
}

function typeIncludesUndefined(type) {
  if (type.flags & ts.TypeFlags.Undefined) {
    return true;
  }
  return type.isUnion() && type.types.some(typeIncludesUndefined);
}

function getTypeText(type, declaration) {
  if (declaration && 'type' in declaration && declaration.type) {
    return normalizeTypeText(declaration.type.getText(declaration.getSourceFile()));
  }
  return normalizeTypeText(
    checker.typeToString(
      type,
      declaration,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType
    )
  );
}

function normalizeTypeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function collectStringLiteralValues(type, visited = new Set()) {
  if (!type || visited.has(type.id)) {
    return [];
  }
  visited.add(type.id);
  if (type.isStringLiteral()) {
    return [type.value];
  }
  if (type.isUnion()) {
    return unique(type.types.flatMap((part) => collectStringLiteralValues(part, visited)));
  }
  return [];
}

function collectDefaultValues(config) {
  const sourceFile = program.getSourceFile(toAbs(config.sourceFile));
  const defaults = new Map();
  if (!sourceFile) {
    return defaults;
  }

  const collectBindingPattern = (pattern) => {
    for (const element of pattern.elements) {
      if (!ts.isBindingElement(element) || !element.initializer) {
        continue;
      }
      const name = propertyNameToString(element.propertyName ?? element.name);
      if (name) {
        defaults.set(name, initializerToValue(element.initializer, sourceFile));
      }
    }
  };

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer &&
      node.initializer.getText(sourceFile) === 'props'
    ) {
      collectBindingPattern(node.name);
    }

    if (
      (ts.isArrowFunction(node) || ts.isFunctionDeclaration(node)) &&
      node.parameters.length > 0
    ) {
      const firstParam = node.parameters[0];
      if (
        ts.isObjectBindingPattern(firstParam.name) &&
        firstParam.type?.getText(sourceFile).includes(config.propsTypeName)
      ) {
        collectBindingPattern(firstParam.name);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return defaults;
}

function initializerToValue(initializer, sourceFile) {
  if (ts.isStringLiteral(initializer) || ts.isNoSubstitutionTemplateLiteral(initializer)) {
    return initializer.text;
  }
  if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  if (ts.isNumericLiteral(initializer)) {
    return Number(initializer.text);
  }
  return initializer.getText(sourceFile);
}

function propertyNameToString(name) {
  if (!name) {
    return '';
  }
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return '';
}

function buildRelatedType(typeName) {
  const declaration = findTypeDeclaration(typeName);
  if (!declaration) {
    return null;
  }
  const propertiesByName = new Map();
  for (const prop of collectDirectProps(typeName, new Set())) {
    const existing = propertiesByName.get(prop.name);
    if (!existing) {
      propertiesByName.set(prop.name, {
        name: prop.name,
        type: prop.type,
        required: prop.required,
        values: prop.values,
        description: prop.description,
        source: prop.source,
      });
      continue;
    }
    existing.required = existing.required && prop.required;
    existing.values = unique([...existing.values, ...prop.values]);
    if (!existing.description && prop.description) {
      existing.description = prop.description;
    }
    if (!existing.source.includes(prop.source)) {
      existing.source = `${existing.source}; ${prop.source}`;
    }
  }
  const properties = [...propertiesByName.values()];
  return {
    name: typeName,
    kind: ts.isInterfaceDeclaration(declaration) ? 'interface' : 'type',
    source: sourcePath(declaration.getSourceFile()),
    properties,
  };
}

function buildTokenContract() {
  const rawPalette = readRawPalette();
  const rawByName = new Map(rawPalette.map((entry) => [entry.name, entry.value]));
  const semanticColorRoles = readSemanticColorRoles(rawByName);

  return {
    schemaVersion: 'token-map-contract/v1',
    packageName,
    packageVersion,
    sourceFiles: unique([rawPalettePath, semanticColorRolesPath, themePath]),
    rawPalette,
    semanticColorRoles,
    themeExposures: contractConfig.tokenThemeExposures ?? [
      {
        name: 'hugoUITheme.hugoUIColors',
        source: themePath,
        mapsFrom: rawPalettePath,
      },
      {
        name: 'hugoUITheme.hugoUIColorRoles',
        source: themePath,
        mapsFrom: semanticColorRolesPath,
      },
    ],
    generationPolicy: [
      'AI-generated component usage should prefer semantic color roles through component props and theme.hugoUIColorRoles.',
      'Do not hardcode raw palette values in generated component usage.',
      'Use raw palette names only when documenting or updating the design-token layer itself.',
    ],
    needsReview: false,
    generatedAt,
    sourceCommit,
  };
}

function readRawPalette() {
  const fileName = toAbs(rawPalettePath);
  const sourceFile = ts.createSourceFile(
    fileName,
    ts.sys.readFile(fileName) ?? '',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const entries = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    const isExported = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    );
    if (!isExported) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        ts.isStringLiteral(declaration.initializer)
      ) {
        entries.push({
          name: declaration.name.text,
          value: declaration.initializer.text,
          source: rawPalettePath,
        });
      }
    }
  }
  return entries;
}

function readSemanticColorRoles(rawByName) {
  const fileName = toAbs(semanticColorRolesPath);
  const sourceFile = ts.createSourceFile(
    fileName,
    ts.sys.readFile(fileName) ?? '',
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const roles = [];
  const visitObject = (node, prefix) => {
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) {
        continue;
      }
      const key = propertyNameToString(property.name);
      if (!key) {
        continue;
      }
      const nextPath = [...prefix, key];
      if (ts.isObjectLiteralExpression(property.initializer)) {
        visitObject(property.initializer, nextPath);
        continue;
      }
      const rawToken = ts.isIdentifier(property.initializer)
        ? property.initializer.text
        : property.initializer.getText(sourceFile);
      roles.push({
        path: nextPath.join('.'),
        rawToken,
        value: rawByName.get(rawToken) ?? null,
        source: semanticColorRolesPath,
      });
    }
  };

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === semanticColorRolesExportName &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        visitObject(declaration.initializer, []);
      }
    }
  }
  return roles;
}

function sourcePath(sourceFile) {
  return path.relative(repoRoot, sourceFile.fileName).replaceAll(path.sep, '/');
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null))];
}

async function writeOrCheckArtifacts(artifactList) {
  const result = {
    written: [],
    preserved: [],
    drifted: [],
  };

  for (const artifact of artifactList) {
    const fullPath = toAbs(artifact.relativePath);
    const nextContent = json(artifact.value);
    const existingContent = await readOptional(fullPath);

    if (isCheckMode) {
      if (!existingContent || !jsonEquivalentIgnoringVolatile(existingContent, nextContent)) {
        result.drifted.push(artifact.relativePath);
      }
      continue;
    }

    if (existingContent) {
      if (existingContent === nextContent) {
        result.preserved.push(artifact.relativePath);
        continue;
      }
      if (jsonEquivalentIgnoringVolatile(existingContent, nextContent)) {
        result.preserved.push(artifact.relativePath);
        continue;
      }
    }

    await fs.writeFile(fullPath, nextContent);
    result.written.push(artifact.relativePath);
  }

  return result;
}

async function readOptional(fullPath) {
  try {
    return await fs.readFile(fullPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function jsonEquivalentIgnoringVolatile(leftContent, rightContent) {
  try {
    const left = normalizeForArtifactComparison(JSON.parse(leftContent));
    const right = normalizeForArtifactComparison(JSON.parse(rightContent));
    return json(left) === json(right);
  } catch {
    return false;
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

function syncTypeWithValues(prop) {
  if (Array.isArray(prop.values) && prop.values.length > 0) {
    prop.type = prop.values.map(toTsStringLiteral).join(' | ');
  }
}

function toTsStringLiteral(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}
