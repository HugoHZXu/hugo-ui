<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '../../lib/utils';
import {
  choiceContentClass,
  choiceControlClass,
  choiceGroupLabelClass,
  choiceHelperClass,
  choiceItemClass,
  choiceLabelClass,
  choiceRootClass,
  findChoiceOption,
  getChoiceLabel,
  getGroupedChoiceOptions,
  omitChoiceAttributes,
} from '../choice/choice';
import type { SelectEmits, SelectProps, SelectValue as HugoSelectValue } from './select';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectProps>(), {
  align: 'start',
  alignOffset: 0,
  defaultOpen: false,
  disabled: false,
  forceMount: false,
  open: undefined,
  placeholder: 'Select an option',
  required: false,
  side: 'bottom',
  sideOffset: 8,
  size: 'default',
  status: 'default',
});

const emit = defineEmits<SelectEmits>();
const attrs = useAttrs();
const slots = useSlots();

const selectUid = ref(Math.random().toString(36).slice(2));
const internalValue = ref<HugoSelectValue | null>(props.modelValue ?? props.defaultValue ?? null);
const internalOpen = ref(props.open ?? props.defaultOpen);

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue !== undefined) {
      internalValue.value = modelValue;
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

const isControlled = computed(() => props.modelValue !== undefined);
const isOpenControlled = computed(() => props.open !== undefined);
const selectedOption = computed(() => findChoiceOption(props.options, internalValue.value));
const groupedOptions = computed(() => getGroupedChoiceOptions(props.options));
const resolvedStatus = computed(() => (props.error ? 'error' : props.status));
const hasLabel = computed(() => Boolean(slots.label || props.label));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasMessage = computed(() => Boolean(slots.message || props.message || props.error));
const shouldRenderHelper = computed(() => hasDescription.value || hasMessage.value);

const fieldId = computed(() => String(props.id ?? `hugo-ui-shadcn-vue-select-${selectUid.value}`));
const labelId = computed(() => (hasLabel.value ? `${fieldId.value}-label` : undefined));
const helperId = computed(() => (shouldRenderHelper.value ? `${fieldId.value}-helper` : undefined));
const selectValue = computed(() => internalValue.value ?? undefined);
const resolvedOpen = computed(() =>
  isOpenControlled.value ? Boolean(props.open) : internalOpen.value
);
const selectOpen = computed(() => resolvedOpen.value);
const controlHasPlaceholder = computed(() => internalValue.value == null);

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
    props.classNames?.control,
    props.slotProps?.control?.class
  )
);
const valueClassName = computed(() =>
  cn('min-w-0 flex-1 truncate text-left', props.classNames?.value)
);
const iconClassName = computed(() =>
  cn(
    'size-5 shrink-0 text-hugo-text-subtle',
    props.disabled && 'text-hugo-text-disabled',
    props.classNames?.icon
  )
);
const contentClassName = computed(() =>
  cn(
    choiceContentClass,
    'min-w-[var(--reka-select-trigger-width)]',
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
const itemTextClassName = computed(() => cn('min-w-0 flex-1 truncate', props.classNames?.itemText));
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

const rootAttributes = computed(() => omitChoiceAttributes(props.slotProps?.root, ['class']));
const labelAttributes = computed(() => omitChoiceAttributes(props.slotProps?.label, ['class']));
const controlAttributes = computed(() => omitChoiceAttributes(props.slotProps?.control, ['class']));
const portalAttributes = computed(() => omitChoiceAttributes(props.slotProps?.portal, ['class']));
const contentAttributes = computed(() => omitChoiceAttributes(props.slotProps?.content, ['class']));
const helperAttributes = computed(() => omitChoiceAttributes(props.slotProps?.helper, ['class']));

function handleValueChange(value: HugoSelectValue) {
  if (!isControlled.value) {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
  emit('change', value);
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

function handleTriggerKeydown(event: KeyboardEvent) {
  if ([' ', 'Enter', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    requestOpen();
  }
}
</script>

<template>
  <div
    v-bind="rootAttributes"
    :class="rootClassName"
    data-component="hugo-select"
    data-slot="select"
  >
    <label
      v-if="hasLabel"
      v-bind="labelAttributes"
      :id="labelId"
      :class="labelClassName"
      data-slot="select-label"
      :for="fieldId"
    >
      <span>
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="required"
        aria-hidden="true"
        :class="requiredMarkClassName"
        data-slot="select-required-mark"
      >
        *
      </span>
    </label>

    <SelectRoot
      :default-open="defaultOpen"
      :default-value="defaultValue ?? undefined"
      :disabled="disabled || undefined"
      :model-value="selectValue"
      :name="name"
      :open="selectOpen"
      :required="required || undefined"
      @update:model-value="handleValueChange"
      @update:open="handleOpenChange"
    >
      <SelectTrigger
        v-bind="controlAttributes"
        :id="fieldId"
        :aria-describedby="helperId"
        :aria-invalid="resolvedStatus === 'error' || undefined"
        :aria-labelledby="labelId"
        :class="controlClassName"
        :data-disabled="disabled ? 'true' : undefined"
        :data-placeholder="controlHasPlaceholder ? 'true' : undefined"
        data-slot="select-control"
        :disabled="disabled || undefined"
        @click="requestOpen"
        @keydown="handleTriggerKeydown"
      >
        <SelectValue :class="valueClassName" data-slot="select-value" :placeholder="placeholder">
          <template #default="{ selectedLabel }">
            <slot name="value" :option="selectedOption">
              {{
                selectedOption ? getChoiceLabel(selectedOption) : selectedLabel?.[0] || placeholder
              }}
            </slot>
          </template>
        </SelectValue>
        <ChevronDown aria-hidden="true" :class="iconClassName" data-slot="select-icon" />
      </SelectTrigger>

      <SelectPortal v-bind="portalAttributes">
        <SelectContent
          v-bind="contentAttributes"
          :align="align"
          :align-offset="alignOffset"
          :class="contentClassName"
          data-slot="select-content"
          :force-mount="forceMount || undefined"
          position="popper"
          :side="side"
          :side-offset="sideOffset"
        >
          <SelectViewport :class="viewportClassName" data-slot="select-viewport">
            <SelectGroup
              v-for="group in groupedOptions"
              :key="group.group ?? '__ungrouped'"
              :class="classNames?.group"
              data-slot="select-group"
            >
              <SelectLabel
                v-if="group.group"
                :class="groupLabelClassName"
                data-slot="select-group-label"
              >
                {{ group.group }}
              </SelectLabel>
              <SelectItem
                v-for="option in group.options"
                :key="String(option.value)"
                :class="itemClassName"
                :data-value="String(option.value)"
                data-slot="select-item"
                :disabled="option.disabled || undefined"
                :text-value="String(option.label)"
                :value="option.value"
              >
                <SelectItemIndicator
                  :class="itemIndicatorClassName"
                  data-slot="select-item-indicator"
                >
                  <Check aria-hidden="true" :size="16" />
                </SelectItemIndicator>
                <SelectItemText :class="itemTextClassName" data-slot="select-item-text">
                  <slot name="option" :option="option">
                    {{ option.label }}
                  </slot>
                </SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <div
      v-if="shouldRenderHelper"
      v-bind="helperAttributes"
      :id="helperId"
      :class="helperClassName"
      data-slot="select-helper"
    >
      <span :class="helperContentClassName" data-slot="select-helper-content">
        <span v-if="hasMessage" :class="messageClassName" data-slot="select-message">
          <slot name="message">{{ error ?? message }}</slot>
        </span>
        <span v-if="hasDescription" data-slot="select-description">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
    </div>
  </div>
</template>
