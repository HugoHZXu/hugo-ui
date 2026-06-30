import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@hugo-ui/shadcn-vue';

const paginationCanvasStyle = {
  alignItems: 'center',
  background: 'var(--hugo-ui-shadcn-surface-default)',
  boxSizing: 'border-box',
  display: 'grid',
  gap: '16px',
  justifyItems: 'center',
  maxWidth: '100%',
  minWidth: 'min(100%, 320px)',
  padding: '32px',
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true,
    total: 120,
  },
  argTypes: {
    itemsPerPage: {
      control: { type: 'number', min: 1 },
    },
    siblingCount: {
      control: { type: 'number', min: 0 },
    },
    total: {
      control: { type: 'number', min: 0 },
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Controlled: Story = {
  render: (args) => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationEllipsis,
      PaginationFirst,
      PaginationItem,
      PaginationLast,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      const page = ref(4);

      return { args, page, paginationCanvasStyle };
    },
    template: `
      <div :style="paginationCanvasStyle">
        <Pagination v-bind="args" v-model:page="page" aria-label="Example pagination">
          <template #default="{ page: currentPage }">
            <PaginationContent v-slot="{ items }">
              <PaginationFirst />
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :is-active="item.value === currentPage"
                  :value="item.value"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else />
              </template>
              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </template>
        </Pagination>
        <span class="text-sm leading-5 text-hugo-text-subtle">Page {{ page }}</span>
      </div>
    `,
  }),
};

export const Linked: Story = {
  render: () => ({
    components: {
      Pagination,
      PaginationContent,
      PaginationItem,
      PaginationLink,
      PaginationNext,
      PaginationPrevious,
    },
    setup() {
      return { paginationCanvasStyle };
    },
    template: `
      <div :style="paginationCanvasStyle">
        <Pagination aria-label="Linked pagination" :default-page="2" :items-per-page="10" :total="30">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious as="a" href="#previous" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-2" is-active>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext as="a" href="#next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    `,
  }),
};
