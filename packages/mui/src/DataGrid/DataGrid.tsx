import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Skeleton from '@mui/material/Skeleton';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ColumnDef, ColumnSizingState, OnChangeFn } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import classnames from 'classnames';
import { DataGridRoot, createDataGridTheme } from './styles/dataGridStyles';
import { DATA_GRID_ROOT_PREFIX } from './styles/dataGridTokens';

export type HugoUIDataGridColumn<T> = {
  id: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
};

export type HugoUIDataGridSort = {
  columnId: string;
  direction: 'asc' | 'desc';
} | null;

type HugoUIDataGridColumnAlign = HugoUIDataGridColumn<unknown>['align'];

type HugoUIDataGridColumnMeta = {
  align?: HugoUIDataGridColumnAlign;
  label?: string;
  sortable?: boolean;
};

type HugoUIDataGridVirtualRow = {
  key: React.Key;
  index: number;
  start: number;
  size: number;
};

export type HugoUIDataGridPagination = {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export type HugoUIDataGridColumnSizing = {
  widths?: ColumnSizingState;
  defaultWidths?: ColumnSizingState;
  resizeMode?: 'onChange' | 'onEnd';
  onWidthsChange?: (widths: ColumnSizingState) => void;
};

export type HugoUIDataGridProps<T> = {
  columns: HugoUIDataGridColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  ariaLabel: string;
  height?: React.CSSProperties['height'];
  rowHeight?: number;
  overscan?: number;
  columnSizing?: HugoUIDataGridColumnSizing;
  sort?: HugoUIDataGridSort;
  onSortChange?: (sort: HugoUIDataGridSort) => void;
  pagination?: HugoUIDataGridPagination;
  selectedRowId?: string;
  onSelectedRowIdChange?: (rowId: string, row: T) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  error?: React.ReactNode;
  empty?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const DEFAULT_EMPTY_STATE = 'No results found.';
const DEFAULT_GRID_HEIGHT = 420;
const DEFAULT_ROW_HEIGHT = 52;
const DEFAULT_COLUMN_WIDTH = 160;
const DEFAULT_COLUMN_MIN_WIDTH = 80;
const DEFAULT_COLUMN_MAX_WIDTH = 800;
const KEYBOARD_RESIZE_STEP = 16;

const resolveHeight = (height: React.CSSProperties['height'] | undefined) => {
  return typeof height === 'number' ? height : DEFAULT_GRID_HEIGHT;
};

const createInitialColumnSizing = <T,>(
  columns: HugoUIDataGridColumn<T>[],
  defaultWidths: ColumnSizingState = {}
) => {
  return columns.reduce<ColumnSizingState>((acc, column) => {
    acc[column.id] =
      defaultWidths[column.id] ?? column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH;
    return acc;
  }, {});
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getNextSort = (columnId: string, sort?: HugoUIDataGridSort): HugoUIDataGridSort => {
  if (sort?.columnId === columnId && sort.direction === 'asc') {
    return { columnId, direction: 'desc' };
  }

  return { columnId, direction: 'asc' };
};

const resolveNextSizing = (
  updater: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState),
  previous: ColumnSizingState
) => {
  return typeof updater === 'function' ? updater(previous) : updater;
};

const isSameColumnSizing = (a: ColumnSizingState, b: ColumnSizingState) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return aKeys.length === bKeys.length && aKeys.every((key) => a[key] === b[key]);
};

const getAlignmentClassName = (align: HugoUIDataGridColumnAlign) => {
  if (align === 'center') {
    return `${DATA_GRID_ROOT_PREFIX}-alignCenter`;
  }

  if (align === 'right') {
    return `${DATA_GRID_ROOT_PREFIX}-alignRight`;
  }

  return undefined;
};

const getStretchGridTemplateColumns = (columnSizes: number[]) => {
  if (columnSizes.length === 0) {
    return '';
  }

  return columnSizes
    .map((size, index) =>
      index === columnSizes.length - 1 ? `minmax(${size}px, 1fr)` : `${size}px`
    )
    .join(' ');
};

export function HugoUIDataGrid<T>({
  columns,
  rows,
  getRowId,
  ariaLabel,
  height = DEFAULT_GRID_HEIGHT,
  rowHeight = DEFAULT_ROW_HEIGHT,
  overscan = 8,
  columnSizing,
  sort = null,
  onSortChange,
  pagination,
  selectedRowId,
  onSelectedRowIdChange,
  onRowClick,
  loading = false,
  error,
  empty,
  className,
  style,
}: HugoUIDataGridProps<T>) {
  const parentTheme = useTheme();
  const dataGridTheme = React.useMemo(() => createDataGridTheme(parentTheme), [parentTheme]);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const initialColumnSizing = React.useMemo(
    () => createInitialColumnSizing(columns, columnSizing?.defaultWidths),
    [columns, columnSizing?.defaultWidths]
  );
  const [internalColumnSizing, setInternalColumnSizing] =
    React.useState<ColumnSizingState>(initialColumnSizing);
  const columnSizingState = columnSizing?.widths ?? internalColumnSizing;
  const isRowInteractive = Boolean(onSelectedRowIdChange || onRowClick);
  const viewportHeight = resolveHeight(height);
  const skeletonRows = Math.min(pagination?.pageSize ?? 8, 10);

  React.useEffect(() => {
    setInternalColumnSizing((current) => {
      const nextSizing = { ...initialColumnSizing, ...current };

      return isSameColumnSizing(current, nextSizing) ? current : nextSizing;
    });
  }, [initialColumnSizing]);

  const handleColumnSizingChange = React.useCallback<OnChangeFn<ColumnSizingState>>(
    (updater) => {
      const nextSizing = resolveNextSizing(updater, columnSizingState);

      if (!columnSizing?.widths) {
        setInternalColumnSizing(nextSizing);
      }

      columnSizing?.onWidthsChange?.(nextSizing);
    },
    [columnSizing, columnSizingState]
  );

  const tableColumns = React.useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((column) => ({
        id: column.id,
        header: () => column.header,
        cell: (info) => column.render(info.row.original),
        size:
          columnSizingState[column.id] ?? column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH,
        minSize: column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
        maxSize: column.maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH,
        enableResizing: column.resizable ?? true,
        enableSorting: column.sortable ?? false,
        meta: {
          align: column.align,
          label: typeof column.header === 'string' ? column.header : column.id,
          sortable: column.sortable ?? false,
        },
      })),
    [columns, columnSizingState]
  );

  // TanStack Table returns instance methods; the instance stays local to DataGrid.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    columnResizeMode: columnSizing?.resizeMode ?? 'onEnd',
    state: {
      columnSizing: columnSizingState,
    },
    onColumnSizingChange: handleColumnSizingChange,
  });

  const visibleColumns = table.getVisibleLeafColumns();
  const gridTemplateColumns = React.useMemo(
    () => getStretchGridTemplateColumns(visibleColumns.map((column) => column.getSize())),
    [columnSizingState, visibleColumns]
  );
  const totalWidth = table.getTotalSize();
  const tableWidthStyle = React.useMemo(
    () => ({ minWidth: totalWidth, width: '100%' }),
    [totalWidth]
  );
  const columnSizingInfo = table.getState().columnSizingInfo;
  const resizingColumnId = columnSizingInfo.isResizingColumn;
  const isColumnResizing = Boolean(resizingColumnId);
  const resizeIndicatorOffset = columnSizingInfo.deltaOffset ?? 0;
  const resizeIndicatorLeft = React.useMemo(() => {
    if (!resizingColumnId) {
      return undefined;
    }

    let left = 0;

    for (const column of visibleColumns) {
      left += column.getSize();

      if (column.id === resizingColumnId) {
        return left + resizeIndicatorOffset;
      }
    }

    return undefined;
  }, [resizeIndicatorOffset, resizingColumnId, visibleColumns]);
  const tableRows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => rowHeight,
    overscan,
    initialRect: {
      width: 0,
      height: viewportHeight,
    },
  });
  const measuredVirtualRows = rowVirtualizer.getVirtualItems();
  const fallbackVirtualRows = React.useMemo<HugoUIDataGridVirtualRow[]>(() => {
    const visibleRowCount = Math.min(
      tableRows.length,
      Math.ceil(viewportHeight / rowHeight) + overscan * 2
    );

    return Array.from({ length: visibleRowCount }, (_, index) => ({
      key: tableRows[index]?.id ?? index,
      index,
      start: index * rowHeight,
      size: rowHeight,
    }));
  }, [overscan, rowHeight, tableRows, viewportHeight]);
  const virtualRows: HugoUIDataGridVirtualRow[] =
    measuredVirtualRows.length > 0 ? measuredVirtualRows : fallbackVirtualRows;

  React.useEffect(() => {
    if (!isColumnResizing) {
      return undefined;
    }

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
    };
  }, [isColumnResizing]);

  const activateRow = (row: T) => {
    const rowId = getRowId(row);
    onSelectedRowIdChange?.(rowId, row);
    onRowClick?.(row);
  };

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, row: T) => {
    if (!isRowInteractive || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    activateRow(row);
  };

  const resizeColumnBy = (columnId: string, offset: number) => {
    const column = table.getColumn(columnId);

    if (!column) {
      return;
    }

    const nextSize = clamp(
      column.getSize() + offset,
      column.columnDef.minSize ?? DEFAULT_COLUMN_MIN_WIDTH,
      column.columnDef.maxSize ?? DEFAULT_COLUMN_MAX_WIDTH
    );

    handleColumnSizingChange((currentSizing) => ({
      ...currentSizing,
      [columnId]: nextSize,
    }));
  };

  const renderHeader = () => (
    <div
      className={`${DATA_GRID_ROOT_PREFIX}-header`}
      role="rowgroup"
      style={tableWidthStyle}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <div
          key={headerGroup.id}
          className={`${DATA_GRID_ROOT_PREFIX}-row`}
          role="row"
          style={{ ...tableWidthStyle, gridTemplateColumns }}
        >
          {headerGroup.headers.map((header) => {
            const columnMeta = header.column.columnDef.meta as HugoUIDataGridColumnMeta | undefined;
            const align = columnMeta?.align;
            const canResize = header.column.getCanResize();
            const isResizing = header.column.getIsResizing();
            const canSort = columnMeta?.sortable ?? false;
            const isSorted = sort?.columnId === header.column.id;
            const headerContent = header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext());

            return (
              <div
                key={header.id}
                aria-label={columnMeta?.label}
                className={classnames(
                  `${DATA_GRID_ROOT_PREFIX}-headerCell`,
                  getAlignmentClassName(align)
                )}
                role="columnheader"
                aria-colindex={header.index + 1}
                aria-sort={
                  isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                }
              >
                <span className={`${DATA_GRID_ROOT_PREFIX}-headerCellContent`}>
                  {canSort ? (
                    <TableSortLabel
                      active={isSorted}
                      direction={isSorted ? sort.direction : 'asc'}
                      disabled={!onSortChange}
                      onClick={() => onSortChange?.(getNextSort(header.column.id, sort))}
                    >
                      {headerContent}
                    </TableSortLabel>
                  ) : (
                    headerContent
                  )}
                </span>
                {canResize && (
                  <span
                    aria-label={`Resize ${header.column.id} column`}
                    aria-orientation="vertical"
                    aria-valuemax={header.column.columnDef.maxSize}
                    aria-valuemin={header.column.columnDef.minSize}
                    aria-valuenow={header.column.getSize()}
                    className={classnames(`${DATA_GRID_ROOT_PREFIX}-resizeHandle`, {
                      [`${DATA_GRID_ROOT_PREFIX}-resizeHandleActive`]: isResizing,
                    })}
                    role="separator"
                    tabIndex={0}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      header.getResizeHandler()(event);
                    }}
                    onTouchStart={(event) => {
                      event.preventDefault();
                      header.getResizeHandler()(event);
                    }}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                        return;
                      }

                      event.preventDefault();
                      resizeColumnBy(
                        header.column.id,
                        event.key === 'ArrowRight' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP
                      );
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderLoadingRows = () => (
    <div
      className={`${DATA_GRID_ROOT_PREFIX}-loadingRows`}
      role="rowgroup"
      style={tableWidthStyle}
    >
      {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
        <div
          key={`loading-${rowIndex}`}
          className={`${DATA_GRID_ROOT_PREFIX}-loadingRow`}
          role="row"
          style={{ ...tableWidthStyle, gridTemplateColumns, height: rowHeight }}
        >
          {visibleColumns.map((column) => (
            <div
              key={column.id}
              className={classnames(
                `${DATA_GRID_ROOT_PREFIX}-cell`,
                getAlignmentClassName((column.columnDef.meta as HugoUIDataGridColumnMeta)?.align)
              )}
              role="gridcell"
            >
              <Skeleton variant="text" aria-label="Loading row" width="100%" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderState = (content: React.ReactNode) => (
    <div
      className={`${DATA_GRID_ROOT_PREFIX}-stateContent`}
      role="row"
      style={tableWidthStyle}
    >
      <div role="gridcell" aria-colspan={Math.max(visibleColumns.length, 1)}>
        {content}
      </div>
    </div>
  );

  const renderBody = () => {
    if (loading) {
      return renderLoadingRows();
    }

    if (error) {
      return renderState(error);
    }

    if (rows.length === 0) {
      return renderState(empty ?? DEFAULT_EMPTY_STATE);
    }

    return (
      <div
        className={`${DATA_GRID_ROOT_PREFIX}-body`}
        role="rowgroup"
        style={{ ...tableWidthStyle, height: rowVirtualizer.getTotalSize() }}
      >
        {virtualRows.map((virtualRow) => {
          const row = tableRows[virtualRow.index];

          if (!row) {
            return null;
          }

          const rowId = getRowId(row.original);
          const isSelected = selectedRowId === rowId;

          return (
            <div
              key={row.id}
              aria-rowindex={virtualRow.index + 2}
              aria-selected={isSelected || undefined}
              className={classnames(
                `${DATA_GRID_ROOT_PREFIX}-row`,
                `${DATA_GRID_ROOT_PREFIX}-bodyRow`,
                {
                  [`${DATA_GRID_ROOT_PREFIX}-rowInteractive`]: isRowInteractive,
                  [`${DATA_GRID_ROOT_PREFIX}-rowSelected`]: isSelected,
                }
              )}
              role="row"
              tabIndex={isRowInteractive ? 0 : undefined}
              style={{
                gridTemplateColumns,
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
                ...tableWidthStyle,
              }}
              onClick={isRowInteractive ? () => activateRow(row.original) : undefined}
              onKeyDown={(event) => handleRowKeyDown(event, row.original)}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <div
                  key={cell.id}
                  className={classnames(
                    `${DATA_GRID_ROOT_PREFIX}-cell`,
                    getAlignmentClassName(
                      (cell.column.columnDef.meta as HugoUIDataGridColumnMeta | undefined)?.align
                    )
                  )}
                  role="gridcell"
                  aria-colindex={cellIndex + 1}
                >
                  <span className={`${DATA_GRID_ROOT_PREFIX}-cellContent`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ThemeProvider theme={dataGridTheme}>
      <DataGridRoot
        className={classnames(`${DATA_GRID_ROOT_PREFIX}-root`, className, {
          [`${DATA_GRID_ROOT_PREFIX}-columnResizing`]: isColumnResizing,
        })}
        style={style}
      >
        <div className={`${DATA_GRID_ROOT_PREFIX}-container`}>
          <div
            ref={viewportRef}
            aria-colcount={visibleColumns.length}
            aria-label={ariaLabel}
            aria-rowcount={rows.length + 1}
            className={`${DATA_GRID_ROOT_PREFIX}-viewport`}
            role="grid"
            style={{ height }}
          >
            <div className={`${DATA_GRID_ROOT_PREFIX}-table`} style={tableWidthStyle}>
              {renderHeader()}
              {renderBody()}
              {typeof resizeIndicatorLeft === 'number' && (
                <div
                  aria-hidden="true"
                  className={`${DATA_GRID_ROOT_PREFIX}-resizeIndicator`}
                  style={{ left: resizeIndicatorLeft }}
                />
              )}
            </div>
          </div>
          {pagination && (
            <TablePagination
              className={`${DATA_GRID_ROOT_PREFIX}-pagination`}
              component="div"
              count={pagination.total}
              page={pagination.page}
              rowsPerPage={pagination.pageSize}
              rowsPerPageOptions={pagination.pageSizeOptions ?? [10, 25, 50]}
              slotProps={{
                select: {
                  SelectDisplayProps: {
                    'aria-label': 'Rows per page',
                    tabIndex: 0,
                  },
                },
              }}
              onPageChange={(_, page) => pagination.onPageChange(page)}
              onRowsPerPageChange={(event) =>
                pagination.onPageSizeChange?.(Number(event.target.value))
              }
            />
          )}
        </div>
      </DataGridRoot>
    </ThemeProvider>
  );
}
