import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CheckCircle2, X } from 'lucide-vue-next';
import { Button } from '@hugo-ui/shadcn-vue';

const buttonRowStyle = {
  alignItems: 'center',
  columnGap: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '12px',
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
  title: 'Hugo UI Shadcn Vue/Atom/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    default: 'Button',
    variant: 'solid',
    tone: 'brand',
    size: 'default',
    loading: false,
    loadingPosition: 'start',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outline', 'ghost'],
    },
    tone: {
      control: { type: 'select' },
      options: ['brand', 'neutral', 'danger', 'inverse'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg', 'icon'],
    },
    loadingPosition: {
      control: { type: 'select' },
      options: ['start', 'center'],
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">{{ args.default }}</Button>',
  }),
};

export const Variants: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args, buttonRowStyle };
    },
    template: `
      <div :style="buttonRowStyle">
        <Button v-bind="args" tone="brand" variant="solid">Solid</Button>
        <Button v-bind="args" tone="brand" variant="outline">Outline</Button>
        <Button v-bind="args" tone="brand" variant="ghost">Ghost</Button>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args, buttonRowStyle };
    },
    template: `
      <div :style="buttonRowStyle">
        <Button v-bind="args" size="lg">Large</Button>
        <Button v-bind="args" size="default">Default</Button>
        <Button v-bind="args" size="sm">Small</Button>
      </div>
    `,
  }),
};

export const Status: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args, buttonRowStyle };
    },
    template: `
      <div :style="buttonRowStyle">
        <Button v-bind="args">Rest</Button>
        <Button v-bind="args" loading>Loading</Button>
        <Button v-bind="args" loading loading-position="center">Center loading</Button>
        <Button v-bind="args" disabled>Disabled</Button>
      </div>
    `,
  }),
};

export const Icons: Story = {
  render: (args) => ({
    components: { Button, CheckCircle2, X },
    setup() {
      return { args, buttonRowStyle };
    },
    template: `
      <div :style="buttonRowStyle">
        <Button v-bind="args">
          <CheckCircle2 />
          Completed
        </Button>
        <Button v-bind="args">
          Close
          <X />
        </Button>
        <Button v-bind="args" aria-label="Completed" size="icon">
          <CheckCircle2 />
        </Button>
      </div>
    `,
  }),
};

export const Destructive: Story = {
  args: {
    tone: 'danger',
    default: 'Delete project',
  },
  render: Primary.render,
};

export const OnDark: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args, buttonRowStyle, darkCanvasStyle };
    },
    template: `
      <div :style="darkCanvasStyle">
        <div :style="buttonRowStyle">
          <Button v-bind="args" tone="inverse" variant="solid">Solid</Button>
          <Button v-bind="args" tone="inverse" variant="outline">Outline</Button>
          <Button v-bind="args" tone="inverse" variant="ghost">Ghost</Button>
        </div>
      </div>
    `,
  }),
};
