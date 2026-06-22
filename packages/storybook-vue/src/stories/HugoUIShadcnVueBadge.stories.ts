import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Badge } from '@hugo-ui/shadcn-vue';

const rowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
};

const tones = [
  { tone: 'success', label: 'Ready' },
  { tone: 'warning', label: 'Review' },
  { tone: 'neutral', label: 'Hidden' },
  { tone: 'danger', label: 'Error' },
  { tone: 'info', label: 'Notice' },
];

const meta = {
  title: 'Hugo UI Shadcn Vue/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    default: 'Ready',
    tone: 'success',
  },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['success', 'warning', 'neutral', 'danger', 'info'],
    },
    class: {
      control: { type: 'text' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">{{ args.default }}</Badge>',
  }),
};

export const Tones: Story = {
  render: () => ({
    components: { Badge },
    setup() {
      return { rowStyle, tones };
    },
    template: `
      <div :style="rowStyle">
        <Badge v-for="item in tones" :key="item.tone" :tone="item.tone">
          {{ item.label }}
        </Badge>
      </div>
    `,
  }),
};
