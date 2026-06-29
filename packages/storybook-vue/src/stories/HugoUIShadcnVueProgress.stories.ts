import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Progress } from '@hugo-ui/shadcn-vue';

const rowStyle = {
  display: 'grid',
  gap: '16px',
  width: '360px',
};

const tones = ['default', 'success', 'warning', 'danger'];

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {
    label: 'Processing',
    modelValue: 64,
    showValue: true,
    tone: 'default',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
    },
    tone: {
      control: { type: 'select' },
      options: tones,
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Progress },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 360px">
        <Progress v-bind="args" />
      </div>
    `,
  }),
};

export const Tones: Story = {
  render: () => ({
    components: { Progress },
    setup() {
      return { rowStyle, tones };
    },
    template: `
      <div :style="rowStyle">
        <Progress
          v-for="tone in tones"
          :key="tone"
          :label="tone === 'default' ? 'Default' : tone"
          :model-value="tone === 'danger' ? 24 : tone === 'warning' ? 48 : 72"
          show-value
          :tone="tone"
        />
      </div>
    `,
  }),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Loading',
    modelValue: null,
    showValue: true,
  },
};
