import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Link } from '@hugo-ui/shadcn-vue';

const rowStyle = {
  alignItems: 'center',
  columnGap: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '12px',
};

const stackStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const darkCanvasStyle = {
  alignItems: 'center',
  background: 'var(--hugo-ui-shadcn-surface-inverse)',
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '48px',
  width: '100%',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Atom/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    default: 'Example link',
    href: '#example-link',
    mode: 'white',
    size: 'medium',
    loading: false,
    disabled: false,
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['white', 'light', 'dark', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    class: {
      control: { type: 'text' },
    },
    onClick: {
      action: 'clicked',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Link },
    setup() {
      return { args };
    },
    template: '<Link v-bind="args">{{ args.default }}</Link>',
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Link },
    setup() {
      return { args, rowStyle };
    },
    template: `
      <div :style="rowStyle">
        <Link v-bind="args" size="medium">Default link</Link>
        <Link v-bind="args" size="small">Small link</Link>
      </div>
    `,
  }),
};

export const Modes: Story = {
  render: (args) => ({
    components: { Link },
    setup() {
      return { args, stackStyle };
    },
    template: `
      <div :style="stackStyle">
        <Link v-bind="args" mode="white">White surface</Link>
        <Link v-bind="args" mode="light">Light surface</Link>
        <Link v-bind="args" mode="error">Error link</Link>
      </div>
    `,
  }),
};

export const Status: Story = {
  render: (args) => ({
    components: { Link },
    setup() {
      return { args, stackStyle };
    },
    template: `
      <div :style="stackStyle">
        <Link v-bind="args">Rest</Link>
        <Link v-bind="args" loading>Loading</Link>
        <Link v-bind="args" disabled>Disabled</Link>
        <Link v-bind="args" href="https://example.com" target="_blank">New page</Link>
      </div>
    `,
  }),
};

export const OnDark: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    components: { Link },
    setup() {
      return { args, rowStyle, darkCanvasStyle };
    },
    template: `
      <div :style="darkCanvasStyle">
        <div :style="rowStyle">
          <Link v-bind="args" mode="dark">Default link</Link>
          <Link v-bind="args" mode="dark" loading>Loading</Link>
          <Link v-bind="args" mode="dark" disabled>Disabled</Link>
        </div>
      </div>
    `,
  }),
};
