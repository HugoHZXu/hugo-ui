<script setup lang="ts">
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-vue-next';
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui';
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '../../lib/utils';
import {
  choiceContentClass,
  choiceControlClass,
  choiceGroupLabelClass,
  choiceHelperClass,
  choiceItemClass,
  choiceLabelClass,
  choiceRootClass,
  filterChoiceOptions,
  findChoiceOption,
  getChoiceLabel,
  getGroupedChoiceOptions,
  omitChoiceAttributes,
  type ChoiceOption,
} from '../choice/choice';
import type { ComboboxEmits, ComboboxOption, ComboboxProps, ComboboxValue } from './combobox';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ComboboxProps>(), {
  align: 'start',
  alignOffset: 0,
  clearable: false,
  debounce: 250,
  defaultOpen: false,
  disabled: false,
  emptyText: 'No results found.',
  forceMount: false,
  loading: false,
  open: undefined,
  options: () => [],
  placeholder: 'Search options',
  required: false,
  side: 'bottom',
  sideOffset: 8,
  size: 'default',
  status: 'default',
});

const emit = defineEmits<ComboboxEmits>();
const attrs = useAttrs();
const slots = useSlots();

const comboboxUid = ref(Math.random().toString(36).slice(2));
const internalValue = ref<ComboboxValue | null>(props.modelValue ?? props.defaultValue ?? null);
const internalQuery = ref(props.query ?? props.defaultQuery ?? '');
const internalOpen = ref(props.open ?? props.defaultOpen);
const asyncOptions = ref<ComboboxOption[]>([]);
const asyncLoading = ref(false);
const searchRequestId = ref(0);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue !== undefined) {
      internalValue.value = modelValue;
      syncQueryToSelectedOption();
    }
  }
);

watch(
  () => props.query,
  (query) => {
    if (query !== undefined) {
      internalQuery.value = query;
    }
  }
);

watch(
  () => props.open,
  (open) => {
    if (open !== undefined) {
      internalOpen.value = open;
    }
  }
);

watch(
  () => [internalQuery.value, props.search] as const,
  ([query]) => {
    scheduleSearch(query);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

const isControlled = computed(() => props.modelValue !== undefined);
const isQueryControlled = computed(() => props.query !== undefined);
const isOpenControlled = computed(() => props.open !== undefined);
const allOptions = computed(() => (props.search ? asyncOptions.value : props.options));
const filteredOptions = computed(() =>
  props.search ? asyncOptions.value : filterChoiceOptions(props.options, internalQuery.value)
);
const selectedOption = computed(() => findChoiceOption(allOptions.value, internalValue.value));
const groupedOptions = computed(() => getGroupedChoiceOptions(filteredOptions.value));
const resolvedLoading = computed(() => props.loading || asyncLoading.value);
const resolvedStatus = computed(() => (props.error ? 'error' : props.status));
const hasLabel = computed(() => Boolean(slots.label || props.label));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasMessage = computed(() => Boolean(slots.message || props.message || props.error));
const shouldRenderHelper = computed(() => hasDescription.value || hasMessage.value);
const shouldShowClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    (internalValue.value != null || internalQuery.value.length > 0)
);
const shouldShowEmpty = computed(
  () => !resolvedLoading.value && filteredOptions.value.length === 0
);

const fieldId = computed(() =>
  String(props.id ?? `hugo-ui-shadcn-vue-combobox-${comboboxUid.value}`)
);
const labelId = computed(() => (hasLabel.value ? `${fieldId.value}-label` : undefined));
const helperId = computed(() => (shouldRenderHelper.value ? `${fieldId.value}-helper` : undefined));
const comboboxValue = computed(() => internalValue.value ?? undefined);
const resolvedOpen = computed(() =>
  isOpenControlled.value ? Boolean(props.open) : internalOpen.value
);
const comboboxOpen = computed(() => resolvedOpen.value);

const rootClassName = computed(() =>
  cn(
    choiceRootClass,
    props.classNames?.root,
    props.slotProps?.root?.class,
    props.class,
    attrs.class
  )
);
const labelClassName = computed(() =>
  cn(choiceLabelClass({ size: props.size }), props.classNames?.label, props.slotProps?.label?.class)
);
const requiredMarkClassName = computed(() =>
  cn('text-hugo-status-error', props.classNames?.requiredMark)
);
const controlClassName = computed(() =>
  cn(
    choiceControlClass({
      size: props.size,
      status: resolvedStatus.value,
    }),
    'pl-3',
    props.classNames?.control,
    props.slotProps?.control?.class
  )
);
const inputClassName = computed(() =>
  cn(
    'min-w-0 flex-1 border-0 bg-transparent font-sans text-base leading-6 text-hugo-text-primary outline-none',
    'placeholder:text-hugo-text-default placeholder:opacity-[0.76]',
    'disabled:cursor-not-allowed disabled:text-hugo-text-disabled',
    props.size === 'sm' && 'text-sm leading-5',
    props.classNames?.input
  )
);
const iconClassName = computed(() =>
  cn(
    'size-5 shrink-0 text-hugo-text-subtle',
    props.disabled && 'text-hugo-text-disabled',
    props.classNames?.icon
  )
);
const clearButtonClassName = computed(() =>
  cn(
    'grid size-6 shrink-0 place-items-center rounded-full text-hugo-text-subtle hover:bg-hugo-surface-tinted hover:text-hugo-brand-deep',
    props.classNames?.clearButton
  )
);
const contentClassName = computed(() =>
  cn(
    choiceContentClass,
    'min-w-[var(--reka-combobox-trigger-width,16rem)]',
    props.classNames?.content,
    props.slotProps?.content?.class
  )
);
const viewportClassName = computed(() => cn('max-h-72 p-0', props.classNames?.viewport));
const groupLabelClassName = computed(() => cn(choiceGroupLabelClass, props.classNames?.groupLabel));
const itemClassName = computed(() => cn(choiceItemClass, props.classNames?.item));
const itemIndicatorClassName = computed(() =>
  cn('mt-0.5 grid size-4 shrink-0 place-items-center text-current', props.classNames?.itemIndicator)
);
const itemTextClassName = computed(() => cn('min-w-0 flex-1', props.classNames?.itemText));
const itemDescriptionClassName = computed(() =>
  cn('mt-0.5 text-xs leading-4 text-hugo-text-subtle', props.classNames?.itemDescription)
);
const helperClassName = computed(() =>
  cn(choiceHelperClass, props.classNames?.helper, props.slotProps?.helper?.class)
);
const helperContentClassName = computed(() =>
  cn('inline-flex flex-col gap-1', props.classNames?.helperContent)
);
const messageClassName = computed(() =>
  cn(
    'inline-flex items-center gap-1',
    resolvedStatus.value === 'error' && 'text-hugo-status-error',
    props.classNames?.message
  )
);
const spinnerClassName = computed(() =>
  cn('size-4 shrink-0 animate-spin text-hugo-text-subtle', props.classNames?.spinner)
);
const emptyClassName = computed(() =>
  cn('px-2.5 py-6 text-center text-sm leading-5 text-hugo-text-subtle', props.classNames?.empty)
);

const rootAttributes = computed(() => omitChoiceAttributes(props.slotProps?.root, ['class']));
const labelAttributes = computed(() => omitChoiceAttributes(props.slotProps?.label, ['class']));
const controlAttributes = computed(() => omitChoiceAttributes(props.slotProps?.control, ['class']));
const portalAttributes = computed(() => omitChoiceAttributes(props.slotProps?.portal, ['class']));
const contentAttributes = computed(() => omitChoiceAttributes(props.slotProps?.content, ['class']));
const helperAttributes = computed(() => omitChoiceAttributes(props.slotProps?.helper, ['class']));

function syncQueryToSelectedOption() {
  const option = findChoiceOption(allOptions.value, internalValue.value);

  if (option && !isQueryControlled.value) {
    internalQuery.value = getChoiceLabel(option);
  }
}

function setQuery(query: string) {
  if (!isQueryControlled.value) {
    internalQuery.value = query;
  }

  emit('update:query', query);
  emit('queryChange', query);
}

async function runSearch(query: string, requestId: number) {
  if (!props.search) {
    asyncOptions.value = [];
    asyncLoading.value = false;
    return;
  }

  asyncLoading.value = true;
  emit('search', query);

  try {
    const nextOptions = await props.search(query);

    if (requestId === searchRequestId.value) {
      asyncOptions.value = nextOptions;
    }
  } finally {
    if (requestId === searchRequestId.value) {
      asyncLoading.value = false;
    }
  }
}

function scheduleSearch(query: string) {
  if (!props.search) {
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  const requestId = searchRequestId.value + 1;
  searchRequestId.value = requestId;

  if (props.debounce <= 0) {
    void runSearch(query, requestId);
    return;
  }

  debounceTimer = setTimeout(() => {
    void runSearch(query, requestId);
  }, props.debounce);
}

function handleValueChange(value: ComboboxValue) {
  const option = findChoiceOption(allOptions.value, value);

  if (!isControlled.value) {
    internalValue.value = value;
  }

  if (option && !isQueryControlled.value) {
    internalQuery.value = getChoiceLabel(option);
  }

  emit('update:modelValue', value);
  emit('change', value);
}

function handleQueryChange(query: string) {
  setQuery(query);
  requestOpen();
}

function setOpen(open: boolean) {
  if (resolvedOpen.value === open) {
    return;
  }

  if (!isOpenControlled.value) {
    internalOpen.value = open;
  }

  emit('update:open', open);
  emit('openChange', open);
}

function requestOpen() {
  if (!props.disabled) {
    setOpen(true);
  }
}

function handleOpenChange(open: boolean) {
  setOpen(open);
}

function clearSelection(event?: MouseEvent) {
  event?.preventDefault();
  event?.stopPropagation();

  if (!isControlled.value) {
    internalValue.value = null;
  }

  setQuery('');
  emit('update:modelValue', null);
  emit('change', null);
  emit('clear');
}

function hasOptionDescription(option: ChoiceOption) {
  return option.description != null;
}
</script>

<template>
  <div
    v-bind="rootAttributes"
    :class="rootClassName"
    data-component="hugo-combobox"
    data-slot="combobox"
  >
    <label
      v-if="hasLabel"
      v-bind="labelAttributes"
      :id="labelId"
      :class="labelClassName"
      data-slot="combobox-label"
      :for="fieldId"
    >
      <span>
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="required"
        aria-hidden="true"
        :class="requiredMarkClassName"
        data-slot="combobox-required-mark"
      >
        *
      </span>
    </label>

    <ComboboxRoot
      :default-open="defaultOpen"
      :default-value="defaultValue ?? undefined"
      :disabled="disabled || undefined"
      :ignore-filter="true"
      :model-value="comboboxValue"
      :name="name"
      :open="comboboxOpen"
      :open-on-click="true"
      :open-on-focus="true"
      :required="required || undefined"
      :reset-search-term-on-blur="false"
      :reset-search-term-on-select="false"
      @update:model-value="handleValueChange"
      @update:open="handleOpenChange"
    >
      <ComboboxAnchor
        v-bind="controlAttributes"
        :aria-describedby="helperId"
        :aria-invalid="resolvedStatus === 'error' || undefined"
        :aria-labelledby="labelId"
        :class="controlClassName"
        :data-disabled="disabled ? 'true' : undefined"
        data-slot="combobox-control"
      >
        <Search aria-hidden="true" :class="iconClassName" data-slot="combobox-leading-icon" />
        <ComboboxInput
          :id="fieldId"
          :auto-focus="false"
          :class="inputClassName"
          data-slot="combobox-input"
          :disabled="disabled || undefined"
          :display-value="() => internalQuery"
          :model-value="internalQuery"
          :placeholder="placeholder"
          @click="requestOpen"
          @focus="requestOpen"
          @update:model-value="handleQueryChange"
        />
        <Loader2
          v-if="resolvedLoading"
          aria-hidden="true"
          :class="spinnerClassName"
          data-slot="combobox-spinner"
        />
        <button
          v-if="shouldShowClear"
          :class="clearButtonClassName"
          data-slot="combobox-clear"
          type="button"
          @click="clearSelection"
        >
          <span class="sr-only">Clear selection</span>
          <X aria-hidden="true" :size="14" />
        </button>
        <ComboboxTrigger :disabled="disabled || undefined" as-child>
          <button
            :class="
              cn(
                'grid size-6 shrink-0 place-items-center rounded-full text-hugo-text-subtle',
                disabled && 'cursor-not-allowed text-hugo-text-disabled'
              )
            "
            data-slot="combobox-trigger"
            tabindex="-1"
            type="button"
            @click="requestOpen"
          >
            <span class="sr-only">Open options</span>
            <ChevronDown aria-hidden="true" :size="16" />
          </button>
        </ComboboxTrigger>
      </ComboboxAnchor>

      <ComboboxPortal v-bind="portalAttributes">
        <ComboboxContent
          v-bind="contentAttributes"
          :align="align"
          :align-offset="alignOffset"
          :class="contentClassName"
          data-slot="combobox-content"
          :force-mount="forceMount || undefined"
          position="popper"
          :side="side"
          :side-offset="sideOffset"
        >
          <ComboboxViewport :class="viewportClassName" data-slot="combobox-viewport">
            <div
              v-if="resolvedLoading"
              class="px-2.5 py-6 text-center text-sm leading-5 text-hugo-text-subtle"
              data-slot="combobox-loading"
            >
              Loading...
            </div>
            <div v-else-if="shouldShowEmpty" :class="emptyClassName" data-slot="combobox-empty">
              <slot name="empty">{{ emptyText }}</slot>
            </div>
            <template v-else>
              <ComboboxGroup
                v-for="group in groupedOptions"
                :key="group.group ?? '__ungrouped'"
                :class="classNames?.group"
                data-slot="combobox-group"
              >
                <ComboboxLabel
                  v-if="group.group"
                  :class="groupLabelClassName"
                  data-slot="combobox-group-label"
                >
                  {{ group.group }}
                </ComboboxLabel>
                <ComboboxItem
                  v-for="option in group.options"
                  :key="String(option.value)"
                  :class="itemClassName"
                  :data-value="String(option.value)"
                  data-slot="combobox-item"
                  :disabled="option.disabled || undefined"
                  :text-value="String(option.label)"
                  :value="option.value"
                >
                  <ComboboxItemIndicator
                    :class="itemIndicatorClassName"
                    data-slot="combobox-item-indicator"
                  >
                    <Check aria-hidden="true" :size="16" />
                  </ComboboxItemIndicator>
                  <span :class="itemTextClassName" data-slot="combobox-item-text">
                    <span class="block truncate">
                      <slot name="option" :option="option">
                        {{ option.label }}
                      </slot>
                    </span>
                    <span
                      v-if="hasOptionDescription(option)"
                      :class="itemDescriptionClassName"
                      data-slot="combobox-item-description"
                    >
                      {{ option.description }}
                    </span>
                  </span>
                </ComboboxItem>
              </ComboboxGroup>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>

    <div
      v-if="shouldRenderHelper"
      v-bind="helperAttributes"
      :id="helperId"
      :class="helperClassName"
      data-slot="combobox-helper"
    >
      <span :class="helperContentClassName" data-slot="combobox-helper-content">
        <span v-if="hasMessage" :class="messageClassName" data-slot="combobox-message">
          <slot name="message">{{ error ?? message }}</slot>
        </span>
        <span v-if="hasDescription" data-slot="combobox-description">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
    </div>
  </div>
</template>
