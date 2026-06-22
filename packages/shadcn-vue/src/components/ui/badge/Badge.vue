<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { badgeVariants, type BadgeProps } from './badge';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span',
  asChild: false,
  tone: 'neutral',
});

const attrs = useAttrs();

const rootClassName = computed(() =>
  cn(
    badgeVariants({
      tone: props.tone,
    }),
    props.class,
    attrs.class
  )
);
</script>

<template>
  <Primitive
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :as-child="asChild"
    :class="rootClassName"
    data-slot="badge"
    :data-tone="tone"
  >
    <slot />
  </Primitive>
</template>
