import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { FileSearch, RefreshCw } from 'lucide-vue-next';
import { Button, EmptyState, ErrorState } from '@hugo-ui/shadcn-vue';

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No items yet',
    description: 'Add an item to see it here.',
    variant: 'section',
  },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'danger', 'info'],
    },
    variant: {
      control: { type: 'select' },
      options: ['page', 'section', 'table', 'compact'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Button, EmptyState, FileSearch },
    setup() {
      return { args };
    },
    template: `
      <EmptyState v-bind="args">
        <template #icon>
          <FileSearch />
        </template>
        <template #action>
          <Button size="sm" variant="outline">Add item</Button>
        </template>
      </EmptyState>
    `,
  }),
};

export const Compact: Story = {
  args: {
    title: 'No results',
    description: 'Try a different filter.',
    variant: 'compact',
  },
};

export const Error: Story = {
  render: () => ({
    components: { Button, ErrorState, RefreshCw },
    template: `
      <ErrorState
        description="Try again later or refresh the view."
        error-code="E_SAMPLE"
        retryable
        title="Unable to load items"
      >
        <template #action>
          <Button size="sm" variant="outline" tone="neutral">
            <RefreshCw />
            Retry
          </Button>
        </template>
      </ErrorState>
    `,
  }),
};
