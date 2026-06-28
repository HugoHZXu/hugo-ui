import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Search, Star } from 'lucide-vue-next';
import { Input } from '@hugo-ui/shadcn-vue';

const stackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '260px',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Atom/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    description: 'Helper text',
    placeholder: '',
    modelValue: '',
    status: 'default',
    disabled: false,
    as: 'input',
    size: 'default',
    required: false,
    showCharacterCount: true,
    loading: false,
  },
  argTypes: {
    status: {
      control: { type: 'radio' },
      options: ['default', 'success', 'error'],
    },
    as: {
      control: { type: 'radio' },
      options: ['input', 'textarea'],
    },
    size: {
      control: { type: 'radio' },
      options: ['default', 'sm'],
    },
    class: {
      control: { type: 'text' },
    },
    classNames: {
      control: false,
    },
    slotProps: {
      control: false,
    },
    onChange: {
      action: 'changed',
    },
    'onUpdate:modelValue': {
      action: 'updated',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<Input v-bind="args" />',
  }),
};

export const Status: Story = {
  render: (args) => ({
    components: { Input },
    setup() {
      return { args, stackStyle };
    },
    template: `
      <div :style="stackStyle">
        <Input v-bind="args" label="Success" message="Success message" status="success" />
        <Input v-bind="args" label="Error" message="Error message" status="error" />
        <Input v-bind="args" label="Loading" loading />
        <Input v-bind="args" disabled label="Disabled" />
      </div>
    `,
  }),
};

export const Small: Story = {
  render: (args) => ({
    components: { Input },
    setup() {
      return { args, stackStyle };
    },
    template: `
      <div :style="stackStyle">
        <Input v-bind="args" label="Small success" size="sm" status="success" />
        <Input v-bind="args" label="Small error" size="sm" status="error" />
        <Input v-bind="args" label="Small loading" loading size="sm" />
      </div>
    `,
  }),
};

export const Textarea: Story = {
  args: {
    as: 'textarea',
    label: 'Description',
    modelValue: 'A short example note.',
  },
  render: Basic.render,
};

export const Required: Story = {
  args: {
    label: 'Item name',
    required: true,
  },
  render: Basic.render,
};

export const SearchPlaceholder: Story = {
  args: {
    label: 'Search items',
    name: 'search',
  },
  render: (args) => ({
    components: { Input, Search },
    setup() {
      return { args };
    },
    template: `
      <Input v-bind="args">
        <template #start-icon>
          <Search :size="18" />
        </template>
      </Input>
    `,
  }),
};

export const CustomIcon: Story = {
  args: {
    label: 'Example',
  },
  render: (args) => ({
    components: { Input, Star },
    setup() {
      return { args };
    },
    template: `
      <Input v-bind="args">
        <template #end-icon>
          <Star :size="18" />
        </template>
      </Input>
    `,
  }),
};
