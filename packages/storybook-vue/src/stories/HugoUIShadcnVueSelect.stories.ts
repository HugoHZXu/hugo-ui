import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Select, type SelectOption } from '@hugo-ui/shadcn-vue';

const options: SelectOption[] = [
  { label: 'Assign', value: 'assign' },
  { label: 'Revoke', value: 'revoke' },
  { disabled: true, label: 'Archived', value: 'archived' },
];

const groupedOptions: SelectOption[] = [
  { group: 'Status', label: 'Ready', value: 'ready' },
  { group: 'Status', label: 'Review', value: 'review' },
  { group: 'Language', label: 'English', value: 'en' },
  { group: 'Language', label: 'Chinese', value: 'zh' },
];

const meta = {
  title: 'Hugo UI Shadcn Vue/Atom/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Action',
    options,
    placeholder: 'Choose an action',
    size: 'default',
    status: 'default',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['default', 'sm'],
    },
    status: {
      control: { type: 'radio' },
      options: ['default', 'error'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<string | number | null>(null);
      return { args, value };
    },
    template: '<Select v-model="value" v-bind="args" />',
  }),
};

export const Grouped: Story = {
  args: {
    label: 'Filter',
    options: groupedOptions,
    placeholder: 'Choose a filter',
  },
  render: Basic.render,
};

export const Open: Story = {
  args: {
    defaultOpen: true,
    forceMount: true,
    label: 'Open options',
    options: groupedOptions,
    placeholder: 'Choose an option',
  },
  render: Basic.render,
};

export const Error: Story = {
  args: {
    error: 'Choose one option.',
    label: 'Required action',
    options,
    required: true,
  },
  render: Basic.render,
};
