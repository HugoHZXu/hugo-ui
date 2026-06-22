import React from 'react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HugoUIDataGrid, HugoUIDataGridColumn, HugoUIDataGridSort } from './DataGrid';
import { render, screen } from '../utils/testUtils';

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

const columns: HugoUIDataGridColumn<ExampleRow>[] = [
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

const renderDataGrid = (
  props: Partial<React.ComponentProps<typeof HugoUIDataGrid<ExampleRow>>> = {}
) =>
  render(
    <HugoUIDataGrid
      ariaLabel="Items"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      {...props}
    />
  );

describe('HugoUIDataGrid', () => {
  it('renders headers and visible row cells', () => {
    renderDataGrid();

    expect(screen.getByRole('grid', { name: 'Items' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Item' })).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
  });

  it('virtualizes long row sets instead of rendering every row', () => {
    renderDataGrid({
      rows: createRows(200),
      height: 156,
      rowHeight: 52,
      overscan: 1,
    });

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 200')).not.toBeInTheDocument();
  });

  it('supports keyboard column resizing', async () => {
    const user = userEvent.setup();
    const onWidthsChange = jest.fn();
    renderDataGrid({
      columnSizing: {
        onWidthsChange,
      },
    });

    const resizeHandle = screen.getByRole('separator', { name: /resize label column/i });
    resizeHandle.focus();
    await user.keyboard('[ArrowRight]');

    expect(onWidthsChange).toHaveBeenCalledWith(expect.objectContaining({ label: 236 }));
  });

  it('calls onSortChange with ascending sort for a sortable column', async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();
    renderDataGrid({ onSortChange });

    await user.click(screen.getByRole('button', { name: /item/i }));

    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'label', direction: 'asc' });
  });

  it('toggles sorted column from ascending to descending', async () => {
    const user = userEvent.setup();
    const sort: HugoUIDataGridSort = { columnId: 'label', direction: 'asc' };
    const onSortChange = jest.fn();
    renderDataGrid({ sort, onSortChange });

    expect(screen.getByRole('columnheader', { name: 'Item' })).toHaveAttribute(
      'aria-sort',
      'ascending'
    );

    await user.click(screen.getByRole('button', { name: /item/i }));

    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'label', direction: 'desc' });
  });

  it('stretches rows to fill the viewport when columns are narrower than the grid', () => {
    renderDataGrid();

    const grid = screen.getByRole('grid', { name: 'Items' });
    const table = grid.firstElementChild as HTMLElement;
    const row = screen.getByRole('row', { name: /item 1 ready 1/i });

    expect(table).toHaveStyle({ width: '100%' });
    expect(table).toHaveStyle({ minWidth: '480px' });
    expect(row).toHaveStyle({ width: '100%' });
    expect(row).toHaveStyle({ gridTemplateColumns: '220px 140px minmax(120px, 1fr)' });
  });

  it('prevents text selection when starting column resize with a pointer', () => {
    renderDataGrid();

    const resizeHandle = screen.getByRole('separator', { name: /resize label column/i });
    const pointerStart = new MouseEvent('mousedown', { bubbles: true, cancelable: true });

    fireEvent(resizeHandle, pointerStart);

    expect(pointerStart.defaultPrevented).toBe(true);
  });

  it('renders pagination and calls pagination handlers', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    renderDataGrid({
      rows: rows.slice(0, 5),
      pagination: {
        page: 0,
        pageSize: 5,
        total: rows.length,
        pageSizeOptions: [5, 10],
        onPageChange,
        onPageSizeChange,
      },
    });

    await user.click(screen.getByLabelText(/go to next page/i));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '10' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it('renders loading, empty, and error states', () => {
    const { rerender } = renderDataGrid({ loading: true, rows: [] });

    expect(screen.getAllByLabelText('Loading row').length).toBeGreaterThan(0);

    rerender(
      <HugoUIDataGrid
        ariaLabel="Items"
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        empty="No items match the current view."
      />
    );
    expect(screen.getByText('No items match the current view.')).toBeInTheDocument();

    rerender(
      <HugoUIDataGrid
        ariaLabel="Items"
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        error="Unable to load items."
      />
    );
    expect(screen.getByText('Unable to load items.')).toBeInTheDocument();
  });
});
