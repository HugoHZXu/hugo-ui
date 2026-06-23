import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Settings, SquareStack } from 'lucide-vue-next';
import { PageTemplate } from '@hugo-ui/shadcn-vue';
import type { PageTemplateNavItem } from '@hugo-ui/shadcn-vue';

const navItems: PageTemplateNavItem[] = [
  {
    id: 'components',
    label: 'Components',
    icon: '□',
    children: [
      {
        id: 'updates',
        label: 'Updates',
        icon: '↻',
      },
    ],
  },
];

const demoContentStyle = {
  background: '#fff',
  border: '1px solid #d5d7de',
  borderRadius: '8px',
  minHeight: '280px',
  padding: '24px',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Templates/PageTemplate',
  component: PageTemplate,
  tags: ['autodocs'],
  args: {
    appTitle: 'Component Library',
    navProps: undefined,
    hidden: false,
  },
  argTypes: {
    appTitle: { control: { type: 'text' } },
    appIcon: { control: false },
    titleSlot: { control: false },
    navProps: { control: false },
    hidden: { control: { type: 'boolean' } },
    class: { control: { type: 'text' } },
    onBeforeSelection: { action: 'before-selection' },
    onSelectionChange: { action: 'selection-change' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithoutNavigation: Story = {
  render: (args) => ({
    components: { PageTemplate, SquareStack },
    setup() {
      return { args, demoContentStyle };
    },
    template: `
      <PageTemplate v-bind="args">
        <template #appIcon>
          <SquareStack />
        </template>
        <div :style="demoContentStyle">Template content</div>
      </PageTemplate>
    `,
  }),
};

export const WithNavigation: Story = {
  args: {
    navProps: {
      navItems,
      defaultSelected: 'components',
      defaultExpanded: ['components'],
    },
  },
  render: (args) => ({
    components: { PageTemplate, Settings, SquareStack },
    setup() {
      return { args, demoContentStyle };
    },
    template: `
      <PageTemplate v-bind="args">
        <template #appIcon>
          <SquareStack />
        </template>
        <template #titleSlot>
          <Settings class="h-5 w-5" />
        </template>
        <div :style="demoContentStyle">Template content</div>
      </PageTemplate>
    `,
  }),
};

export const ChildSelected: Story = {
  args: {
    navProps: {
      navItems,
      defaultSelected: 'updates',
      defaultExpanded: ['components'],
    },
  },
  render: WithNavigation.render,
};

export const ScrollableMainContent: Story = {
  args: {
    navProps: {
      navItems,
      defaultSelected: 'updates',
      defaultExpanded: ['components'],
    },
  },
  render: (args) => ({
    components: { PageTemplate, SquareStack },
    setup() {
      const sections = Array.from({ length: 16 }, (_, index) => `Content section ${index + 1}`);

      return { args, sections };
    },
    template: `
      <PageTemplate v-bind="args">
        <template #appIcon>
          <SquareStack />
        </template>
        <div class="grid gap-4">
          <div
            v-for="section in sections"
            :key="section"
            class="min-h-24 rounded-lg border border-[#d5d7de] bg-white p-6"
          >
            {{ section }}
          </div>
        </div>
      </PageTemplate>
    `,
  }),
};
