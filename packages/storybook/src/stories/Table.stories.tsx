import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';
import { StatusTag, StatusTagTone, Table, TableColumn, TableSort } from '@hugo-ui/mui';
import { hugoUIColorRoles } from '@hugo-ui/mui/styles/theme';

type ExampleItem = {
  id: string;
  label: string;
  state: 'Ready' | 'Review' | 'Hidden';
  category: string;
  count: number;
  score: number;
};

const exampleItems: ExampleItem[] = [
  { id: 'item-1', label: 'Alpha pattern', state: 'Ready', category: 'Layout', count: 48, score: 6 },
  {
    id: 'item-2',
    label: 'Beta module',
    state: 'Review',
    category: 'Input',
    count: 24,
    score: 3,
  },
  {
    id: 'item-3',
    label: 'Gamma surface',
    state: 'Ready',
    category: 'Display',
    count: 72,
    score: 9,
  },
  {
    id: 'item-4',
    label: 'Delta variant',
    state: 'Hidden',
    category: 'Feedback',
    count: 8,
    score: 1,
  },
  {
    id: 'item-5',
    label: 'Epsilon block',
    state: 'Ready',
    category: 'Navigation',
    count: 19,
    score: 2,
  },
];

const stateToneMap: Record<ExampleItem['state'], StatusTagTone> = {
  Ready: 'success',
  Review: 'warning',
  Hidden: 'neutral',
};

const ItemStateTag = ({ state }: { state: ExampleItem['state'] }) => (
  <StatusTag tone={stateToneMap[state]}>{state}</StatusTag>
);

const TablePreview = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      width: 'min(100%, 1120px)',
      display: 'grid',
      gap: 2,
      padding: 3,
      background: hugoUIColorRoles.surface.subtle,
    }}
  >
    {children}
  </Box>
);

const itemColumns: TableColumn<ExampleItem>[] = [
  {
    id: 'label',
    header: 'Item',
    sortable: true,
    minWidth: 220,
    render: (row) => row.label,
  },
  {
    id: 'state',
    header: 'State',
    sortable: true,
    minWidth: 120,
    render: (row) => <ItemStateTag state={row.state} />,
  },
  {
    id: 'category',
    header: 'Category',
    minWidth: 140,
    render: (row) => row.category,
  },
  {
    id: 'count',
    header: 'Count',
    sortable: true,
    align: 'right',
    width: 120,
    render: (row) => row.count,
  },
  {
    id: 'score',
    header: 'Score',
    align: 'right',
    width: 120,
    render: (row) => row.score,
  },
];

const meta = {
  title: 'HugoUI/Molecules/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <TablePreview>
      <Table
        ariaLabel="Items"
        columns={itemColumns}
        rows={exampleItems}
        getRowId={(row) => row.id}
      />
    </TablePreview>
  ),
};

export const Sortable: Story = {
  render: function SortableTable() {
    const [sort, setSort] = useState<TableSort>(null);
    return (
      <TablePreview>
        <Table
          ariaLabel="Sortable items"
          columns={itemColumns}
          rows={exampleItems}
          getRowId={(row) => row.id}
          sort={sort}
          onSortChange={setSort}
        />
      </TablePreview>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <TablePreview>
      <Table
        ariaLabel="Loading items"
        columns={itemColumns}
        rows={[]}
        getRowId={(row) => row.id}
        loading
        pagination={{
          page: 0,
          pageSize: 5,
          total: 50,
          pageSizeOptions: [5, 10],
          onPageChange: action('page changed'),
        }}
      />
    </TablePreview>
  ),
};

export const Empty: Story = {
  render: () => (
    <TablePreview>
      <Table
        ariaLabel="Empty items"
        columns={itemColumns}
        rows={[]}
        getRowId={(row) => row.id}
        empty="No items match the current view."
      />
    </TablePreview>
  ),
};

export const Error: Story = {
  render: () => (
    <TablePreview>
      <Table
        ariaLabel="Error items"
        columns={itemColumns}
        rows={[]}
        getRowId={(row) => row.id}
        error="Unable to load items. Try refreshing the page."
      />
    </TablePreview>
  ),
};

export const Paginated: Story = {
  render: function PaginatedTable() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const visibleRows = exampleItems.slice(page * pageSize, page * pageSize + pageSize);

    return (
      <TablePreview>
        <Table
          ariaLabel="Paginated items"
          columns={itemColumns}
          rows={visibleRows}
          getRowId={(row) => row.id}
          pagination={{
            page,
            pageSize,
            total: exampleItems.length,
            pageSizeOptions: [2, 5],
            onPageChange: setPage,
            onPageSizeChange: (nextPageSize) => {
              setPage(0);
              setPageSize(nextPageSize);
            },
          }}
        />
      </TablePreview>
    );
  },
};

export const SingleSelectedRow: Story = {
  render: function SingleSelectedRowTable() {
    const [selectedRowId, setSelectedRowId] = useState('item-2');
    return (
      <TablePreview>
        <Table
          ariaLabel="Selectable items"
          columns={itemColumns}
          rows={exampleItems}
          getRowId={(row) => row.id}
          selectedRowId={selectedRowId}
          onSelectedRowIdChange={setSelectedRowId}
        />
      </TablePreview>
    );
  },
};

export const RowClickKeyboardActivation: Story = {
  render: function RowClickKeyboardActivationTable() {
    const [selectedName, setSelectedName] = useState('None');
    return (
      <TablePreview>
        <Box aria-live="polite">Selected row: {selectedName}</Box>
        <Table
          ariaLabel="Interactive items"
          columns={itemColumns}
          rows={exampleItems}
          getRowId={(row) => row.id}
          onRowClick={(row) => setSelectedName(row.label)}
        />
      </TablePreview>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByText('Alpha pattern').closest('tr');
    expect(row).not.toBeNull();
    row?.focus();
    await userEvent.keyboard('[Enter]');
    await expect(canvas.getByText('Selected row: Alpha pattern')).toBeInTheDocument();
  },
};
