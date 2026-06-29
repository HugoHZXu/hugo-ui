<script setup lang="ts">
import {
  ProgressIndicator as RekaProgressIndicator,
  ProgressRoot as RekaProgressRoot,
} from 'reka-ui';
import { computed, ref, useAttrs, useSlots } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  getProgressPercent,
  progressIndicatorVariants,
  progressTrackVariants,
  type ProgressProps,
} from './progress';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ProgressProps>(), {
  indeterminate: false,
  max: 100,
  showValue: false,
  size: 'default',
  tone: 'default',
});

const attrs = useAttrs();
const slots = useSlots();
const progressUid = ref(Math.random().toString(36).slice(2));

const rawValue = computed(() => props.modelValue ?? props.value ?? null);
const progressValue = computed(() => (props.indeterminate ? null : rawValue.value));
const percent = computed(() => getProgressPercent(progressValue.value, props.max));
const labelId = computed(() => `hugo-ui-shadcn-vue-progress-${progressUid.value}`);
const hasLabel = computed(() => Boolean(slots.label || props.label));
const shouldShowValue = computed(
  () => props.showValue && !props.indeterminate && percent.value != null
);
const valueText = computed(() => {
  if (props.indeterminate) {
    return 'Loading';
  }

  if (props.valueLabel != null) {
    return String(props.valueLabel);
  }

  return percent.value == null ? undefined : `${percent.value}%`;
});
const rootClassName = computed(() =>
  cn(
    'flex w-full min-w-0 flex-col gap-2 font-sans',
    props.classNames?.root,
    props.class,
    attrs.class
  )
);
const headerClassName = computed(() =>
  cn('flex min-w-0 items-center justify-between gap-3', props.classNames?.header)
);
const labelClassName = computed(() =>
  cn('min-w-0 text-sm font-medium leading-5 text-hugo-text-primary', props.classNames?.label)
);
const valueClassName = computed(() =>
  cn('shrink-0 text-sm font-semibold leading-5 text-hugo-text-subtle', props.classNames?.value)
);
const trackClassName = computed(() =>
  cn(progressTrackVariants({ size: props.size }), props.classNames?.track)
);
const indicatorClassName = computed(() =>
  cn(
    progressIndicatorVariants({
      indeterminate: props.indeterminate,
      tone: props.tone,
    }),
    props.classNames?.indicator
  )
);
const indicatorStyle = computed(() => {
  if (props.indeterminate) {
    return {
      transform: 'translateX(0)',
    };
  }

  return {
    width: `${percent.value ?? 0}%`,
  };
});
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    :class="rootClassName"
    data-component="hugo-progress"
    data-slot="progress"
    :data-indeterminate="indeterminate ? 'true' : undefined"
    :data-size="size"
    :data-tone="tone"
  >
    <div v-if="hasLabel || shouldShowValue" :class="headerClassName" data-slot="progress-header">
      <div v-if="hasLabel" :id="labelId" :class="labelClassName" data-slot="progress-label">
        <slot name="label">{{ label }}</slot>
      </div>
      <div v-if="shouldShowValue" :class="valueClassName" data-slot="progress-value">
        <slot name="value">{{ valueText }}</slot>
      </div>
    </div>
    <RekaProgressRoot
      :aria-label="!hasLabel ? ariaLabel : undefined"
      :aria-labelledby="hasLabel ? labelId : undefined"
      :class="trackClassName"
      data-slot="progress-track"
      :get-value-text="() => valueText"
      :max="max"
      :model-value="progressValue"
    >
      <RekaProgressIndicator
        :class="indicatorClassName"
        data-slot="progress-indicator"
        :style="indicatorStyle"
      />
    </RekaProgressRoot>
  </div>
</template>
