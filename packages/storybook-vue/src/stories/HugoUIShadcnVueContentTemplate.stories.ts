import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Button, ContentTemplate } from '@hugo-ui/shadcn-vue';

const panelContentStyle = {
  color: '#354052',
  minHeight: '120px',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Templates/ContentTemplate',
  component: ContentTemplate,
  tags: ['autodocs'],
  args: {
    type: 'table',
    pageTitle: 'Components',
    titleInfo: 'Search, filter, sort, and inspect reusable component examples.',
    errorMessage: undefined,
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['card', 'table', 'error', 'full'],
    },
    pageTitle: { control: { type: 'text' } },
    titleInfo: { control: { type: 'text' } },
    errorMessage: { control: { type: 'text' } },
    class: { control: { type: 'text' } },
    onBack: { action: 'back' },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ContentTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Table: Story = {
  render: (args) => ({
    components: { Button, ContentTemplate },
    setup() {
      return { args, panelContentStyle };
    },
    template: `
      <ContentTemplate v-bind="args">
        <template #actions>
          <Button>Add</Button>
        </template>
        <div :style="panelContentStyle">Table content</div>
      </ContentTemplate>
    `,
  }),
};

export const Card: Story = {
  args: {
    type: 'card',
    pageTitle: 'Alpha pattern',
    titleInfo: 'Component detail placeholder.',
  },
  render: (args) => ({
    components: { ContentTemplate },
    setup() {
      return { args, panelContentStyle };
    },
    template: `
      <ContentTemplate v-bind="args" @back="args.onBack">
        <div :style="panelContentStyle">Detail content</div>
      </ContentTemplate>
    `,
  }),
};

export const Error: Story = {
  args: {
    type: 'error',
    pageTitle: 'Page not found',
    errorMessage: 'The requested route does not exist.',
  },
  render: (args) => ({
    components: { ContentTemplate },
    setup() {
      return { args };
    },
    template: '<ContentTemplate v-bind="args" @back="args.onBack" />',
  }),
};

export const Full: Story = {
  args: {
    type: 'full',
    pageTitle: 'Full width page',
    titleInfo: undefined,
  },
  render: (args) => ({
    components: { ContentTemplate },
    setup() {
      return { args, panelContentStyle };
    },
    template: `
      <ContentTemplate v-bind="args">
        <div :style="panelContentStyle">Unframed content</div>
      </ContentTemplate>
    `,
  }),
};
