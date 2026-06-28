import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Download, MoreHorizontal, Settings, Trash2 } from 'lucide-vue-next';
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@hugo-ui/shadcn-vue';

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  args: {
    align: 'end',
    side: 'bottom',
  },
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: {
      Button,
      Download,
      DropdownMenu,
      DropdownMenuItem,
      DropdownMenuSeparator,
      MoreHorizontal,
      Settings,
      Trash2,
    },
    setup() {
      return { args };
    },
    template: `
      <DropdownMenu v-bind="args">
        <template #trigger>
          <Button size="icon" variant="ghost" tone="neutral" aria-label="Open actions">
            <MoreHorizontal />
          </Button>
        </template>

        <DropdownMenuItem shortcut="Cmd+E">
          <template #icon>
            <Download />
          </template>
          Export
        </DropdownMenuItem>
        <DropdownMenuItem>
          <template #icon>
            <Settings />
          </template>
          Configure
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive shortcut="Delete">
          <template #icon>
            <Trash2 />
          </template>
          Remove
        </DropdownMenuItem>
      </DropdownMenu>
    `,
  }),
};

export const DisabledItem: Story = {
  render: (args) => ({
    components: {
      Button,
      DropdownMenu,
      DropdownMenuItem,
      MoreHorizontal,
    },
    setup() {
      return { args };
    },
    template: `
      <DropdownMenu v-bind="args">
        <template #trigger>
          <Button variant="outline" tone="neutral">
            More
            <MoreHorizontal />
          </Button>
        </template>

        <DropdownMenuItem>Open details</DropdownMenuItem>
        <DropdownMenuItem disabled>Unavailable action</DropdownMenuItem>
      </DropdownMenu>
    `,
  }),
};
