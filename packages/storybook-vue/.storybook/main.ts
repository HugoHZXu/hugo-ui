import type { StorybookConfig } from '@storybook/vue3-vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import vue from '@vitejs/plugin-vue';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/**/*.stories.@(ts|vue)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    config.plugins = [...(config.plugins || []), vue()];
    config.resolve = config.resolve || {};
    const alias = config.resolve.alias || [];
    const hugoUIShadcnVueAliases = [
      {
        find: '@/',
        replacement: `${path.resolve(dirname, '../../shadcn-vue/src')}/`,
      },
      {
        find: '@hugo-ui/shadcn-vue/styles.css',
        replacement: path.resolve(dirname, '../../shadcn-vue/src/styles/globals.css'),
      },
      {
        find: /^@hugo-ui\/shadcn-vue$/,
        replacement: path.resolve(dirname, '../../shadcn-vue/src/index.ts'),
      },
    ];

    config.resolve.alias = Array.isArray(alias)
      ? [...hugoUIShadcnVueAliases, ...alias]
      : hugoUIShadcnVueAliases;
    config.css = config.css || {};
    config.css.postcss = {
      plugins: [tailwindcss(), autoprefixer()],
    };
    return config;
  },
};

export default config;
