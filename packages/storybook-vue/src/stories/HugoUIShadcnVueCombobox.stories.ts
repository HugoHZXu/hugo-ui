import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Combobox, type ComboboxOption } from '@hugo-ui/shadcn-vue';

const options: ComboboxOption[] = [
  {
    description: 'Primary sample item',
    group: 'Examples',
    label: 'Alpha',
    value: 'alpha',
  },
  {
    description: 'Secondary sample item',
    group: 'Examples',
    label: 'Beta',
    value: 'beta',
  },
  {
    description: 'A disabled sample option',
    disabled: true,
    group: 'Examples',
    label: 'Gamma',
    value: 'gamma',
  },
  {
    description: 'Reusable note entry',
    group: 'Notes',
    label: 'Sample note',
    value: 'sample-note',
  },
];

const asyncOptions: ComboboxOption[] = [
  { description: 'Async result A', label: 'Async Alpha', value: 'async-alpha' },
  { description: 'Async result B', label: 'Async Beta', value: 'async-beta' },
  { description: 'Async result C', label: 'Async Gamma', value: 'async-gamma' },
];

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    clearable: true,
    label: 'Search item',
    options,
    placeholder: 'Search items',
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
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Combobox },
    setup() {
      const value = ref<string | number | null>(null);
      return { args, value };
    },
    template: '<Combobox v-model="value" v-bind="args" />',
  }),
};

export const AsyncSearch: Story = {
  render: () => ({
    components: { Combobox },
    setup() {
      const value = ref<string | number | null>(null);
      const search = async (query: string) => {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const normalizedQuery = query.trim().toLowerCase();
        return asyncOptions.filter((option) =>
          String(option.label).toLowerCase().includes(normalizedQuery)
        );
      };

      return { search, value };
    },
    template: `
      <Combobox
        v-model="value"
        clearable
        label="Async search"
        placeholder="Search async examples"
        :search="search"
      />
    `,
  }),
};

export const Open: Story = {
  args: {
    defaultOpen: true,
    forceMount: true,
    label: 'Open search',
    options,
    placeholder: 'Search items',
  },
  render: Basic.render,
};

export const Empty: Story = {
  args: {
    label: 'No result example',
    options: [],
    placeholder: 'Search items',
  },
  render: Basic.render,
};
