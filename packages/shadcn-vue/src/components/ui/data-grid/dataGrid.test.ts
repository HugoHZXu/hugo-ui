import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import DataGrid from './DataGrid.vue';
import {
  DEFAULT_CHECKBOX_COLUMN_MIN_WIDTH,
  DEFAULT_CHECKBOX_COLUMN_WIDTH,
  KEYBOARD_RESIZE_STEP,
  type DataGridColumn,
  type DataGridSort,
} from './dataGrid';

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

const getGridTemplateColumnsStyle = (wrapper: ReturnType<typeof mountDataGrid>) =>
  wrapper.find('[role="row"]').attributes('style') ?? '';

const setScrollMetrics = (
  element: HTMLElement,
  metrics: { clientHeight: number; scrollHeight: number; scrollTop: number }
) => {
  Object.defineProperty(element, 'clientHeight', {
    configurable: true,
    value: metrics.clientHeight,
  });
  Object.defineProperty(element, 'scrollHeight', {
    configurable: true,
    value: metrics.scrollHeight,
  });
  Object.defineProperty(element, 'scrollTop', {
    configurable: true,
    value: metrics.scrollTop,
    writable: true,
  });
};

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

  it('stretches the final column when no grow column is configured', () => {
    const wrapper = mountDataGrid();

    expect(getGridTemplateColumnsStyle(wrapper)).toContain(
      'grid-template-columns: 220px 140px minmax(120px, 1fr)'
    );
  });

  it('stretches all configured grow columns instead of the final column', () => {
    const wrapper = mountDataGrid({
      columns: columns.map((column) =>
        column.id === 'label' || column.id === 'state' ? { ...column, grow: true } : column
      ),
    });

    expect(getGridTemplateColumnsStyle(wrapper)).toContain(
      'grid-template-columns: minmax(220px, 1fr) minmax(140px, 1fr) 120px'
    );
  });

  it('applies fixed viewport height when fill is false', () => {
    const wrapper = mountDataGrid({ height: 360 });

    expect(wrapper.get('[role="grid"]').attributes('style')).toContain('height: 360px');
  });

  it('applies a full-height layout chain when fill is true', () => {
    const wrapper = mountDataGrid({ fill: true });
    const frame = wrapper.element.firstElementChild as HTMLElement;
    const viewport = wrapper.get('[role="grid"]');

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-full', 'min-h-0']));
    expect(Array.from(frame.classList)).toEqual(
      expect.arrayContaining(['flex', 'h-full', 'min-h-0', 'flex-col'])
    );
    expect(viewport.classes()).toEqual(
      expect.arrayContaining(['flex-auto', 'min-h-0', 'overflow-auto'])
    );
    expect(viewport.attributes('style') ?? '').not.toContain('height');
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

    await wrapper.setProps({
      sort: { columnId: 'label', direction: 'asc' } satisfies DataGridSort,
    });
    await wrapper.get('[role="columnheader"] button').trigger('click');
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'label', direction: 'desc' });
  });

  it('renders every row by default', () => {
    const wrapper = mountDataGrid({
      height: 156,
      overscan: 1,
      rowHeight: 52,
      rows: createRows(200),
    });

    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 200');
  });

  it('virtualizes long row sets when virtualized is true', () => {
    const wrapper = mountDataGrid({
      height: 156,
      overscan: 1,
      rowHeight: 52,
      rows: createRows(200),
      virtualized: true,
    });

    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).not.toContain('Item 200');
  });

  it('emits endReached near the bottom and suppresses duplicate loading triggers', async () => {
    const onEndReached = vi.fn();
    const wrapper = mountDataGrid({
      endReachedThreshold: 80,
      onEndReached,
      rows: createRows(20),
    });
    const viewport = wrapper.get('[role="grid"]');

    setScrollMetrics(viewport.element as HTMLElement, {
      clientHeight: 400,
      scrollHeight: 1000,
      scrollTop: 500,
    });
    await viewport.trigger('scroll');
    expect(onEndReached).not.toHaveBeenCalled();

    setScrollMetrics(viewport.element as HTMLElement, {
      clientHeight: 400,
      scrollHeight: 1000,
      scrollTop: 530,
    });
    await viewport.trigger('scroll');
    expect(onEndReached).toHaveBeenCalledTimes(1);

    await viewport.trigger('scroll');
    expect(onEndReached).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ loadingMore: true });
    expect(wrapper.get('[aria-label="Loading more rows"]').text()).toContain('Loading more');
    setScrollMetrics(viewport.element as HTMLElement, {
      clientHeight: 400,
      scrollHeight: 1200,
      scrollTop: 730,
    });
    await viewport.trigger('scroll');
    expect(onEndReached).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ loadingMore: false, rows: createRows(30) });
    setScrollMetrics(viewport.element as HTMLElement, {
      clientHeight: 400,
      scrollHeight: 1500,
      scrollTop: 1030,
    });
    await viewport.trigger('scroll');
    expect(onEndReached).toHaveBeenCalledTimes(2);

    await wrapper.setProps({ hasMore: false });
    setScrollMetrics(viewport.element as HTMLElement, {
      clientHeight: 400,
      scrollHeight: 1800,
      scrollTop: 1330,
    });
    await viewport.trigger('scroll');
    expect(onEndReached).toHaveBeenCalledTimes(2);
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

  it('renders optional checkbox selection and keeps checkbox events separate from row activation', async () => {
    const onSelectedRowIdsChange = vi.fn();
    const onSelectedRowIdChange = vi.fn();
    const onRowClick = vi.fn();
    const onColumnWidthsChange = vi.fn();
    const wrapper = mountDataGrid({
      onColumnWidthsChange,
      onRowClick,
      onSelectedRowIdChange,
      onSelectedRowIdsChange,
      selectedRowIds: ['item-2'],
      showCheckboxColumn: true,
    });

    const checkboxControls = () => wrapper.findAll('[data-slot="checkbox-control"]');
    const headerCheckbox = () => checkboxControls()[0];
    const firstRowCheckbox = () => checkboxControls()[1];
    const allRowIds = rows.map((row) => row.id);

    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(columns.length + 1);
    const checkboxResizeHandle = wrapper.get(
      '[aria-label="Resize __hugo-ui-data-grid-checkbox-selection column"]'
    );
    expect(checkboxResizeHandle.attributes('aria-valuemin')).toBe(
      String(DEFAULT_CHECKBOX_COLUMN_MIN_WIDTH)
    );
    expect(checkboxResizeHandle.attributes('aria-valuenow')).toBe(
      String(DEFAULT_CHECKBOX_COLUMN_WIDTH)
    );
    expect(headerCheckbox().attributes('aria-checked')).toBe('mixed');

    await checkboxResizeHandle.trigger('keydown', { key: 'ArrowRight' });
    expect(onColumnWidthsChange).toHaveBeenCalledWith(
      expect.objectContaining({
        '__hugo-ui-data-grid-checkbox-selection':
          DEFAULT_CHECKBOX_COLUMN_WIDTH + KEYBOARD_RESIZE_STEP,
      })
    );

    await firstRowCheckbox().trigger('click');
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(['item-2', 'item-1']);
    expect(onSelectedRowIdChange).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();

    await firstRowCheckbox().trigger('keydown', { key: ' ' });
    expect(onSelectedRowIdChange).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();

    await wrapper.setProps({ selectedRowIds: ['item-2'] });
    await headerCheckbox().trigger('click');
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith([
      'item-2',
      ...allRowIds.filter((id) => id !== 'item-2'),
    ]);

    await wrapper.setProps({ selectedRowIds: [...allRowIds, 'outside-row'] });
    expect(headerCheckbox().attributes('aria-checked')).toBe('true');

    await headerCheckbox().trigger('click');
    expect(onSelectedRowIdsChange).toHaveBeenLastCalledWith(['outside-row']);
  });

  it('can hide the checkbox column header control while keeping row checkboxes', async () => {
    const onSelectedRowIdsChange = vi.fn();
    const onSelectedRowIdChange = vi.fn();
    const onRowClick = vi.fn();
    const wrapper = mountDataGrid({
      onRowClick,
      onSelectedRowIdChange,
      onSelectedRowIdsChange,
      showCheckboxColumn: true,
      showHeaderCheckbox: false,
    });

    const columnHeaders = wrapper.findAll('[role="columnheader"]');
    expect(columnHeaders).toHaveLength(columns.length + 1);
    expect(columnHeaders[0].find('[data-slot="checkbox-control"]').exists()).toBe(false);

    const checkboxControls = wrapper.findAll('[data-slot="checkbox-control"]');
    expect(checkboxControls[0].attributes('aria-label')).toBe('Select item-1');

    await checkboxControls[0].trigger('click');
    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(['item-1']);
    expect(onSelectedRowIdChange).not.toHaveBeenCalled();
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
