import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { WorkflowStepper, type WorkflowStep } from '@hugo-ui/shadcn-vue';

const steps: WorkflowStep[] = [
  {
    description: 'The sample file is ready.',
    duration: '2 sec',
    id: 'prepare',
    status: 'success',
    title: 'Prepare',
  },
  {
    description: 'Entries are being checked.',
    id: 'review',
    status: 'active',
    timestamp: 'Now',
    title: 'Review',
  },
  {
    description: 'Warnings need attention.',
    id: 'warnings',
    status: 'warning',
    title: 'Warnings',
  },
  {
    description: 'Finish the workflow.',
    id: 'finish',
    title: 'Finish',
  },
];

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/WorkflowStepper',
  component: WorkflowStepper,
  tags: ['autodocs'],
  args: {
    clickable: false,
    orientation: 'vertical',
    steps,
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
    },
  },
} satisfies Meta<typeof WorkflowStepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { WorkflowStepper },
    setup() {
      return { args };
    },
    template: '<WorkflowStepper v-bind="args" />',
  }),
};

export const Clickable: Story = {
  render: () => ({
    components: { WorkflowStepper },
    setup() {
      const current = ref('review');
      return { current, steps };
    },
    template: `
      <WorkflowStepper
        v-model="current"
        clickable
        :steps="steps"
      />
    `,
  }),
};
