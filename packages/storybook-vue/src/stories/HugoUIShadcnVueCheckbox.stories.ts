import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, watch } from 'vue';
import { Checkbox, type CheckboxModelValue } from '@hugo-ui/shadcn-vue';

const stackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: '260px',
};

const rowStyle = {
  alignItems: 'center',
  columnGap: '24px',
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '16px',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Atom/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Sample option',
    description: 'Optional helper text',
    modelValue: false,
    disabled: false,
    required: false,
    labelClickable: true,
  },
  argTypes: {
    modelValue: {
      control: { type: 'select' },
      options: [false, true, 'indeterminate'],
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
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

const createInteractiveRender = () => (args: Record<string, unknown>) => ({
  components: { Checkbox },
  setup() {
    const value = ref<CheckboxModelValue>((args.modelValue as CheckboxModelValue) ?? false);

    watch(
      () => args.modelValue,
      (nextValue) => {
        value.value = (nextValue as CheckboxModelValue) ?? false;
      }
    );

    function handleUpdate(nextValue: CheckboxModelValue) {
      value.value = nextValue;
      const action = args['onUpdate:modelValue'];

      if (typeof action === 'function') {
        action(nextValue);
      }
    }

    return { args, handleUpdate, value };
  },
  template: `
    <Checkbox
      v-bind="{ ...args, modelValue: value }"
      @update:model-value="handleUpdate"
    />
  `,
});

export const Basic: Story = {
  render: createInteractiveRender(),
};

export const States: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, stackStyle };
    },
    template: `
      <div :style="stackStyle">
        <Checkbox v-bind="args" :model-value="false" label="Unchecked" description="Rest state" />
        <Checkbox v-bind="args" :model-value="true" label="Checked" description="Selected state" />
        <Checkbox
          v-bind="args"
          model-value="indeterminate"
          label="Indeterminate"
          description="Mixed state"
        />
        <Checkbox v-bind="args" disabled label="Disabled" description="Unavailable state" />
        <Checkbox
          v-bind="args"
          disabled
          :model-value="true"
          label="Disabled checked"
          description="Unavailable selected state"
        />
      </div>
    `,
  }),
};

export const Inline: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      return { args, rowStyle };
    },
    template: `
      <div :style="rowStyle">
        <Checkbox v-bind="args" label="Alpha" />
        <Checkbox v-bind="args" :model-value="true" label="Beta" />
        <Checkbox v-bind="args" model-value="indeterminate" label="Gamma" />
      </div>
    `,
  }),
};

export const WithoutLabel: Story = {
  args: {
    description: undefined,
    label: undefined,
    modelValue: true,
    slotProps: {
      control: {
        'aria-label': 'Select sample option',
      },
    },
  },
  render: createInteractiveRender(),
};

export const NonClickableLabel: Story = {
  args: {
    label: 'Display-only label',
    description: 'Only the square control toggles this option.',
    labelClickable: false,
  },
  render: createInteractiveRender(),
};
