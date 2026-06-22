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
import {
  DEFAULT_COLUMN_MAX_WIDTH,
  DEFAULT_COLUMN_MIN_WIDTH,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_EMPTY_STATE,
  DEFAULT_GRID_HEIGHT,
  DEFAULT_ROW_HEIGHT,
  KEYBOARD_RESIZE_STEP,
  type DataGridColumn,
  type DataGridEmits,
  type DataGridProps,
  type DataGridSort,
} from './dataGrid';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  as: 'div',
  empty: DEFAULT_EMPTY_STATE,
  height: DEFAULT_GRID_HEIGHT,
  loading: false,
  overscan: 8,
  rowHeight: DEFAULT_ROW_HEIGHT,
  selectedRowId: undefined,
  sort: null,
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

const columnSizingState = computed(
  () => props.columnSizing?.widths ?? internalColumnSizing.value
);

const rootClassName = computed(() =>
  cn('w-full text-hugo-text-default', isColumnResizing.value && 'select-none', props.class, attrs.class)
);

const viewportStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));

const tableColumns = computed<ColumnDef<T>[]>(() =>
  props.columns.map((column) => ({
    id: column.id,
    header: () => column.header,
    cell: (info) => column.render(info.row.original),
    size: columnSizingState.value[column.id] ?? column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH,
    minSize: column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
    maxSize: column.maxWidth ?? DEFAULT_COLUMN_MAX_WIDTH,
    enableResizing: column.resizable ?? true,
    enableSorting: column.sortable ?? false,
    meta: {
      align: column.align,
      label: typeof column.header === 'string' ? column.header : column.id,
      sortable: column.sortable ?? false,
    },
  }))
);

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
const tableWidth = computed(() => table.getTotalSize());
const tableWidthStyle = computed(() => ({
  minWidth: `${tableWidth.value}px`,
  width: '100%',
}));
const gridTemplateColumns = computed(() =>
  getStretchGridTemplateColumns(visibleColumns.value.map((column) => column.getSize()))
);
const totalBodyHeight = computed(() => tableRows.value.length * props.rowHeight);
const visibleRange = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan);
  const visibleCount = Math.ceil(viewportHeight.value / props.rowHeight) + props.overscan * 2;
  const end = Math.min(tableRows.value.length, start + visibleCount);

  return { start, end };
});
const virtualRows = computed(() =>
  tableRows.value.slice(visibleRange.value.start, visibleRange.value.end).map((row, offset) => {
    const index = visibleRange.value.start + offset;

    return {
      index,
      key: row.id,
      row,
      start: index * props.rowHeight,
      size: props.rowHeight,
    };
  })
);
const skeletonRows = computed(() => Math.min(props.pagination?.pageSize ?? 8, 10));
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
  () => props.height,
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

function getStretchGridTemplateColumns(columnSizes: number[]) {
  if (columnSizes.length === 0) {
    return '';
  }

  return columnSizes
    .map((size, index) =>
      index === columnSizes.length - 1 ? `minmax(${size}px, 1fr)` : `${size}px`
    )
    .join(' ');
}

function getColumnMeta(column: { columnDef: { meta?: unknown } }) {
  return column.columnDef.meta as
    | { align?: 'left' | 'center' | 'right'; label?: string; sortable?: boolean }
    | undefined;
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

function measureViewport() {
  if (!viewportRef.value) {
    viewportHeight.value = resolveNumericHeight(props.height);
    return;
  }

  viewportHeight.value = viewportRef.value.clientHeight || resolveNumericHeight(props.height);
}

function handleScroll(event: Event) {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
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
    <div class="overflow-hidden rounded-lg border border-hugo-neutral-500 bg-hugo-surface-default">
      <div
        ref="viewportRef"
        :aria-colcount="visibleColumns.length"
        :aria-label="ariaLabel"
        :aria-rowcount="rows.length + 1"
        class="relative overflow-auto bg-hugo-surface-default"
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
                  :class="resizingColumnId === header.column.id && 'after:bg-hugo-focus after:opacity-100'"
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

          <div
            v-if="loading"
            class="grid min-w-full"
            role="rowgroup"
            :style="tableWidthStyle"
          >
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
            class="relative min-w-full"
            role="rowgroup"
            :style="{ ...tableWidthStyle, height: `${totalBodyHeight}px` }"
          >
            <div
              v-for="virtualRow in virtualRows"
              :key="virtualRow.key"
              :aria-rowindex="virtualRow.index + 2"
              :aria-selected="selectedRowId === getRowId(virtualRow.row.original) || undefined"
              class="absolute left-0 top-0 grid min-w-full border-b border-hugo-neutral-500 outline-none"
              :class="[
                isRowInteractive &&
                  'cursor-pointer hover:[&_.hugo-ui-data-grid-cell]:bg-hugo-surface-tinted focus-visible:[&_.hugo-ui-data-grid-cell]:ring-2 focus-visible:[&_.hugo-ui-data-grid-cell]:ring-inset focus-visible:[&_.hugo-ui-data-grid-cell]:ring-hugo-focus',
                selectedRowId === getRowId(virtualRow.row.original) &&
                  '[&_.hugo-ui-data-grid-cell]:bg-hugo-surface-tinted',
              ]"
              role="row"
              :tabindex="isRowInteractive ? 0 : undefined"
              :style="{
                ...tableWidthStyle,
                gridTemplateColumns,
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }"
              @click="isRowInteractive && activateRow(virtualRow.row.original)"
              @keydown="handleRowKeydown($event, virtualRow.row.original)"
            >
              <div
                v-for="(cell, cellIndex) in virtualRow.row.getVisibleCells()"
                :key="cell.id"
                :aria-colindex="cellIndex + 1"
                class="hugo-ui-data-grid-cell box-border flex h-full items-center overflow-hidden bg-hugo-surface-default px-4 text-sm leading-5 text-hugo-text-default"
                :class="getAlignmentClassName(getColumnMeta(cell.column)?.align)"
                role="gridcell"
              >
                <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </span>
              </div>
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
