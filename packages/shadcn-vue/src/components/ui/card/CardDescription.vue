<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import type { CardSectionProps } from './card';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CardSectionProps>(), {
  as: 'div',
});

const attrs = useAttrs();

const className = computed(() =>
  cn('text-sm leading-6 text-hugo-text-default', props.class, attrs.class)
);
</script>

<template>
  <Primitive
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :class="className"
    data-slot="card-description"
  >
    <slot />
  </Primitive>
</template>
