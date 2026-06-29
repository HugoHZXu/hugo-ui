import type { ColumnSizingState } from '@tanstack/vue-table';
import type { Component, HTMLAttributes, VNode } from 'vue';

export type DataGridColumn<T> = {
  id: string;
  header: string | VNode | (() => VNode | string);
  render: (row: T) => string | number | VNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  resizable?: boolean;
};

export type DataGridSort = {
  columnId: string;
  direction: 'asc' | 'desc';
} | null;

export type DataGridPagination = {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
};

export type DataGridColumnSizing = {
  widths?: ColumnSizingState;
  defaultWidths?: ColumnSizingState;
  resizeMode?: 'onChange' | 'onEnd';
};

export type DataGridProps<T> = {
  ariaLabel: string;
  as?: string | Component;
  class?: HTMLAttributes['class'];
  columns: DataGridColumn<T>[];
  columnSizing?: DataGridColumnSizing;
  empty?: string | VNode;
  endReachedThreshold?: number;
  error?: string | VNode;
  fill?: boolean;
  getRowId: (row: T) => string;
  hasMore?: boolean;
  height?: number | string;
  loading?: boolean;
  loadingMore?: boolean;
  overscan?: number;
  pagination?: DataGridPagination;
  rowHeight?: number;
  rows: T[];
  selectedRowId?: string;
  selectedRowIds?: string[];
  showCheckboxColumn?: boolean;
  showHeaderCheckbox?: boolean;
  sort?: DataGridSort;
  virtualized?: boolean;
};

export type DataGridEmits<T> = {
  (event: 'rowClick', row: T): void;
  (event: 'selectedRowIdChange', rowId: string, row: T): void;
  (event: 'selectedRowIdsChange', rowIds: string[]): void;
  (event: 'endReached'): void;
  (event: 'sortChange', sort: DataGridSort): void;
  (event: 'pageChange', page: number): void;
  (event: 'pageSizeChange', pageSize: number): void;
  (event: 'columnWidthsChange', widths: ColumnSizingState): void;
};

export const DEFAULT_EMPTY_STATE = 'No results found.';
export const DEFAULT_END_REACHED_THRESHOLD = 96;
export const DEFAULT_GRID_HEIGHT = 420;
export const DEFAULT_ROW_HEIGHT = 52;
export const DEFAULT_COLUMN_WIDTH = 160;
export const DEFAULT_COLUMN_MIN_WIDTH = 80;
export const DEFAULT_COLUMN_MAX_WIDTH = 800;
export const DEFAULT_CHECKBOX_COLUMN_WIDTH = 80;
export const DEFAULT_CHECKBOX_COLUMN_MIN_WIDTH = 72;
export const DEFAULT_CHECKBOX_COLUMN_MAX_WIDTH = 160;
export const KEYBOARD_RESIZE_STEP = 16;
