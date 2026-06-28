import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CheckCircle2, CircleAlert } from 'lucide-vue-next';
import { StatusBadge } from '@hugo-ui/shadcn-vue';

const rowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
};

const statuses = ['ready', 'warning', 'blocked', 'deleted', 'success', 'failed', 'skipped'];
const variants = ['soft', 'outline', 'solid'];

const meta = {
  title: 'Hugo UI Shadcn Vue/Atom/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: {
    status: 'ready',
    variant: 'soft',
    size: 'md',
    showDot: false,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'success', 'warning', 'danger', 'info'],
    },
    variant: {
      control: { type: 'select' },
      options: variants,
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { CheckCircle2, StatusBadge },
    setup() {
      return { args };
    },
    template: `
      <StatusBadge v-bind="args">
        <template #icon>
          <CheckCircle2 />
        </template>
      </StatusBadge>
    `,
  }),
};

export const Statuses: Story = {
  render: () => ({
    components: { StatusBadge },
    setup() {
      return { rowStyle, statuses };
    },
    template: `
      <div :style="rowStyle">
        <StatusBadge v-for="status in statuses" :key="status" :status="status" show-dot />
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { CircleAlert, StatusBadge },
    setup() {
      return { rowStyle, variants };
    },
    template: `
      <div :style="rowStyle">
        <StatusBadge
          v-for="variant in variants"
          :key="variant"
          status="warning"
          :variant="variant"
        >
          <template #icon>
            <CircleAlert />
          </template>
        </StatusBadge>
      </div>
    `,
  }),
};
