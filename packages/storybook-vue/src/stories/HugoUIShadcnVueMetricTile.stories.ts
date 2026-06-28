import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CircleAlert, CheckCircle2, FileText, ShieldAlert } from 'lucide-vue-next';
import { MetricTile } from '@hugo-ui/shadcn-vue';

const gridStyle = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))',
  maxWidth: '920px',
};

const summaryItems = [
  {
    description: 'rows in the file',
    icon: FileText,
    label: 'Total rows',
    tone: 'neutral',
    value: 128,
  },
  {
    delta: '+18',
    description: 'ready to continue',
    icon: CheckCircle2,
    label: 'Ready',
    tone: 'success',
    value: 96,
  },
  {
    description: 'need review',
    icon: CircleAlert,
    label: 'Warnings',
    tone: 'warning',
    value: 20,
  },
  {
    description: 'blocked entries',
    icon: ShieldAlert,
    label: 'Blocked',
    tone: 'danger',
    value: 12,
  },
];

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/MetricTile',
  component: MetricTile,
  tags: ['autodocs'],
  args: {
    label: 'Ready',
    value: 96,
    description: 'ready to continue',
    tone: 'success',
  },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'success', 'warning', 'danger', 'info'],
    },
    trend: {
      control: { type: 'select' },
      options: ['up', 'down', 'neutral'],
    },
  },
} satisfies Meta<typeof MetricTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { CheckCircle2, MetricTile },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 240px">
        <MetricTile v-bind="args">
          <template #icon>
            <CheckCircle2 />
          </template>
        </MetricTile>
      </div>
    `,
  }),
};

export const SummaryGrid: Story = {
  render: () => ({
    components: { MetricTile },
    setup() {
      return { gridStyle, summaryItems };
    },
    template: `
      <div :style="gridStyle">
        <MetricTile
          v-for="item in summaryItems"
          :key="item.label"
          :delta="item.delta"
          :description="item.description"
          :icon="item.icon"
          :label="item.label"
          :tone="item.tone"
          :value="item.value"
        />
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    label: 'Total rows',
    loading: true,
    value: 0,
  },
};
