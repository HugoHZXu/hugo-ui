<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import {
  formatStatusLabel,
  resolveStatusTone,
  statusBadgeVariants,
  type StatusBadgeProps,
} from './statusBadge';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  as: 'span',
  asChild: false,
  showDot: false,
  showIcon: true,
  size: 'md',
  variant: 'soft',
});

const attrs = useAttrs();
const slots = useSlots();

const resolvedTone = computed(() => props.tone ?? resolveStatusTone(props.status));
const resolvedLabel = computed(() => props.label ?? formatStatusLabel(props.status));
const hasIcon = computed(() => props.showIcon && Boolean(slots.icon || props.icon));
const hasLabel = computed(() => Boolean(slots.default || resolvedLabel.value));

const rootClassName = computed(() =>
  cn(
    statusBadgeVariants({
      size: props.size,
      tone: resolvedTone.value,
      variant: props.variant,
    }),
    props.class,
    attrs.class
  )
);
const dotClassName = computed(() =>
  cn('rounded-full bg-current', props.size === 'sm' ? 'size-1.5' : 'size-2')
);
</script>

<template>
  <Primitive
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :as-child="asChild"
    :class="rootClassName"
    data-component="hugo-status-badge"
    data-slot="status-badge"
    :data-size="size"
    :data-status="status ?? undefined"
    :data-tone="resolvedTone"
    :data-variant="variant"
  >
    <span v-if="showDot" aria-hidden="true" :class="dotClassName" data-slot="status-badge-dot" />
    <span v-if="hasIcon" aria-hidden="true" data-slot="status-badge-icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
    <span v-if="hasLabel" data-slot="status-badge-label">
      <slot>{{ resolvedLabel }}</slot>
    </span>
  </Primitive>
</template>
