import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hugo-ui/shadcn-vue';

const previewStyle = {
  background: 'var(--hugo-ui-shadcn-surface-subtle)',
  display: 'grid',
  gap: '16px',
  padding: '24px',
  width: 'min(100%, 720px)',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    clickable: false,
    size: 'default',
  },
  argTypes: {
    clickable: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
    },
    class: {
      control: { type: 'text' },
    },
    onClick: {
      action: 'clicked',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { Card, CardContent, CardDescription, CardHeader, CardTitle },
    setup() {
      return { args, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <Card v-bind="args">
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardDescription>
              Reusable detail panel for grouped fields and supporting notes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    `,
  }),
};

export const Clickable: Story = {
  args: {
    clickable: true,
  },
  render: (args) => ({
    components: { Card, CardContent, CardDescription, CardHeader, CardTitle },
    setup() {
      return { args, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <Card v-bind="args">
          <CardHeader>
            <CardTitle>Open details</CardTitle>
            <CardDescription>
              Click or press Enter to activate a selectable panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    `,
  }),
};

export const Sections: Story = {
  render: (args) => ({
    components: {
      Button,
      Card,
      CardAction,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
    },
    setup() {
      return { args, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <Card v-bind="args">
          <CardHeader>
            <CardTitle>Example section</CardTitle>
            <CardDescription>
              Neutral content blocks can combine headings, copy, actions, and footer metadata.
            </CardDescription>
            <CardAction>
              <Button size="sm" variant="outline">Edit</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <dl class="grid gap-3 text-sm">
              <div class="grid grid-cols-[140px_1fr] gap-4">
                <dt class="text-hugo-text-subtle">Owner</dt>
                <dd class="text-hugo-text-primary">Sample group</dd>
              </div>
              <div class="grid grid-cols-[140px_1fr] gap-4">
                <dt class="text-hugo-text-subtle">Updated</dt>
                <dd class="text-hugo-text-primary">12 Jan 2026</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <span>Ready</span>
            <Button size="sm">Continue</Button>
          </CardFooter>
        </Card>
      </div>
    `,
  }),
};

export const Compact: Story = {
  args: {
    size: 'sm',
  },
  render: Basic.render,
};
