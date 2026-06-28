<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';
import { computed, ref, useAttrs, useSlots } from 'vue';

import { cn } from '@/components/lib/utils';
import { emptyStateIconVariants, emptyStateRootVariants, type EmptyStateProps } from './emptyState';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<EmptyStateProps>(), {
  componentName: 'hugo-empty-state',
  role: undefined,
  tone: 'neutral',
  variant: 'section',
});

const attrs = useAttrs();
const slots = useSlots();
const emptyStateUid = ref(Math.random().toString(36).slice(2));

const titleId = computed(() => `hugo-ui-shadcn-vue-empty-state-${emptyStateUid.value}`);
const resolvedIcon = computed(() => props.icon ?? Inbox);
const hasIcon = computed(() => Boolean(slots.icon || resolvedIcon.value));
const hasDescription = computed(() => Boolean(slots.description || props.description));
const hasAction = computed(() => Boolean(slots.action || slots.actions));

const rootClassName = computed(() =>
  cn(
    emptyStateRootVariants({ variant: props.variant }),
    props.classNames?.root,
    props.class,
    attrs.class
  )
);
const iconClassName = computed(() =>
  cn(
    emptyStateIconVariants({
      tone: props.tone,
      variant: props.variant,
    }),
    props.classNames?.icon
  )
);
const contentClassName = computed(() =>
  cn(
    'flex min-w-0 flex-col',
    props.variant === 'compact' ? 'gap-1' : 'items-center gap-2',
    props.classNames?.content
  )
);
const titleClassName = computed(() =>
  cn(
    'm-0 font-semibold text-hugo-text-primary',
    props.variant === 'page' && 'text-xl leading-7',
    props.variant === 'section' && 'text-lg leading-7',
    props.variant === 'table' && 'text-base leading-6',
    props.variant === 'compact' && 'text-sm leading-5',
    props.classNames?.title
  )
);
const descriptionClassName = computed(() =>
  cn(
    'm-0 max-w-prose text-hugo-text-subtle',
    props.variant === 'compact' ? 'text-xs leading-4' : 'text-sm leading-5',
    props.classNames?.description
  )
);
const actionClassName = computed(() =>
  cn(
    'flex flex-wrap items-center gap-2',
    props.variant !== 'compact' && 'justify-center',
    props.classNames?.action
  )
);
</script>

<template>
  <section
    v-bind="{ ...attrs, class: undefined }"
    :aria-labelledby="titleId"
    :class="rootClassName"
    :data-component="componentName"
    data-slot="empty-state"
    :data-tone="tone"
    :data-variant="variant"
    :role="role"
  >
    <div v-if="hasIcon" :class="iconClassName" data-slot="empty-state-icon">
      <slot name="icon">
        <component :is="resolvedIcon" aria-hidden="true" />
      </slot>
    </div>
    <div :class="contentClassName" data-slot="empty-state-content">
      <h3 :id="titleId" :class="titleClassName" data-slot="empty-state-title">
        <slot name="title">{{ title }}</slot>
      </h3>
      <p v-if="hasDescription" :class="descriptionClassName" data-slot="empty-state-description">
        <slot name="description">{{ description }}</slot>
      </p>
    </div>
    <div v-if="hasAction" :class="actionClassName" data-slot="empty-state-action">
      <slot name="action">
        <slot name="actions" />
      </slot>
    </div>
  </section>
</template>
