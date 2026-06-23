<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import type {
  CheckboxEmits,
  CheckboxModelValue,
  CheckboxProps,
  CheckboxSlotAttributes,
} from './checkbox';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CheckboxProps>(), {
  as: 'button',
  asChild: false,
  defaultValue: false,
  disabled: false,
  labelClickable: true,
  modelValue: undefined,
  required: false,
  value: 'on',
});

const emit = defineEmits<CheckboxEmits>();
const attrs = useAttrs();
const slots = useSlots();

const checkboxUid = ref(Math.random().toString(36).slice(2));
const internalValue = ref<CheckboxModelValue>(
  normalizeValue(props.modelValue ?? props.defaultValue)
);

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue !== undefined) {
      internalValue.value = normalizeValue(modelValue);
    }
  }
);

const isControlled = computed(() => props.modelValue !== undefined);
const isActive = computed(
  () => internalValue.value === true || internalValue.value === 'indeterminate'
);
const stateName = computed(() => {
  if (internalValue.value === 'indeterminate') {
    return 'indeterminate';
  }

  return internalValue.value ? 'checked' : 'unchecked';
});
const hasLabel = computed(() => Boolean(slots.label || props.label));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasContent = computed(() => hasLabel.value || hasDescription.value);

const checkboxId = computed(() =>
  String(
    props.id ?? props.slotProps?.control?.id ?? `hugo-ui-shadcn-vue-checkbox-${checkboxUid.value}`
  )
);
const labelId = computed(() => (hasLabel.value ? `${checkboxId.value}-label` : undefined));
const descriptionId = computed(() =>
  hasDescription.value ? `${checkboxId.value}-description` : undefined
);

const rootClassName = computed(() =>
  cn(
    'inline-flex max-w-full items-start gap-2 font-sans text-hugo-text-default',
    props.disabled && 'text-hugo-text-disabled',
    props.classNames?.root,
    props.slotProps?.root?.class,
    props.class,
    attrs.class
  )
);
const controlClassName = computed(() =>
  cn(
    'hugo-ui-shadcn-vue-checkbox-control group/checkbox-control inline-flex h-[34px] w-[34px]',
    'shrink-0 items-center justify-center rounded-md border border-transparent bg-transparent',
    'text-hugo-text-default outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-linear',
    'hover:border-hugo-brand-accent hover:bg-[var(--hugo-ui-shadcn-checkbox-hover)]',
    'active:border-hugo-brand-deep active:bg-[var(--hugo-ui-shadcn-checkbox-active)]',
    'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
    'disabled:pointer-events-none disabled:cursor-not-allowed data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed',
    props.disabled && 'text-hugo-text-disabled',
    props.classNames?.control,
    props.slotProps?.control?.class
  )
);
const boxClassName = computed(() =>
  cn(
    'flex size-6 items-center justify-center rounded-[4px] border bg-hugo-surface-default',
    'transition-[background-color,border-color,color] duration-150 ease-linear',
    isActive.value
      ? 'border-hugo-brand-accent bg-hugo-brand-accent text-hugo-text-inverse'
      : 'border-current text-hugo-text-default',
    !props.disabled && 'group-hover/checkbox-control:border-hugo-brand-accent',
    !props.disabled && 'group-active/checkbox-control:border-hugo-brand-deep',
    props.disabled &&
      (isActive.value
        ? 'border-hugo-neutral-disabled bg-hugo-neutral-disabled text-hugo-text-inverse'
        : 'border-hugo-neutral-disabled text-hugo-text-disabled'),
    props.classNames?.box,
    props.slotProps?.box?.class
  )
);
const indicatorClassName = computed(() =>
  cn(
    'grid size-full place-items-center text-current',
    props.classNames?.indicator,
    props.slotProps?.indicator?.class
  )
);
const iconClassName = computed(() => cn('size-4 stroke-[3]', props.classNames?.icon));
const contentClassName = computed(() =>
  cn(
    'min-w-0 pt-[5px]',
    props.labelClickable && !props.disabled && 'cursor-pointer',
    props.disabled && 'cursor-not-allowed',
    props.classNames?.content,
    props.slotProps?.content?.class
  )
);
const labelClassName = computed(() =>
  cn(
    'block select-none text-base font-normal leading-6 tracking-[0.02em]',
    props.disabled ? 'text-hugo-text-disabled' : 'text-hugo-text-default',
    props.classNames?.label,
    props.slotProps?.label?.class
  )
);
const descriptionClassName = computed(() =>
  cn(
    'mt-1 block select-none text-sm font-normal leading-5 text-hugo-text-subtle',
    props.disabled && 'text-hugo-text-disabled',
    props.classNames?.description,
    props.slotProps?.description?.class
  )
);

const rootAttributes = computed(() => ({
  ...omitAttributes(props.slotProps?.root, ['class']),
  'data-component': 'hugo-checkbox',
  'data-disabled': props.disabled ? 'true' : undefined,
  'data-state': stateName.value,
  'data-slot': 'root',
}));
const controlAttributes = computed(() => {
  const merged = {
    ...omitAttributes(attrs as CheckboxSlotAttributes, ['class', 'id']),
    ...omitAttributes(props.slotProps?.control, ['class', 'id']),
  };

  if (!merged['aria-label'] && !merged['aria-labelledby'] && labelId.value) {
    merged['aria-labelledby'] = labelId.value;
  }

  if (!merged['aria-describedby'] && descriptionId.value) {
    merged['aria-describedby'] = descriptionId.value;
  }

  return merged;
});
const boxAttributes = computed(() => omitAttributes(props.slotProps?.box, ['class']));
const indicatorAttributes = computed(() => omitAttributes(props.slotProps?.indicator, ['class']));
const contentAttributes = computed(() => omitAttributes(props.slotProps?.content, ['class']));
const labelAttributes = computed(() => omitAttributes(props.slotProps?.label, ['class']));
const descriptionAttributes = computed(() =>
  omitAttributes(props.slotProps?.description, ['class'])
);

function normalizeValue(value: CheckboxModelValue | null | undefined): CheckboxModelValue {
  if (value === 'indeterminate') {
    return 'indeterminate';
  }

  return Boolean(value);
}

function omitAttributes(source: CheckboxSlotAttributes | undefined, keys: string[]) {
  if (!source) {
    return {};
  }

  const blocked = new Set(keys);

  return Object.fromEntries(Object.entries(source).filter(([key]) => !blocked.has(key)));
}

function setValue(value: CheckboxModelValue) {
  const nextValue = normalizeValue(value);

  if (!isControlled.value) {
    internalValue.value = nextValue;
  }

  emit('update:modelValue', nextValue);
  emit('change', nextValue);
}

function toggleFromContent(event: MouseEvent) {
  if (!props.labelClickable || props.disabled) {
    return;
  }

  event.preventDefault();
  setValue(internalValue.value === 'indeterminate' ? true : !internalValue.value);
}

function handleFocus(event: FocusEvent) {
  emit('focus', event);
}

function handleBlur(event: FocusEvent) {
  emit('blur', event);
}
</script>

<template>
  <div v-bind="rootAttributes" :class="rootClassName">
    <CheckboxRoot
      v-bind="controlAttributes"
      :id="checkboxId"
      :as="as"
      :as-child="asChild"
      :class="controlClassName"
      :data-slot="'checkbox-control'"
      :disabled="disabled || undefined"
      :model-value="internalValue"
      :name="name"
      :required="required || undefined"
      :value="value"
      @blur="handleBlur"
      @focus="handleFocus"
      @update:model-value="setValue"
    >
      <span v-bind="boxAttributes" :class="boxClassName" data-slot="checkbox-box">
        <CheckboxIndicator
          v-bind="indicatorAttributes"
          :class="indicatorClassName"
          data-slot="checkbox-indicator"
          force-mount
        >
          <Check
            v-if="internalValue === true"
            aria-hidden="true"
            :class="iconClassName"
            data-slot="checkbox-icon"
          />
          <Minus
            v-else-if="internalValue === 'indeterminate'"
            aria-hidden="true"
            :class="iconClassName"
            data-slot="checkbox-icon"
          />
        </CheckboxIndicator>
      </span>
    </CheckboxRoot>

    <span
      v-if="hasContent"
      v-bind="contentAttributes"
      :class="contentClassName"
      data-slot="checkbox-content"
      @click="toggleFromContent"
    >
      <span
        v-if="hasLabel"
        v-bind="labelAttributes"
        :id="labelId"
        :class="labelClassName"
        data-slot="checkbox-label"
      >
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="hasDescription"
        v-bind="descriptionAttributes"
        :id="descriptionId"
        :class="descriptionClassName"
        data-slot="checkbox-description"
      >
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
  </div>
</template>
