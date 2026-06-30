<script setup lang="ts" generic="T">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnSizingState,
  type OnChangeFn,
} from '@tanstack/vue-table';
import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue';

import { cn } from '@/components/lib/utils';
import Checkbox from '@/components/ui/checkbox/Checkbox.vue';
import type { CheckboxModelValue } from '@/components/ui/checkbox/checkbox';
import {
  DEFAULT_CHECKBOX_COLUMN_MAX_WIDTH,
  DEFAULT_CHECKBOX_COLUMN_MIN_WIDTH,
  DEFAULT_CHECKBOX_COLUMN_WIDTH,
  DEFAULT_COLUMN_MAX_WIDTH,
  DEFAULT_COLUMN_MIN_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_EMPTY_STATE,
  DEFAULT_END_REACHED_THRESHOLD,
  DEFAULT_GRID_HEIGHT,
  DEFAULT_ROW_HEIGHT,
  KEYBOARD_RESIZE_STEP,
  type DataGridColumn,
  type DataGridEmits,
  type DataGridProps,
  type DataGridSort,
} from './dataGrid';

type DataGridColumnMeta = {
  align?: 'left' | 'center' | 'right';
  grow?: boolean;
  label?: string;
  selectable?: boolean;
  sortable?: boolean;
};

type DataGridColumnLayout = {
  grow?: boolean;
  size: number;
};

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  as: 'div',
  empty: DEFAULT_EMPTY_STATE,
  endReachedThreshold: DEFAULT_END_REACHED_THRESHOLD,
  fill: false,
  height: DEFAULT_GRID_HEIGHT,
  hasMore: true,
  loading: false,
  loadingMore: false,
  overscan: 8,
  rowHeight: DEFAULT_ROW_HEIGHT,
  selectedRowId: undefined,
  selectedRowIds: undefined,
  showCheckboxColumn: false,
  showHeaderCheckbox: true,
  sort: null,
  virtualized: false,
});

const emit = defineEmits<DataGridEmits<T>>();
const attrs = useAttrs();
const instance = getCurrentInstance();

const viewportRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const viewportHeight = ref(resolveNumericHeight(props.height));
const internalColumnSizing = ref<ColumnSizingState>(
  createInitialColumnSizing(props.columns, props.columnSizing?.defaultWidths)
);
const isColumnResizing = ref(false);
const resizingColumnId = ref<string | null>(null);
const resizeStartX = ref(0);
const resizeStartWidth = ref(0);
const internalSelectedRowIds = ref<string[]>(normalizeUniqueRowIds(props.selectedRowIds ?? []));
const endReachedScrollHeight = ref<number | null>(null);

const columnSizingState = computed(() => props.columnSizing?.widths ?? internalColumnSizing.value);

const rootClassName = computed(() =>
  cn(
    'w-full text-hugo-text-default',
    props.fill && 'h-full min-h-0',
    isColumnResizing.value && 'select-none',
    props.class,
    attrs.class
  )
);

const frameClassName = computed(() =>
  cn(
    'overflow-hidden rounded-lg border border-hugo-neutral-500 bg-hugo-surface-default',
    props.fill && 'flex h-full min-h-0 flex-col'
  )
);

const viewportClassName = computed(() =>
  cn('relative overflow-auto bg-hugo-surface-default', props.fill && 'min-h-0 flex-auto')
);

const viewportStyle = computed(() =>
  props.fill
    ? undefined
    : {
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      }
);

const tableColumns = computed<ColumnDef<T>[]>(() => {
  const columns = props.columns.map((column) => ({
    id: column.id,
    header: () => column.header,
    cell: (info) => column.render(info.row.original),
    size:
      columnSizingState.value[column.id] ?? column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH,
    minSize: column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
    maxSize: column.maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH,
    enableResizing: column.resizable ?? true,
    enableSorting: column.sortable ?? false,
    meta: {
      align: column.align,
      grow: column.grow ?? false,
      label: typeof column.header === 'string' ? column.header : column.id,
      sortable: column.sortable ?? false,
    },
  })) satisfies ColumnDef<T>[];

  return props.showCheckboxColumn ? [createCheckboxColumn(), ...columns] : columns;
});

const table = useVueTable({
  get data() {
    return props.rows;
  },
  get columns() {
    return tableColumns.value;
  },
  getCoreRowModel: getCoreRowModel(),
  getRowId: props.getRowId,
  get columnResizeMode() {
    return props.columnSizing?.resizeMode ?? 'onEnd';
  },
  state: {
    get columnSizing() {
      return columnSizingState.value;
    },
  },
  onColumnSizingChange: handleColumnSizingChange,
});

const visibleColumns = computed(() => table.getVisibleLeafColumns());
const tableRows = computed(() => table.getRowModel().rows);
const currentRowIds = computed(() => tableRows.value.map((row) => row.id));
const checkboxSelectedRowIds = computed(() =>
  props.selectedRowIds !== undefined ? props.selectedRowIds : internalSelectedRowIds.value
);
const checkboxSelectedRowIdSet = computed(() => new Set(checkboxSelectedRowIds.value));
const headerCheckboxValue = computed<CheckboxModelValue>(() => {
  if (currentRowIds.value.length === 0) {
    return false;
  }

  const selectedCount = currentRowIds.value.filter((rowId) =>
    checkboxSelectedRowIdSet.value.has(rowId)
  ).length;

  if (selectedCount === 0) {
    return false;
  }

  return selectedCount === currentRowIds.value.length ? true : 'indeterminate';
});
const tableWidth = computed(() => table.getTotalSize());
const tableWidthStyle = computed(() => ({
  minWidth: `${tableWidth.value}px`,
  width: '100%',
}));
const gridTemplateColumns = computed(() =>
  getStretchGridTemplateColumns(
    visibleColumns.value.map((column) => ({
      grow: getColumnMeta(column)?.grow ?? false,
      size: column.getSize(),
    }))
  )
);
const totalBodyHeight = computed(() => tableRows.value.length * props.rowHeight);
const visibleRange = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan);
  const visibleCount = Math.ceil(viewportHeight.value / props.rowHeight) + props.overscan * 2;
  const end = Math.min(tableRows.value.length, start + visibleCount);

  return { start, end };
});
const bodyRows = computed(() => {
  const start = props.virtualized ? visibleRange.value.start : 0;
  const rows = props.virtualized
    ? tableRows.value.slice(visibleRange.value.start, visibleRange.value.end)
    : tableRows.value;

  return rows.map((row, offset) => {
    const index = start + offset;

    return {
      index,
      key: row.id,
      row,
      start: index * props.rowHeight,
      size: props.rowHeight,
    };
  });
});
const bodyRowGroupStyle = computed(() =>
  props.virtualized
    ? { ...tableWidthStyle.value, height: `${totalBodyHeight.value}px` }
    : tableWidthStyle.value
);
const skeletonRows = computed(() => Math.min(props.pagination?.pageSize ?? 8, 10));
const shouldRenderLoadingMore = computed(
  () => props.loadingMore && !props.loading && !props.error && props.rows.length > 0
);
const ariaRowCount = computed(
  () => props.rows.length + 1 + (shouldRenderLoadingMore.value ? 1 : 0)
);
const hasEndReachedListener = computed(() => Boolean(instance?.vnode.props?.onEndReached));
const hasSortChangeListener = computed(() => Boolean(instance?.vnode.props?.onSortChange));
const isRowInteractive = computed(() =>
  Boolean(instance?.vnode.props?.onRowClick || instance?.vnode.props?.onSelectedRowIdChange)
);
const pageSizeOptions = computed(() => props.pagination?.pageSizeOptions ?? [10, 25, 50]);
const firstVisibleItem = computed(() => {
  if (!props.pagination || props.pagination.total === 0) {
    return 0;
  }

  return props.pagination.page * props.pagination.pageSize + 1;
});
const lastVisibleItem = computed(() => {
  if (!props.pagination) {
    return 0;
  }

  return Math.min((props.pagination.page + 1) * props.pagination.pageSize, props.pagination.total);
});
const canGoPrevious = computed(() => Boolean(props.pagination && props.pagination.page > 0));
const canGoNext = computed(() =>
  Boolean(
    props.pagination &&
    (props.pagination.page + 1) * props.pagination.pageSize < props.pagination.total
  )
);

watch(
  () => [props.columns, props.columnSizing?.defaultWidths] as const,
  () => {
    const nextSizing = {
      ...createInitialColumnSizing(props.columns, props.columnSizing?.defaultWidths),
      ...internalColumnSizing.value,
    };

    if (!isSameColumnSizing(internalColumnSizing.value, nextSizing)) {
      internalColumnSizing.value = nextSizing;
    }
  },
  { deep: true }
);

watch(
  () => props.selectedRowIds,
  (selectedRowIds) => {
    if (selectedRowIds !== undefined) {
      internalSelectedRowIds.value = normalizeUniqueRowIds(selectedRowIds);
    }
  }
);

watch(
  () => props.rows.length,
  () => {
    endReachedScrollHeight.value = null;
  }
);

watch(
  () => [props.height, props.fill] as const,
  async () => {
    await nextTick();
    measureViewport();
  }
);

onMounted(() => {
  measureViewport();
  window.addEventListener('resize', measureViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureViewport);
  stopPointerResize();
});

function resolveNumericHeight(height: number | string | undefined) {
  return typeof height === 'number' ? height : DEFAULT_GRID_HEIGHT;
}

function createInitialColumnSizing<TItem>(
  columns: DataGridColumn<TItem>[],
  defaultWidths: ColumnSizingState = {}
) {
  return columns.reduce<ColumnSizingState>((acc, column) => {
    acc[column.id] =
      defaultWidths[column.id] ?? column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH;
    return acc;
  }, {});
}

function isSameColumnSizing(a: ColumnSizingState, b: ColumnSizingState) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return aKeys.length === bKeys.length && aKeys.every((key) => a[key] === b[key]);
}

function resolveNextSizing(
  updater: ColumnSizingState | ((old: ColumnSizingState) => ColumnSizingState),
  previous: ColumnSizingState
) {
  return typeof updater === 'function' ? updater(previous) : updater;
}

function handleColumnSizingChange(updater: Parameters<OnChangeFn<ColumnSizingState>>[0]) {
  const nextSizing = resolveNextSizing(updater, columnSizingState.value);

  if (!props.columnSizing?.widths) {
    internalColumnSizing.value = nextSizing;
  }

  emit('columnWidthsChange', nextSizing);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getNextSort(columnId: string, sort?: DataGridSort): DataGridSort {
  if (sort?.columnId === columnId && sort.direction === 'asc') {
    return { columnId, direction: 'desc' };
  }

  return { columnId, direction: 'asc' };
}

function getStretchGridTemplateColumns(columns: DataGridColumnLayout[]) {
  if (columns.length === 0) {
    return '';
  }

  const hasGrowColumn = columns.some((column) => column.grow);

  return columns
    .map((column, index) => {
      const shouldGrow = hasGrowColumn ? column.grow : index === columns.length - 1;

      return shouldGrow ? `minmax(${column.size}px, 1fr)` : `${column.size}px`;
    })
    .join(' ');
}

function getColumnMeta(column: { columnDef: { meta?: unknown } }) {
  return column.columnDef.meta as DataGridColumnMeta | undefined;
}

function createCheckboxColumn(): ColumnDef<T> {
  return {
    id: '__hugo-ui-data-grid-checkbox-selection',
    header: () =>
      props.showHeaderCheckbox
        ? h(Checkbox, {
            'aria-label':
              headerCheckboxValue.value === true ? 'Clear row selection' : 'Select all rows',
            classNames: {
              root: 'justify-center',
            },
            disabled: currentRowIds.value.length === 0,
            modelValue: headerCheckboxValue.value,
            onClick: stopGridActivation,
            onKeydown: stopGridActivation,
            'onUpdate:modelValue': toggleAllRows,
          })
        : null,
    cell: (info) => {
      const rowId = info.row.id;

      return h(Checkbox, {
        'aria-label': `Select ${rowId}`,
        classNames: {
          root: 'justify-center',
        },
        modelValue: checkboxSelectedRowIdSet.value.has(rowId),
        onClick: stopGridActivation,
        onKeydown: stopGridActivation,
        'onUpdate:modelValue': () => toggleRowSelection(info.row.original),
      });
    },
    enableResizing: true,
    enableSorting: false,
    minSize: DEFAULT_CHECKBOX_COLUMN_MIN_WIDTH,
    maxSize: DEFAULT_CHECKBOX_COLUMN_MAX_WIDTH,
    size: DEFAULT_CHECKBOX_COLUMN_WIDTH,
    meta: {
      align: 'center',
      label: 'Row selection',
      selectable: true,
      sortable: false,
    },
  };
}

function getAlignmentClassName(align?: 'left' | 'center' | 'right') {
  if (align === 'center') {
    return 'justify-center text-center';
  }

  if (align === 'right') {
    return 'justify-end text-right';
  }

  return '';
}

function renderValue(value: unknown) {
  return typeof value === 'function' ? value() : value;
}

function normalizeUniqueRowIds(rowIds: string[]) {
  return Array.from(new Set(rowIds));
}

function setSelectedRowIds(rowIds: string[]) {
  const nextRowIds = normalizeUniqueRowIds(rowIds);

  if (props.selectedRowIds === undefined) {
    internalSelectedRowIds.value = nextRowIds;
  }

  emit('selectedRowIdsChange', nextRowIds);
}

function toggleAllRows() {
  const currentIds = new Set(currentRowIds.value);

  if (currentIds.size === 0) {
    return;
  }

  if (headerCheckboxValue.value === true) {
    setSelectedRowIds(checkboxSelectedRowIds.value.filter((rowId) => !currentIds.has(rowId)));
    return;
  }

  setSelectedRowIds([...checkboxSelectedRowIds.value, ...currentRowIds.value]);
}

function toggleRowSelection(row: T) {
  const rowId = props.getRowId(row);

  if (checkboxSelectedRowIdSet.value.has(rowId)) {
    setSelectedRowIds(
      checkboxSelectedRowIds.value.filter((selectedRowId) => selectedRowId !== rowId)
    );
    return;
  }

  setSelectedRowIds([...checkboxSelectedRowIds.value, rowId]);
}

function stopGridActivation(event: Event) {
  event.stopPropagation();
}

function measureViewport() {
  if (!viewportRef.value) {
    viewportHeight.value = resolveNumericHeight(props.height);
    return;
  }

  viewportHeight.value = viewportRef.value.clientHeight || resolveNumericHeight(props.height);
}

function handleScroll(event: Event) {
  const viewport = event.currentTarget as HTMLElement;

  scrollTop.value = viewport.scrollTop;
  maybeEmitEndReached(viewport);
}

function maybeEmitEndReached(viewport: HTMLElement) {
  if (
    !hasEndReachedListener.value ||
    props.loading ||
    props.loadingMore ||
    props.hasMore === false ||
    props.rows.length === 0
  ) {
    return;
  }

  const threshold = Math.max(0, props.endReachedThreshold);
  const distanceToEnd = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

  if (distanceToEnd > threshold) {
    endReachedScrollHeight.value = null;
    return;
  }

  if (endReachedScrollHeight.value === viewport.scrollHeight) {
    return;
  }

  endReachedScrollHeight.value = viewport.scrollHeight;
  emit('endReached');
}

function resizeColumnBy(columnId: string, offset: number) {
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
}

function startPointerResize(event: MouseEvent | TouchEvent, columnId: string) {
  const pointerX = 'touches' in event ? event.touches[0]?.clientX : event.clientX;

  if (typeof pointerX !== 'number') {
    return;
  }

  event.preventDefault();
  const column = table.getColumn(columnId);

  if (!column) {
    return;
  }

  isColumnResizing.value = true;
  resizingColumnId.value = columnId;
  resizeStartX.value = pointerX;
  resizeStartWidth.value = column.getSize();
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
  window.addEventListener('mousemove', handlePointerResize);
  window.addEventListener('mouseup', stopPointerResize);
  window.addEventListener('touchmove', handlePointerResize, { passive: false });
  window.addEventListener('touchend', stopPointerResize);
}

function handlePointerResize(event: MouseEvent | TouchEvent) {
  if (!resizingColumnId.value) {
    return;
  }

  const pointerX = 'touches' in event ? event.touches[0]?.clientX : event.clientX;

  if (typeof pointerX !== 'number') {
    return;
  }

  event.preventDefault();
  const column = table.getColumn(resizingColumnId.value);

  if (!column) {
    return;
  }

  const nextSize = clamp(
    resizeStartWidth.value + pointerX - resizeStartX.value,
    column.columnDef.minSize ?? DEFAULT_COLUMN_MIN_WIDTH,
    column.columnDef.maxSize ?? DEFAULT_COLUMN_MAX_WIDTH
  );

  handleColumnSizingChange((currentSizing) => ({
    ...currentSizing,
    [resizingColumnId.value as string]: nextSize,
  }));
}

function stopPointerResize() {
  if (!isColumnResizing.value) {
    return;
  }

  isColumnResizing.value = false;
  resizingColumnId.value = null;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  window.removeEventListener('mousemove', handlePointerResize);
  window.removeEventListener('mouseup', stopPointerResize);
  window.removeEventListener('touchmove', handlePointerResize);
  window.removeEventListener('touchend', stopPointerResize);
}

function activateRow(row: T) {
  const rowId = props.getRowId(row);

  emit('selectedRowIdChange', rowId, row);
  emit('rowClick', row);
}

function handleRowKeydown(event: KeyboardEvent, row: T) {
  if (!isRowInteractive.value || (event.key !== 'Enter' && event.key !== ' ')) {
    return;
  }

  event.preventDefault();
  activateRow(row);
}

function handleSort(columnId: string) {
  emit('sortChange', getNextSort(columnId, props.sort));
}
</script>

<template>
  <div v-bind="{ ...attrs, class: undefined }" :class="rootClassName">
    <div :class="frameClassName">
      <div
        ref="viewportRef"
        :aria-colcount="visibleColumns.length"
        :aria-label="ariaLabel"
        :aria-rowcount="ariaRowCount"
        :class="viewportClassName"
        role="grid"
        :style="viewportStyle"
        @scroll="handleScroll"
      >
        <div class="relative min-w-full" :style="tableWidthStyle">
          <div
            class="sticky top-0 z-20 border-b border-hugo-neutral-800 bg-hugo-surface-subtle"
            role="rowgroup"
            :style="tableWidthStyle"
          >
            <div
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
              class="grid min-w-full"
              role="row"
              :style="{ ...tableWidthStyle, gridTemplateColumns }"
            >
              <div
                v-for="header in headerGroup.headers"
                :key="header.id"
                :aria-colindex="header.index + 1"
                :aria-label="getColumnMeta(header.column)?.label"
                :aria-sort="
                  sort?.columnId === header.column.id
                    ? sort.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                "
                class="relative box-border flex h-11 items-center overflow-hidden bg-hugo-surface-subtle px-4 text-xs font-semibold uppercase leading-4 tracking-hugo-button-small text-hugo-text-subtle"
                :class="getAlignmentClassName(getColumnMeta(header.column)?.align)"
                role="columnheader"
              >
                <button
                  v-if="getColumnMeta(header.column)?.sortable && hasSortChangeListener"
                  class="group/sort inline-flex min-w-0 max-w-full cursor-pointer items-center gap-1 overflow-hidden rounded-sm text-left outline-none hover:text-hugo-text-primary focus-visible:ring-2 focus-visible:ring-hugo-focus"
                  type="button"
                  @click="handleSort(header.column.id)"
                >
                  <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    <FlexRender
                      v-if="!header.isPlaceholder"
                      :render="header.column.columnDef.header"
                      :props="header.getContext()"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    class="inline-flex h-3 w-3 shrink-0 items-center justify-center text-[9px] leading-none opacity-0 transition-opacity group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100"
                    :class="sort?.columnId === header.column.id && 'opacity-100'"
                  >
                    {{
                      sort?.columnId === header.column.id
                        ? sort.direction === 'asc'
                          ? '▲'
                          : '▼'
                        : '▲'
                    }}
                  </span>
                </button>
                <span v-else class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </span>
                <span
                  v-if="header.column.getCanResize()"
                  :aria-label="`Resize ${header.column.id} column`"
                  aria-orientation="vertical"
                  :aria-valuemax="header.column.columnDef.maxSize"
                  :aria-valuemin="header.column.columnDef.minSize"
                  :aria-valuenow="header.column.getSize()"
                  class="absolute inset-y-0 right-0 w-2 cursor-col-resize touch-none outline-none after:absolute after:inset-y-2 after:right-0 after:w-0.5 after:bg-hugo-neutral-800 after:opacity-0 hover:after:opacity-100 focus-visible:after:bg-hugo-focus focus-visible:after:opacity-100"
                  :class="
                    resizingColumnId === header.column.id && 'after:bg-hugo-focus after:opacity-100'
                  "
                  role="separator"
                  tabindex="0"
                  @click.stop
                  @mousedown="startPointerResize($event, header.column.id)"
                  @touchstart="startPointerResize($event, header.column.id)"
                  @keydown="
                    ($event.key === 'ArrowLeft' || $event.key === 'ArrowRight') &&
                    ($event.preventDefault(),
                    resizeColumnBy(
                      header.column.id,
                      $event.key === 'ArrowRight' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP
                    ))
                  "
                />
              </div>
            </div>
          </div>

          <div v-if="loading" class="grid min-w-full" role="rowgroup" :style="tableWidthStyle">
            <div
              v-for="rowIndex in skeletonRows"
              :key="`loading-${rowIndex}`"
              class="grid border-b border-hugo-neutral-500"
              role="row"
              :style="{ ...tableWidthStyle, gridTemplateColumns, height: `${rowHeight}px` }"
            >
              <div
                v-for="column in visibleColumns"
                :key="column.id"
                class="box-border flex h-full items-center overflow-hidden bg-hugo-surface-default px-4"
                :class="getAlignmentClassName(getColumnMeta(column)?.align)"
                role="gridcell"
              >
                <span
                  aria-label="Loading row"
                  class="h-4 w-full animate-pulse rounded bg-hugo-neutral-200"
                />
              </div>
            </div>
          </div>

          <div
            v-else-if="error || rows.length === 0"
            class="box-border flex min-h-40 items-center justify-center border-b border-hugo-neutral-500 bg-hugo-surface-default p-6 text-center text-sm text-hugo-text-subtle"
            role="row"
            :style="tableWidthStyle"
          >
            <div role="gridcell" :aria-colspan="Math.max(visibleColumns.length, 1)">
              <component :is="() => renderValue(error || empty)" />
            </div>
          </div>

          <div
            v-else
            class="min-w-full"
            :class="virtualized && 'relative'"
            role="rowgroup"
            :style="bodyRowGroupStyle"
          >
            <div
              v-for="bodyRow in bodyRows"
              :key="bodyRow.key"
              :aria-rowindex="bodyRow.index + 2"
              :aria-selected="selectedRowId === getRowId(bodyRow.row.original) || undefined"
              class="grid min-w-full border-b border-hugo-neutral-500 outline-none"
              :class="[
                virtualized && 'absolute left-0 top-0',
                isRowInteractive &&
                  'cursor-pointer hover:[&_.hugo-ui-data-grid-cell]:bg-hugo-surface-tinted focus-visible:[&_.hugo-ui-data-grid-cell]:ring-2 focus-visible:[&_.hugo-ui-data-grid-cell]:ring-inset focus-visible:[&_.hugo-ui-data-grid-cell]:ring-hugo-focus',
                selectedRowId === getRowId(bodyRow.row.original) &&
                  '[&_.hugo-ui-data-grid-cell]:bg-hugo-surface-tinted',
              ]"
              role="row"
              :tabindex="isRowInteractive ? 0 : undefined"
              :style="[
                {
                  ...tableWidthStyle,
                  gridTemplateColumns,
                  height: `${bodyRow.size}px`,
                },
                virtualized ? { transform: `translateY(${bodyRow.start}px)` } : undefined,
              ]"
              @click="isRowInteractive && activateRow(bodyRow.row.original)"
              @keydown="handleRowKeydown($event, bodyRow.row.original)"
            >
              <div
                v-for="(cell, cellIndex) in bodyRow.row.getVisibleCells()"
                :key="cell.id"
                :aria-colindex="cellIndex + 1"
                class="hugo-ui-data-grid-cell box-border flex h-full items-center overflow-hidden bg-hugo-surface-default px-4 text-sm leading-5 text-hugo-text-default"
                :class="getAlignmentClassName(getColumnMeta(cell.column)?.align)"
                role="gridcell"
              >
                <span
                  class="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                  data-slot="data-grid-cell-content"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="shouldRenderLoadingMore"
            :aria-rowindex="rows.length + 2"
            class="grid border-b border-hugo-neutral-500"
            role="row"
            :style="{ ...tableWidthStyle, gridTemplateColumns, height: `${rowHeight}px` }"
          >
            <div
              :aria-colspan="visibleColumns.length"
              aria-label="Loading more rows"
              class="box-border flex h-full items-center justify-center gap-2 bg-hugo-surface-default px-4 text-sm leading-5 text-hugo-text-subtle"
              role="gridcell"
              :style="{ gridColumn: `1 / span ${Math.max(visibleColumns.length, 1)}` }"
            >
              <span
                aria-hidden="true"
                class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              <span>Loading more</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="pagination"
        class="flex flex-wrap items-center justify-end gap-3 border-t border-hugo-neutral-500 bg-hugo-surface-default px-4 py-3 text-sm text-hugo-text-default"
      >
        <label class="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            class="h-9 rounded-md border border-hugo-neutral-500 bg-hugo-surface-default px-2 outline-none focus-visible:ring-2 focus-visible:ring-hugo-focus"
            :value="pagination.pageSize"
            aria-label="Rows per page"
            @change="emit('pageSizeChange', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </label>
        <span>{{ firstVisibleItem }}-{{ lastVisibleItem }} of {{ pagination.total }}</span>
        <button
          aria-label="Go to previous page"
          class="inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-hugo-neutral-500 px-3 outline-none hover:bg-hugo-surface-tinted focus-visible:ring-2 focus-visible:ring-hugo-focus disabled:cursor-not-allowed disabled:text-hugo-text-disabled"
          type="button"
          :disabled="!canGoPrevious"
          @click="emit('pageChange', pagination.page - 1)"
        >
          Previous
        </button>
        <button
          aria-label="Go to next page"
          class="inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-hugo-neutral-500 px-3 outline-none hover:bg-hugo-surface-tinted focus-visible:ring-2 focus-visible:ring-hugo-focus disabled:cursor-not-allowed disabled:text-hugo-text-disabled"
          type="button"
          :disabled="!canGoNext"
          @click="emit('pageChange', pagination.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
