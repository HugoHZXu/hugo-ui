import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, h, onBeforeUnmount, ref } from 'vue';
import { Badge, DataGrid } from '@hugo-ui/shadcn-vue';
import type { DataGridColumn, DataGridColumnSizing, DataGridSort } from '@hugo-ui/shadcn-vue';

type ExampleEntry = {
  id: string;
  label: string;
  state: 'Ready' | 'Review' | 'Hidden';
  section: string;
  count: number;
  score: number;
  updated: string;
};

const stateToneMap = {
  Ready: 'success',
  Review: 'warning',
  Hidden: 'neutral',
} as const;

const sectionNames = ['Layout', 'Input', 'Display', 'Feedback', 'Navigation'];
const stateNames: ExampleEntry['state'][] = ['Ready', 'Review', 'Hidden'];

const createEntries = (count: number): ExampleEntry[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `entry-${index + 1}`,
    label: `Sample entry ${index + 1}`,
    state: stateNames[index % stateNames.length],
    section: sectionNames[index % sectionNames.length],
    count: 12 + ((index * 7) % 90),
    score: 1 + (index % 10),
    updated: `2026-06-${String((index % 20) + 1).padStart(2, '0')}`,
  }));

const entries = createEntries(42);
const longEntries = createEntries(2000);
const infiniteEntries = createEntries(120);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(value));

const getSortValue = (entry: ExampleEntry, columnId: string) => {
  switch (columnId) {
    case 'label':
      return entry.label;
    case 'state':
      return entry.state;
    case 'section':
      return entry.section;
    case 'count':
      return entry.count;
    case 'score':
      return entry.score;
    case 'updated':
      return entry.updated;
    default:
      return '';
  }
};

const sortEntries = (rows: ExampleEntry[], sort: DataGridSort) => {
  if (!sort) {
    return rows;
  }

  return [...rows].sort((a, b) => {
    const aValue = getSortValue(a, sort.columnId);
    const bValue = getSortValue(b, sort.columnId);
    const result =
      typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));

    return sort.direction === 'asc' ? result : -result;
  });
};

const columns: DataGridColumn<ExampleEntry>[] = [
  {
    id: 'label',
    header: 'Item',
    sortable: true,
    minWidth: 220,
    maxWidth: 520,
    render: (row) => row.label,
  },
  {
    id: 'state',
    header: 'State',
    sortable: true,
    minWidth: 130,
    maxWidth: 240,
    render: (row) => h(Badge, { tone: stateToneMap[row.state] }, () => row.state),
  },
  {
    id: 'section',
    header: 'Section',
    sortable: true,
    minWidth: 160,
    maxWidth: 320,
    render: (row) => row.section,
  },
  {
    id: 'count',
    header: 'Count',
    sortable: true,
    align: 'right',
    width: 120,
    minWidth: 96,
    maxWidth: 180,
    render: (row) => row.count,
  },
  {
    id: 'score',
    header: 'Score',
    sortable: true,
    align: 'right',
    width: 120,
    minWidth: 96,
    maxWidth: 180,
    render: (row) => row.score,
  },
  {
    id: 'updated',
    header: 'Updated',
    sortable: true,
    minWidth: 180,
    maxWidth: 280,
    render: (row) => formatDate(row.updated),
  },
];

const flexibleColumns: DataGridColumn<ExampleEntry>[] = columns.map((column) =>
  column.id === 'label' || column.id === 'section' ? { ...column, grow: true } : column
);

const previewStyle = {
  background: 'var(--hugo-ui-shadcn-surface-subtle)',
  display: 'grid',
  gap: '16px',
  padding: '24px',
  width: 'min(100%, 1120px)',
};

const fillPreviewStyle = {
  ...previewStyle,
  height: '560px',
  minHeight: 0,
};

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/DataGrid',
  component: DataGrid as never,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Resizable entries',
    columns,
    rows: entries.slice(0, 12),
    getRowId: (row: ExampleEntry) => row.id,
    fill: false,
    height: 420,
    rowHeight: 52,
    overscan: 8,
    endReachedThreshold: 96,
    hasMore: true,
    loading: false,
    loadingMore: false,
    empty: 'No results found.',
    error: undefined,
    selectedRowId: undefined,
    selectedRowIds: [],
    showCheckboxColumn: false,
    showHeaderCheckbox: true,
    sort: null,
    virtualized: false,
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for the grid.',
      table: { type: { summary: 'string' } },
    },
    columns: {
      control: false,
      description:
        'Column definitions. Set `sortable: true` for opt-in sorting and `grow: true` on one or more columns to let them share remaining width.',
      table: { type: { summary: 'DataGridColumn<T>[]' } },
    },
    rows: {
      control: false,
      description: 'Current row data rendered by the grid.',
      table: { type: { summary: 'T[]' } },
    },
    getRowId: {
      control: false,
      description: 'Stable row id resolver.',
      table: { type: { summary: '(row: T) => string' } },
    },
    height: {
      control: { type: 'number' },
      description:
        'Fixed scroll viewport height when `fill` is false. Numbers are treated as pixels.',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: '420' } },
    },
    fill: {
      control: { type: 'boolean' },
      description:
        'Fills the parent container height and lets the grid viewport take the remaining internal space.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    virtualized: {
      control: { type: 'boolean' },
      description: 'Renders only the visible row window for long lists. Disabled by default.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    rowHeight: {
      control: { type: 'number' },
      description: 'Fixed body row height used for body rows and virtual calculations.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '52' } },
    },
    overscan: {
      control: { type: 'number' },
      description: 'Extra rows rendered above and below the viewport when `virtualized` is true.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '8' } },
    },
    endReachedThreshold: {
      control: { type: 'number' },
      description: 'Distance from the scroll end, in pixels, before `endReached` fires.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '96' } },
    },
    hasMore: {
      control: { type: 'boolean' },
      description: 'Allows `endReached` to fire while more rows are available.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    columnSizing: {
      control: false,
      description: 'Controlled or default column width options.',
      table: { type: { summary: 'DataGridColumnSizing' } },
    },
    sort: {
      control: false,
      description:
        'Controlled sort state. Sorting is interactive only when `@sort-change` is provided.',
      table: { type: { summary: 'DataGridSort' }, defaultValue: { summary: 'null' } },
    },
    pagination: {
      control: false,
      description: 'Pagination state and page-size options.',
      table: { type: { summary: 'DataGridPagination' } },
    },
    selectedRowId: {
      control: { type: 'text' },
      description: 'Current selected row id.',
      table: { type: { summary: 'string' } },
    },
    selectedRowIds: {
      control: false,
      description: 'Checked row ids for the optional checkbox column.',
      table: { type: { summary: 'string[]' } },
    },
    showCheckboxColumn: {
      control: { type: 'boolean' },
      description: 'Shows the checkbox selection column as the first column.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showHeaderCheckbox: {
      control: { type: 'boolean' },
      description: 'Shows the select-all checkbox in the checkbox column header.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading skeleton rows.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loadingMore: {
      control: { type: 'boolean' },
      description: 'Shows a bottom loading row and suppresses additional `endReached` events.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    empty: {
      control: { type: 'text' },
      description: 'Empty state content.',
      table: {
        type: { summary: 'string | VNode' },
        defaultValue: { summary: 'No results found.' },
      },
    },
    error: {
      control: { type: 'text' },
      description: 'Error state content.',
      table: { type: { summary: 'string | VNode' } },
    },
    class: {
      control: { type: 'text' },
      description: 'Root class override.',
      table: { type: { summary: "HTMLAttributes['class']" } },
    },
    onSortChange: {
      action: 'sort-change',
      description: 'Fired when an interactive sortable header is clicked.',
      table: { category: 'events', type: { summary: '(sort: DataGridSort) => void' } },
    },
    onColumnWidthsChange: {
      action: 'column-widths-change',
      description: 'Fired after column widths change.',
      table: { category: 'events', type: { summary: '(widths: ColumnSizingState) => void' } },
    },
    onPageChange: {
      action: 'page-change',
      description: 'Fired when pagination changes page.',
      table: { category: 'events', type: { summary: '(page: number) => void' } },
    },
    onPageSizeChange: {
      action: 'page-size-change',
      description: 'Fired when page size changes.',
      table: { category: 'events', type: { summary: '(pageSize: number) => void' } },
    },
    onSelectedRowIdChange: {
      action: 'selected-row-id-change',
      description: 'Fired when an interactive row is selected.',
      table: { category: 'events', type: { summary: '(rowId: string, row: T) => void' } },
    },
    onSelectedRowIdsChange: {
      action: 'selected-row-ids-change',
      description: 'Fired when the checkbox column selection changes.',
      table: { category: 'events', type: { summary: '(rowIds: string[]) => void' } },
    },
    onEndReached: {
      action: 'end-reached',
      description: 'Fired when scrolling close to the end while `hasMore` is true.',
      table: { category: 'events', type: { summary: '() => void' } },
    },
    onRowClick: {
      action: 'row-click',
      description: 'Fired when an interactive row is activated.',
      table: { category: 'events', type: { summary: '(row: T) => void' } },
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Generic Vue data grid built on @tanstack/vue-table. It renders every row by default for small tables; pass `virtualized` for long lists. Use `fill` when the parent owns the available height, or `height` for a fixed viewport. Sorting is opt-in at two levels: a column must set `sortable: true`, and the grid must receive `@sort-change`.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Resizable: Story = {
  render: (args) => ({
    components: { DataGrid },
    setup() {
      return { args, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid v-bind="args" />
      </div>
    `,
  }),
};

export const FillParent: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { columns, fillPreviewStyle, longEntries };
    },
    template: `
      <div :style="fillPreviewStyle">
        <DataGrid
          fill
          aria-label="Full-height entries"
          :columns="columns"
          :rows="longEntries"
          :get-row-id="(row) => row.id"
          :row-height="52"
          :overscan="8"
          virtualized
        />
      </div>
    `,
  }),
};

export const Sortable: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const sort = ref<DataGridSort>(null);
      const sortedRows = computed(() => sortEntries(entries.slice(0, 12), sort.value));

      return { columns, previewStyle, sort, sortedRows };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Sortable entries"
          :columns="columns"
          :rows="sortedRows"
          :get-row-id="(row) => row.id"
          :height="420"
          :sort="sort"
          @sort-change="sort = $event"
        />
      </div>
    `,
  }),
};

export const ControlledColumnWidths: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const widths = ref<DataGridColumnSizing['widths']>({
        label: 280,
        state: 150,
        section: 180,
        count: 120,
        score: 120,
        updated: 180,
      });

      return { columns, entries, previewStyle, widths };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Controlled width entries"
          :columns="columns"
          :rows="entries.slice(0, 16)"
          :get-row-id="(row) => row.id"
          :height="420"
          :column-sizing="{ widths, resizeMode: 'onEnd' }"
          @column-widths-change="widths = $event"
        />
      </div>
    `,
  }),
};

export const FlexibleColumns: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { entries, flexibleColumns, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Flexible column entries"
          :columns="flexibleColumns"
          :rows="entries.slice(0, 16)"
          :get-row-id="(row) => row.id"
          :height="420"
        />
      </div>
    `,
  }),
};

export const Paginated: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const page = ref(0);
      const pageSize = ref(10);
      const visibleRows = computed(() =>
        entries.slice(page.value * pageSize.value, page.value * pageSize.value + pageSize.value)
      );
      const pagination = computed(() => ({
        page: page.value,
        pageSize: pageSize.value,
        total: entries.length,
        pageSizeOptions: [5, 10, 25],
      }));
      const handlePageSizeChange = (nextPageSize: number) => {
        page.value = 0;
        pageSize.value = nextPageSize;
      };

      return {
        columns,
        handlePageSizeChange,
        page,
        pagination,
        previewStyle,
        visibleRows,
      };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Paginated entries"
          :columns="columns"
          :rows="visibleRows"
          :get-row-id="(row) => row.id"
          :height="420"
          :pagination="pagination"
          @page-change="page = $event"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    `,
  }),
};

export const Selectable: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const selectedRowId = ref('entry-2');

      return { columns, entries, previewStyle, selectedRowId };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Selectable entries"
          :columns="columns"
          :rows="entries.slice(0, 12)"
          :get-row-id="(row) => row.id"
          :height="420"
          :selected-row-id="selectedRowId"
          @selected-row-id-change="selectedRowId = $event"
        />
      </div>
    `,
  }),
};

export const CheckboxSelection: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const selectedRowId = ref('entry-2');
      const selectedRowIds = ref(['entry-1', 'entry-3']);

      return { columns, entries, previewStyle, selectedRowId, selectedRowIds };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Checkbox selectable entries"
          :columns="columns"
          :rows="entries.slice(0, 12)"
          :get-row-id="(row) => row.id"
          :height="420"
          :selected-row-id="selectedRowId"
          :selected-row-ids="selectedRowIds"
          show-checkbox-column
          @selected-row-id-change="selectedRowId = $event"
          @selected-row-ids-change="selectedRowIds = $event"
        />
      </div>
    `,
  }),
};

export const CheckboxSelectionWithoutHeader: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const selectedRowIds = ref(['entry-1', 'entry-3']);

      return { columns, entries, previewStyle, selectedRowIds };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Checkbox selectable entries without select all"
          :columns="columns"
          :rows="entries.slice(0, 12)"
          :get-row-id="(row) => row.id"
          :height="420"
          :selected-row-ids="selectedRowIds"
          show-checkbox-column
          :show-header-checkbox="false"
          @selected-row-ids-change="selectedRowIds = $event"
        />
      </div>
    `,
  }),
};

export const LongList: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { columns, longEntries, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Long entries"
          :columns="columns"
          :rows="longEntries"
          :get-row-id="(row) => row.id"
          :height="520"
          :row-height="52"
          :overscan="8"
          virtualized
        />
      </div>
    `,
  }),
};

export const InfiniteScrollMock: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      const pageSize = 18;
      const visibleCount = ref(24);
      const loadingMore = ref(false);
      const timeoutId = ref<number>();
      const visibleRows = computed(() => infiniteEntries.slice(0, visibleCount.value));
      const hasMore = computed(() => visibleRows.value.length < infiniteEntries.length);

      const handleEndReached = () => {
        if (loadingMore.value || !hasMore.value) {
          return;
        }

        loadingMore.value = true;
        timeoutId.value = window.setTimeout(() => {
          visibleCount.value = Math.min(visibleCount.value + pageSize, infiniteEntries.length);
          loadingMore.value = false;
        }, 500);
      };

      onBeforeUnmount(() => {
        if (timeoutId.value !== undefined) {
          window.clearTimeout(timeoutId.value);
        }
      });

      return { columns, hasMore, handleEndReached, loadingMore, previewStyle, visibleRows };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Infinite mock entries"
          :columns="columns"
          :rows="visibleRows"
          :get-row-id="(row) => row.id"
          :height="420"
          :end-reached-threshold="120"
          :has-more="hasMore"
          :loading-more="loadingMore"
          virtualized
          @end-reached="handleEndReached"
        />
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { columns, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Loading entries"
          :columns="columns"
          :rows="[]"
          :get-row-id="(row) => row.id"
          :height="360"
          loading
        />
      </div>
    `,
  }),
};

export const Empty: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { columns, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Empty entries"
          :columns="columns"
          :rows="[]"
          :get-row-id="(row) => row.id"
          :height="320"
          empty="No entries match the current view."
        />
      </div>
    `,
  }),
};

export const Error: Story = {
  render: () => ({
    components: { DataGrid },
    setup() {
      return { columns, previewStyle };
    },
    template: `
      <div :style="previewStyle">
        <DataGrid
          aria-label="Error entries"
          :columns="columns"
          :rows="[]"
          :get-row-id="(row) => row.id"
          :height="320"
          error="Unable to load entries."
        />
      </div>
    `,
  }),
};
