import type { Preview } from '@storybook/vue3-vite';
import '@fontsource/noto-sans/400.css';
import '@fontsource/noto-sans/600.css';
import '@hugo-ui/shadcn-vue/styles.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
