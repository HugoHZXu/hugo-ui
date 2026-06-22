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
  cn(
    'grid auto-rows-min items-start gap-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
    props.class,
    attrs.class
  )
);
</script>

<template>
  <Primitive v-bind="{ ...attrs, class: undefined }" :as="as" :class="className" data-slot="card-header">
    <slot />
  </Primitive>
</template>
