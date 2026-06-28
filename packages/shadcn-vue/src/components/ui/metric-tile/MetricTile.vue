<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  metricTileIconClass,
  metricTileRootVariants,
  metricTileToneTextClass,
  type MetricTileProps,
} from './metricTile';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<MetricTileProps>(), {
  compact: false,
  loading: false,
  tone: 'neutral',
  trend: 'neutral',
});

const attrs = useAttrs();
const slots = useSlots();

const hasIcon = computed(() => Boolean(slots.icon || props.icon));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasDelta = computed(() => Boolean(slots.delta || props.delta));

const rootClassName = computed(() =>
  cn(
    metricTileRootVariants({
      compact: props.compact,
      tone: props.tone,
    }),
    props.classNames?.root,
    props.class,
    attrs.class
  )
);
const headerClassName = computed(() =>
  cn('flex min-w-0 items-start justify-between gap-3', props.classNames?.header)
);
const labelClassName = computed(() =>
  cn(
    'min-w-0 truncate text-sm font-medium leading-5 text-hugo-text-subtle',
    props.compact && 'text-xs leading-4',
    props.classNames?.label
  )
);
const iconClassName = computed(() =>
  cn(
    'grid shrink-0 place-items-center rounded-md',
    props.compact ? 'size-8 [&_svg]:size-4' : 'size-9 [&_svg]:size-5',
    metricTileIconClass[props.tone],
    props.classNames?.icon
  )
);
const valueClassName = computed(() =>
  cn(
    'min-w-0 break-words font-semibold text-hugo-text-primary',
    props.compact ? 'text-xl leading-7' : 'text-2xl leading-8',
    props.classNames?.value
  )
);
const descriptionClassName = computed(() =>
  cn(
    'text-sm leading-5 text-hugo-text-subtle',
    props.compact && 'text-xs leading-4',
    props.classNames?.description
  )
);
const deltaClassName = computed(() =>
  cn(
    'inline-flex w-fit items-center rounded-full text-xs font-semibold leading-4',
    props.compact ? 'px-0' : 'px-0.5',
    metricTileToneTextClass[props.tone],
    props.classNames?.delta
  )
);
const skeletonClassName = computed(() =>
  cn(
    'h-8 w-24 animate-pulse rounded-md bg-hugo-surface-subtle',
    props.compact && 'h-7 w-20',
    props.classNames?.skeleton
  )
);
</script>

<template>
  <article
    v-bind="{ ...attrs, class: undefined }"
    :aria-busy="loading || undefined"
    :class="rootClassName"
    data-component="hugo-metric-tile"
    data-slot="metric-tile"
    :data-compact="compact ? 'true' : undefined"
    :data-loading="loading ? 'true' : undefined"
    :data-tone="tone"
    :data-trend="trend"
  >
    <div :class="headerClassName" data-slot="metric-tile-header">
      <div :class="labelClassName" data-slot="metric-tile-label">
        <slot name="label">{{ label }}</slot>
      </div>
      <div v-if="hasIcon" :class="iconClassName" data-slot="metric-tile-icon">
        <slot name="icon">
          <component :is="icon" v-if="icon" aria-hidden="true" />
        </slot>
      </div>
    </div>

    <div v-if="loading" data-slot="metric-tile-loading">
      <span class="sr-only">Loading metric</span>
      <div aria-hidden="true" :class="skeletonClassName" data-slot="metric-tile-skeleton" />
    </div>
    <template v-else>
      <div :class="valueClassName" data-slot="metric-tile-value">
        <slot>{{ value }}</slot>
      </div>
      <div
        v-if="hasDescription || hasDelta"
        class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"
        data-slot="metric-tile-supporting"
      >
        <span v-if="hasDelta" :class="deltaClassName" data-slot="metric-tile-delta">
          <slot name="delta">{{ delta }}</slot>
        </span>
        <span
          v-if="hasDescription"
          :class="descriptionClassName"
          data-slot="metric-tile-description"
        >
          <slot name="description">{{ description }}</slot>
        </span>
      </div>
    </template>
  </article>
</template>
