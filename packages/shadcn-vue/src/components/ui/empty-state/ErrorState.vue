<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next';
import { computed, useSlots } from 'vue';

import EmptyState from './EmptyState.vue';
import type { ErrorStateProps } from './emptyState';

const props = withDefaults(defineProps<ErrorStateProps>(), {
  retryable: false,
  title: 'Unable to load content',
  variant: 'section',
});

const slots = useSlots();

const resolvedIcon = computed(() => props.icon ?? CircleAlert);
const hasDescriptionSlot = computed(() =>
  Boolean(slots.description || props.description || props.errorCode)
);
</script>

<template>
  <EmptyState
    :class="props.class"
    :class-names="classNames"
    component-name="hugo-error-state"
    :data-error-code="errorCode ?? undefined"
    :data-retryable="retryable ? 'true' : undefined"
    :description="description"
    :icon="resolvedIcon"
    role="alert"
    :title="title"
    tone="danger"
    :variant="variant"
  >
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <template v-if="hasDescriptionSlot" #description>
      <slot name="description">
        <span v-if="description">{{ description }}</span>
      </slot>
      <span v-if="errorCode" :class="classNames?.code" data-slot="error-state-code">
        Code {{ errorCode }}
      </span>
    </template>
    <template v-if="$slots.action || $slots.actions" #action>
      <slot name="action">
        <slot name="actions" />
      </slot>
    </template>
  </EmptyState>
</template>
