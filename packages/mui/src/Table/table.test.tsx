import React from 'react';
import userEvent from '@testing-library/user-event';
import { HugoUITable, HugoUITableColumn, HugoUITableSort } from './Table';
import { render, screen } from '../utils/testUtils';

type ExampleRow = {
  id: string;
  label: string;
  state: string;
  count: number;
};

const rows: ExampleRow[] = [
  { id: 'item-1', label: 'Alpha pattern', state: 'Ready', count: 48 },
  { id: 'item-2', label: 'Beta module', state: 'Hidden', count: 12 },
];

const columns: HugoUITableColumn<ExampleRow>[] = [
  {
    id: 'label',
    header: 'Item',
    sortable: true,
    render: (row) => row.label,
  },
  {
    id: 'state',
    header: 'State',
    render: (row) => row.state,
  },
  {
    id: 'count',
    header: 'Count',
    align: 'right',
    render: (row) => row.count,
  },
];

const renderTable = (props: Partial<React.ComponentProps<typeof HugoUITable<ExampleRow>>> = {}) =>
  render(
    <HugoUITable
      ariaLabel="Items"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      {...props}
    />
  );

describe('HugoUITable', () => {
  it('renders headers and row cells', () => {
    renderTable();

    expect(screen.getByRole('table', { name: 'Items' })).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Alpha pattern')).toBeInTheDocument();
    expect(screen.getByText('Beta module')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
  });

  it('renders design-system structure classes', () => {
    const { container } = renderTable({
      selectedRowId: 'item-1',
      onSelectedRowIdChange: jest.fn(),
    });

    expect(container.querySelector('.HugoUITable-root')).not.toBeNull();
    expect(container.querySelector('.HugoUITable-container')).not.toBeNull();
    expect(container.querySelector('.HugoUITable-headCell')).not.toBeNull();
    expect(container.querySelector('.HugoUITable-cell')).not.toBeNull();
    expect(container.querySelector('.HugoUITable-rowSelected')).not.toBeNull();
  });

  it('calls onSortChange with ascending sort for a sortable column', async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();
    renderTable({ onSortChange });

    await user.click(screen.getByRole('button', { name: /item/i }));

    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'label', direction: 'asc' });
  });

  it('toggles sorted column from ascending to descending', async () => {
    const user = userEvent.setup();
    const sort: HugoUITableSort = { columnId: 'label', direction: 'asc' };
    const onSortChange = jest.fn();
    renderTable({ sort, onSortChange });

    await user.click(screen.getByRole('button', { name: /item/i }));

    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'label', direction: 'desc' });
  });

  it('renders pagination and calls pagination handlers', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    renderTable({
      pagination: {
        page: 0,
        pageSize: 10,
        total: 40,
        pageSizeOptions: [10, 25],
        onPageChange,
        onPageSizeChange,
      },
    });

    expect(document.querySelector('.HugoUITable-pagination')).not.toBeNull();
    expect(screen.getByRole('combobox', { name: /rows per page/i })).toHaveAttribute(
      'tabindex',
      '0'
    );

    await user.click(screen.getByLabelText(/go to next page/i));
    expect(onPageChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '25' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('renders loading skeletons instead of data rows', () => {
    const { container } = renderTable({ loading: true });

    expect(screen.queryByText('Alpha pattern')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Loading row').length).toBeGreaterThan(0);
    expect(container.querySelector('.HugoUITable-loadingRow')).not.toBeNull();
  });

  it('renders empty state when there are no rows', () => {
    renderTable({ rows: [] });

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders custom empty state', () => {
    renderTable({ rows: [], empty: 'No items match your criteria.' });

    expect(screen.getByText('No items match your criteria.')).toBeInTheDocument();
  });

  it('renders error state before empty state', () => {
    renderTable({ rows: [], error: 'Unable to load items.' });

    expect(screen.getByText('Unable to load items.')).toBeInTheDocument();
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
  });

  it('calls selection and row click handlers when a row is clicked', async () => {
    const user = userEvent.setup();
    const onSelectedRowIdChange = jest.fn();
    const onRowClick = jest.fn();
    renderTable({ onSelectedRowIdChange, onRowClick });

    await user.click(screen.getByText('Alpha pattern'));

    expect(onSelectedRowIdChange).toHaveBeenCalledWith('item-1', rows[0]);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('marks the controlled selected row', () => {
    renderTable({ selectedRowId: 'item-2', onSelectedRowIdChange: jest.fn() });

    const selectedRow = screen.getByText('Beta module').closest('tr');
    expect(selectedRow).toHaveAttribute('aria-selected', 'true');
    expect(selectedRow).toHaveClass('HugoUITable-rowSelected');
  });

  it('activates interactive rows with Enter and Space', async () => {
    const user = userEvent.setup();
    const onRowClick = jest.fn();
    renderTable({ onRowClick });

    const row = screen.getByText('Alpha pattern').closest('tr');
    expect(row).not.toBeNull();

    row?.focus();
    await user.keyboard('[Enter]');
    await user.keyboard('[Space]');

    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(onRowClick).toHaveBeenNthCalledWith(1, rows[0]);
    expect(onRowClick).toHaveBeenNthCalledWith(2, rows[0]);
  });
});
