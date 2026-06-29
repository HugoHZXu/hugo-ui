import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'path';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

const inlineLocalCssImports = (filePath: string, seen = new Set<string>()): string => {
  if (seen.has(filePath)) {
    return '';
  }

  seen.add(filePath);
  const source = readFileSync(filePath, 'utf8');
  const localImportPattern = /@import\s+['"](\.{1,2}\/[^'"]+\.css)['"]\s*;/g;

  return source.replace(localImportPattern, (_match, importPath: string) => {
    const importedFilePath = resolve(dirname(filePath), importPath);
    return inlineLocalCssImports(importedFilePath, seen);
  });
};

const copyLibraryStyles = () => ({
  name: 'copy-library-styles',
  closeBundle() {
    mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
    const bundledStyles = inlineLocalCssImports(resolve(__dirname, 'src/styles/globals.css'));
    writeFileSync(resolve(__dirname, 'dist/styles.css'), bundledStyles);
  },
});

const copyPackageMetadata = () => ({
  name: 'copy-package-metadata',
  closeBundle() {
    mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
    copyFileSync(resolve(__dirname, 'components.json'), resolve(__dirname, 'dist/components.json'));
  },
});

export default defineConfig({
  plugins: [vue(), copyLibraryStyles(), copyPackageMetadata()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id: string) => !id.startsWith('.') && !path.isAbsolute(id) && !id.startsWith('@/'),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
