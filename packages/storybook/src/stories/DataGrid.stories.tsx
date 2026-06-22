import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { DataGrid, DataGridColumn, StatusTag, StatusTagTone } from '@hugo-ui/mui';
import type { DataGridColumnSizing, DataGridSort } from '@hugo-ui/mui';
import { hugoUIColorRoles } from '@hugo-ui/mui/styles/theme';

type ExampleEntry = {
  id: string;
  label: string;
  state: 'Ready' | 'Review' | 'Hidden';
  section: string;
  count: number;
  score: number;
  updated: string;
};

const stateToneMap: Record<ExampleEntry['state'], StatusTagTone> = {
  Ready: 'success',
  Review: 'warning',
  Hidden: 'neutral',
};

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

const EntryStateTag = ({ state }: { state: ExampleEntry['state'] }) => (
  <StatusTag tone={stateToneMap[state]}>{state}</StatusTag>
);

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

const dataGridColumns: DataGridColumn<ExampleEntry>[] = [
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
    render: (row) => <EntryStateTag state={row.state} />,
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

const DataGridPreview = ({ children }: { children: React.ReactNode }) => (
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

const meta = {
  title: 'HugoUI/Molecules/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataGrid>;

export default meta;

type Story = StoryObj;

export const Resizable: Story = {
  render: () => (
    <DataGridPreview>
      <DataGrid
        ariaLabel="Resizable entries"
        columns={dataGridColumns}
        rows={entries.slice(0, 12)}
        getRowId={(row) => row.id}
        height={420}
      />
    </DataGridPreview>
  ),
};

export const Sortable: Story = {
  render: function SortableDataGrid() {
    const [sort, setSort] = useState<DataGridSort>(null);
    const sortedRows = useMemo(() => sortEntries(entries.slice(0, 12), sort), [sort]);

    return (
      <DataGridPreview>
        <DataGrid
          ariaLabel="Sortable entries"
          columns={dataGridColumns}
          rows={sortedRows}
          getRowId={(row) => row.id}
          height={420}
          sort={sort}
          onSortChange={setSort}
        />
      </DataGridPreview>
    );
  },
};

export const ControlledColumnWidths: Story = {
  render: function ControlledColumnWidthsDataGrid() {
    const [widths, setWidths] = useState<DataGridColumnSizing['widths']>({
      label: 280,
      state: 150,
      section: 180,
      count: 120,
      score: 120,
      updated: 180,
    });

    return (
      <DataGridPreview>
        <DataGrid
          ariaLabel="Controlled width entries"
          columns={dataGridColumns}
          rows={entries.slice(0, 16)}
          getRowId={(row) => row.id}
          height={420}
          columnSizing={{
            widths,
            resizeMode: 'onEnd',
            onWidthsChange: setWidths,
          }}
        />
      </DataGridPreview>
    );
  },
};

export const Paginated: Story = {
  render: function PaginatedDataGrid() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const visibleRows = entries.slice(page * pageSize, page * pageSize + pageSize);

    return (
      <DataGridPreview>
        <DataGrid
          ariaLabel="Paginated entries"
          columns={dataGridColumns}
          rows={visibleRows}
          getRowId={(row) => row.id}
          height={420}
          pagination={{
            page,
            pageSize,
            total: entries.length,
            pageSizeOptions: [5, 10, 25],
            onPageChange: setPage,
            onPageSizeChange: (nextPageSize) => {
              setPage(0);
              setPageSize(nextPageSize);
            },
          }}
        />
      </DataGridPreview>
    );
  },
};

export const LongList: Story = {
  render: () => (
    <DataGridPreview>
      <DataGrid
        ariaLabel="Long entries"
        columns={dataGridColumns}
        rows={longEntries}
        getRowId={(row) => row.id}
        height={520}
        rowHeight={52}
        overscan={8}
      />
    </DataGridPreview>
  ),
};

export const Loading: Story = {
  render: () => (
    <DataGridPreview>
      <DataGrid
        ariaLabel="Loading entries"
        columns={dataGridColumns}
        rows={[]}
        getRowId={(row) => row.id}
        height={360}
        loading
      />
    </DataGridPreview>
  ),
};

export const Empty: Story = {
  render: () => (
    <DataGridPreview>
      <DataGrid
        ariaLabel="Empty entries"
        columns={dataGridColumns}
        rows={[]}
        getRowId={(row) => row.id}
        height={320}
        empty="No entries match the current view."
      />
    </DataGridPreview>
  ),
};

export const Error: Story = {
  render: () => (
    <DataGridPreview>
      <DataGrid
        ariaLabel="Error entries"
        columns={dataGridColumns}
        rows={[]}
        getRowId={(row) => row.id}
        height={320}
        error="Unable to load entries."
      />
    </DataGridPreview>
  ),
};
