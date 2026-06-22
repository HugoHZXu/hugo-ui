import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import DataGrid from './DataGrid.vue';
import type { DataGridColumn, DataGridSort } from './dataGrid';

type ExampleRow = {
  id: string;
  label: string;
  state: string;
  count: number;
};

const createRows = (count: number): ExampleRow[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    state: index % 2 === 0 ? 'Ready' : 'Review',
    count: index + 1,
  }));

const rows = createRows(12);

const columns: DataGridColumn<ExampleRow>[] = [
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
    minWidth: 140,
    render: (row) => row.state,
  },
  {
    id: 'count',
    header: 'Count',
    align: 'right',
    width: 120,
    render: (row) => row.count,
  },
];

const mountDataGrid = (props: Record<string, unknown> = {}) =>
  mount(DataGrid<ExampleRow>, {
    props: {
      ariaLabel: 'Items',
      columns,
      getRowId: (row: ExampleRow) => row.id,
      rows,
      ...props,
    },
  });

describe('DataGrid', () => {
  it('renders headers and visible row cells', () => {
    const wrapper = mountDataGrid();

    expect(wrapper.get('[role="grid"]').attributes('aria-label')).toBe('Items');
    expect(wrapper.findAll('[role="columnheader"]').map((header) => header.text())).toEqual([
      'Item',
      'State',
      'Count',
    ]);
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Ready');
  });

  it('does not enable sorting without a sort-change listener', () => {
    const wrapper = mountDataGrid();

    const firstHeader = wrapper.findAll('[role="columnheader"]')[0];
    expect(firstHeader.find('button').exists()).toBe(false);
    expect(firstHeader.text()).toBe('Item');
  });

  it('emits ascending and descending sort changes for sortable headers', async () => {
    const onSortChange = vi.fn();
    const wrapper = mountDataGrid({ onSortChange });

    await wrapper.get('[role="columnheader"] button').trigger('click');
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'label', direction: 'asc' });

    await wrapper.setProps({ sort: { columnId: 'label', direction: 'asc' } satisfies DataGridSort });
    await wrapper.get('[role="columnheader"] button').trigger('click');
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'label', direction: 'desc' });
  });

  it('virtualizes long row sets instead of rendering every row', () => {
    const wrapper = mountDataGrid({
      height: 156,
      overscan: 1,
      rowHeight: 52,
      rows: createRows(200),
    });

    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).not.toContain('Item 200');
  });

  it('renders loading, empty, and error states', async () => {
    const wrapper = mountDataGrid({ loading: true, rows: [] });

    expect(wrapper.findAll('[aria-label="Loading row"]').length).toBeGreaterThan(0);

    await wrapper.setProps({
      loading: false,
      empty: 'No items match the current view.',
      rows: [],
    });
    expect(wrapper.text()).toContain('No items match the current view.');

    await wrapper.setProps({ error: 'Unable to load items.' });
    expect(wrapper.text()).toContain('Unable to load items.');
  });

  it('renders pagination controls and emits pagination changes', async () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    const wrapper = mountDataGrid({
      onPageChange,
      onPageSizeChange,
      pagination: {
        page: 0,
        pageSize: 5,
        total: rows.length,
        pageSizeOptions: [5, 10],
      },
      rows: rows.slice(0, 5),
    });

    const next = wrapper.get('[aria-label="Go to next page"]');
    expect(next.classes()).toContain('cursor-pointer');
    await next.trigger('click');
    expect(onPageChange).toHaveBeenCalledWith(1);

    await wrapper.get('select').setValue('10');
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it('selects rows with click and keyboard activation', async () => {
    const onSelectedRowIdChange = vi.fn();
    const onRowClick = vi.fn();
    const wrapper = mountDataGrid({ onRowClick, onSelectedRowIdChange });
    const firstRow = wrapper.findAll('[role="row"]').find((row) => row.text().includes('Item 1'));

    expect(firstRow).toBeDefined();
    await firstRow!.trigger('click');
    expect(onSelectedRowIdChange).toHaveBeenCalledWith('item-1', rows[0]);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);

    await firstRow!.trigger('keydown', { key: 'Enter' });
    expect(onSelectedRowIdChange).toHaveBeenCalledTimes(2);
  });
});
