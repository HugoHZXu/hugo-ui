<script setup lang="ts">
import { CheckCircle2, CircleAlert } from 'lucide-vue-next';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  DEFAULT_MAX_LENGTH,
  type InputEmits,
  type InputProps,
  type InputSlotAttributes,
} from './input';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputProps>(), {
  as: 'input',
  autoFocus: false,
  disabled: false,
  loading: false,
  placeholder: '',
  required: false,
  rows: 4,
  showCharacterCount: true,
  size: 'default',
  status: 'default',
  type: 'text',
});

const emit = defineEmits<InputEmits>();
const attrs = useAttrs();
const slots = useSlots();

const toValueString = (value: unknown) => (value == null ? '' : String(value));

const fieldUid = ref(Math.random().toString(36).slice(2));
const fieldValue = ref(toValueString(props.modelValue ?? props.value ?? props.defaultValue));
const focusSource = ref<'keyboard' | 'mouse' | undefined>(
  props.autoFocus ? (props.autoFocusSource ?? 'mouse') : undefined
);
const pointerFocus = ref(false);

watch(
  () => [props.modelValue, props.value] as const,
  ([modelValue, value]) => {
    if (modelValue !== undefined) {
      fieldValue.value = toValueString(modelValue);
      return;
    }

    if (value !== undefined) {
      fieldValue.value = toValueString(value);
    }
  }
);

const isTextarea = computed(() => props.as === 'textarea');
const isSearch = computed(() => props.name === 'search');
const hasLabel = computed(() => Boolean(slots.label || props.label));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasMessage = computed(() => Boolean(slots.message || props.message));
const hasStartIcon = computed(() => Boolean(slots['start-icon'] || slots.startIcon));
const hasEndIcon = computed(() => Boolean(slots['end-icon'] || slots.endIcon));
const shouldRenderStatusIcon = computed(
  () => !hasEndIcon.value && props.size === 'sm' && ['success', 'error'].includes(props.status)
);
const shouldRenderHelper = computed(
  () => hasDescription.value || hasMessage.value || (isTextarea.value && props.showCharacterCount)
);

const inputSlotProps = computed(() => props.slotProps?.input);
const textareaSlotProps = computed(() => props.slotProps?.textarea);
const activeFieldSlotProps = computed(() =>
  isTextarea.value ? textareaSlotProps.value : inputSlotProps.value
);

const fieldId = computed(() => {
  const slotId = activeFieldSlotProps.value?.id;

  return String(slotId ?? props.id ?? `hugo-ui-shadcn-vue-input-${fieldUid.value}`);
});
const helperId = computed(() => `${fieldId.value}-helper`);
const labelId = computed(() =>
  hasLabel.value && !isSearch.value ? `${fieldId.value}-label` : undefined
);
const describedBy = computed(() => (shouldRenderHelper.value ? helperId.value : undefined));
const maxLengthValue = computed(() => {
  const slotMaxLength =
    activeFieldSlotProps.value?.maxLength ?? activeFieldSlotProps.value?.maxlength;

  return Number(slotMaxLength ?? props.maxLength ?? DEFAULT_MAX_LENGTH);
});
const placeholderText = computed(() =>
  isSearch.value && typeof props.label === 'string' ? props.label : props.placeholder
);

const rootClassName = computed(() =>
  cn(
    'inline-flex w-60 max-w-full flex-col gap-1 font-sans',
    props.classNames?.root,
    props.class,
    attrs.class
  )
);
const labelClassName = computed(() =>
  cn(
    'text-base font-normal leading-6 tracking-[0.02em] text-hugo-text-default',
    props.size === 'sm' && 'sr-only',
    props.classNames?.label,
    props.slotProps?.label?.class
  )
);
const requiredMarkClassName = computed(() =>
  cn('text-hugo-status-error', props.classNames?.requiredMark)
);
const controlClassName = computed(() =>
  cn(
    'flex min-h-[50px] items-center gap-2 rounded-md border border-hugo-border-strong',
    'bg-hugo-surface-default px-3 pl-4 transition-[border-color,box-shadow] duration-150 ease-linear',
    props.size === 'sm' && 'min-h-[34px] px-2',
    props.status === 'success' && 'border-hugo-status-success',
    props.status === 'error' && 'border-hugo-status-error',
    focusSource.value === 'keyboard' && 'border-2 border-hugo-focus',
    focusSource.value === 'mouse' && 'border-hugo-brand-accent',
    props.disabled && 'border-hugo-border-default text-hugo-text-disabled',
    props.classNames?.control,
    props.slotProps?.control?.class
  )
);
const fieldClassName = computed(() =>
  cn(
    'min-w-0 flex-1 border-0 bg-transparent font-sans text-base font-normal leading-6',
    'w-full tracking-[0.02em] text-hugo-text-primary outline-none',
    'placeholder:text-hugo-text-default placeholder:opacity-[0.76]',
    'disabled:cursor-not-allowed disabled:text-hugo-text-disabled',
    props.size === 'sm' && 'text-sm tracking-[0.01em]',
    isTextarea.value && 'min-h-24 resize-y py-3',
    props.classNames?.field,
    isTextarea.value ? props.classNames?.textarea : props.classNames?.input,
    activeFieldSlotProps.value?.class
  )
);
const adornmentClassName = computed(() =>
  cn('inline-flex shrink-0 items-center text-hugo-text-default', props.classNames?.adornment)
);
const helperClassName = computed(() =>
  cn(
    'flex justify-between gap-3 px-2 pl-4 text-xs font-normal leading-5 text-hugo-text-default',
    props.classNames?.helper,
    props.slotProps?.helper?.class
  )
);
const helperContentClassName = computed(() =>
  cn('inline-flex flex-col gap-1', props.classNames?.helperContent)
);
const statusClassName = computed(() =>
  cn(
    'inline-flex items-center gap-1',
    props.status === 'success' && 'text-hugo-status-success',
    props.status === 'error' && 'text-hugo-status-error',
    props.classNames?.status
  )
);
const spinnerClassName = computed(() =>
  cn(
    'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
    props.classNames?.spinner
  )
);
const counterClassName = computed(() =>
  cn('shrink-0 text-hugo-text-subtle', props.classNames?.counter)
);
const resolvedEndIcon = computed(
  () => props.loading || hasEndIcon.value || shouldRenderStatusIcon.value
);

const rootDataAttributes = computed(() => ({
  'data-component': 'hugo-input',
  'data-disabled': props.disabled ? 'true' : undefined,
  'data-focus': focusSource.value,
  'data-size': props.size,
  'data-slot': 'root',
  'data-status': props.status,
}));
const labelAttributes = computed(() => omitAttributes(props.slotProps?.label, ['class']));
const controlAttributes = computed(() =>
  omitAttributes(props.slotProps?.control, ['class', 'onMousedown', 'onMouseDown'])
);
const helperAttributes = computed(() => omitAttributes(props.slotProps?.helper, ['class']));
const fieldAttributes = computed(() =>
  omitAttributes(attrs as InputSlotAttributes, [
    'class',
    'id',
    'value',
    'defaultValue',
    'modelValue',
    'maxlength',
    'maxLength',
    'placeholder',
    'disabled',
    'required',
    'name',
    'type',
    'rows',
  ])
);
const inputAttributes = computed(() =>
  omitAttributes(inputSlotProps.value, [
    'class',
    'id',
    'value',
    'defaultValue',
    'modelValue',
    'maxlength',
    'maxLength',
    'placeholder',
    'disabled',
    'required',
    'name',
    'type',
    'onBlur',
    'onChange',
    'onFocus',
    'onInput',
    'onKeyDown',
    'onKeydown',
  ])
);
const textareaAttributes = computed(() =>
  omitAttributes(textareaSlotProps.value, [
    'class',
    'id',
    'value',
    'defaultValue',
    'modelValue',
    'maxlength',
    'maxLength',
    'placeholder',
    'disabled',
    'required',
    'name',
    'rows',
    'onBlur',
    'onChange',
    'onFocus',
    'onInput',
    'onKeyDown',
    'onKeydown',
  ])
);

function omitAttributes(source: InputSlotAttributes | undefined, keys: string[]) {
  if (!source) {
    return {};
  }

  const blocked = new Set(keys);

  return Object.fromEntries(Object.entries(source).filter(([key]) => !blocked.has(key)));
}

function invokeSlotHandlers(
  source: InputSlotAttributes | undefined,
  names: string[],
  event: Event
) {
  names.forEach((name) => {
    const handler = source?.[name];

    if (Array.isArray(handler)) {
      handler.forEach((item) => {
        if (typeof item === 'function') {
          item(event);
        }
      });
      return;
    }

    if (typeof handler === 'function') {
      handler(event);
    }
  });
}

function handleInput(event: Event) {
  fieldValue.value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  emit('update:modelValue', fieldValue.value);
  emit('input', event);
  emit('change', event);
  invokeSlotHandlers(activeFieldSlotProps.value, ['onInput', 'onChange'], event);
}

function handleFocus(event: FocusEvent) {
  focusSource.value = pointerFocus.value ? 'mouse' : 'keyboard';
  pointerFocus.value = false;
  emit('focus', event);
  invokeSlotHandlers(activeFieldSlotProps.value, ['onFocus'], event);
}

function handleBlur(event: FocusEvent) {
  focusSource.value = undefined;
  emit('blur', event);
  invokeSlotHandlers(activeFieldSlotProps.value, ['onBlur'], event);
}

function handleKeydown(event: KeyboardEvent) {
  if (!isTextarea.value && event.key === 'Enter') {
    emit('blur', event as unknown as FocusEvent);
    (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).blur();
  }

  emit('keydown', event);
  invokeSlotHandlers(activeFieldSlotProps.value, ['onKeyDown', 'onKeydown'], event);
}

function handleControlMousedown(event: MouseEvent) {
  pointerFocus.value = true;
  invokeSlotHandlers(props.slotProps?.control, ['onMouseDown', 'onMousedown'], event);
}
</script>

<template>
  <div :class="rootClassName" v-bind="rootDataAttributes">
    <label
      v-if="hasLabel && !isSearch"
      v-bind="labelAttributes"
      :id="labelId"
      :class="labelClassName"
      data-slot="label"
      :for="fieldId"
    >
      <span>
        <slot name="label">{{ label }}</slot>
      </span>
      <span
        v-if="required"
        aria-hidden="true"
        :class="requiredMarkClassName"
        data-slot="required-mark"
      >
        *
      </span>
    </label>
    <div
      v-bind="controlAttributes"
      :class="controlClassName"
      data-slot="control"
      @mousedown="handleControlMousedown"
    >
      <span v-if="hasStartIcon" :class="adornmentClassName" data-slot="adornment">
        <slot v-if="$slots['start-icon']" name="start-icon" />
        <slot v-else name="startIcon" />
      </span>
      <textarea
        v-if="isTextarea"
        v-bind="{ ...fieldAttributes, ...textareaAttributes }"
        :id="fieldId"
        :aria-busy="loading || undefined"
        :aria-describedby="describedBy"
        :aria-invalid="status === 'error' || undefined"
        :aria-labelledby="labelId"
        :aria-required="required || undefined"
        :autofocus="autoFocus || undefined"
        :class="fieldClassName"
        data-slot="textarea"
        :disabled="disabled || undefined"
        :maxlength="maxLengthValue"
        :name="name"
        :placeholder="placeholderText"
        :required="required || undefined"
        :rows="Number(textareaSlotProps?.rows ?? rows)"
        :value="fieldValue"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <input
        v-else
        v-bind="{ ...fieldAttributes, ...inputAttributes }"
        :id="fieldId"
        :aria-busy="loading || undefined"
        :aria-describedby="describedBy"
        :aria-invalid="status === 'error' || undefined"
        :aria-labelledby="labelId"
        :aria-required="required || undefined"
        :autofocus="autoFocus || undefined"
        :class="fieldClassName"
        data-slot="input"
        :disabled="disabled || undefined"
        :maxlength="maxLengthValue"
        :name="name"
        :placeholder="placeholderText"
        :required="required || undefined"
        :type="type"
        :value="fieldValue"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <span v-if="resolvedEndIcon" :class="adornmentClassName" data-slot="adornment">
        <span v-if="loading" aria-hidden="true" :class="spinnerClassName" data-slot="spinner" />
        <slot v-else-if="$slots['end-icon']" name="end-icon" />
        <slot v-else-if="$slots.endIcon" name="endIcon" />
        <CheckCircle2
          v-else-if="status === 'success'"
          aria-hidden="true"
          :class="classNames?.status"
          data-slot="status"
          data-status="success"
          :size="18"
        />
        <CircleAlert
          v-else-if="status === 'error'"
          aria-hidden="true"
          :class="classNames?.status"
          data-slot="status"
          data-status="error"
          :size="18"
        />
      </span>
    </div>
    <div
      v-if="shouldRenderHelper"
      v-bind="helperAttributes"
      :id="helperId"
      :class="helperClassName"
      data-slot="helper"
    >
      <span :class="helperContentClassName" data-slot="helper-content">
        <span
          v-if="hasMessage && (status === 'success' || status === 'error')"
          :class="statusClassName"
          data-slot="status"
          :data-status="status"
        >
          <CheckCircle2 v-if="status === 'success'" aria-hidden="true" :size="16" />
          <CircleAlert v-else aria-hidden="true" :size="16" />
          <slot name="message">{{ message }}</slot>
        </span>
        <slot v-else-if="hasMessage" name="message">{{ message }}</slot>
        <span v-if="hasDescription">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
      <span v-if="isTextarea && showCharacterCount" :class="counterClassName" data-slot="counter">
        {{ fieldValue.length }}/{{ maxLengthValue }}
      </span>
    </div>
  </div>
</template>
