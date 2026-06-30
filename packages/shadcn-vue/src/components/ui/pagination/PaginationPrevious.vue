<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ChevronLeft } from 'lucide-vue-next';
import { PaginationPrev as RekaPaginationPrev } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationControlVariants, type PaginationPreviousProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationPreviousProps>(), {
  as: 'button',
  asChild: false,
  label: 'Previous',
  showLabel: true,
  size: 'default',
});

const attrs = useAttrs();

const delegatedProps = computed(() => {
  const {
    class: _class,
    label: _label,
    showLabel: _showLabel,
    size: _size,
    ...rest
  } = props;

  return rest;
});

const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const rootClassName = computed(() =>
  cn(
    paginationControlVariants({ size: props.size }),
    props.showLabel ? 'px-3' : 'px-0',
    props.class,
    attrs.class
  )
);
</script>

<template>
  <RekaPaginationPrev
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :class="rootClassName"
    data-slot="pagination-previous"
  >
    <slot>
      <ChevronLeft aria-hidden="true" />
      <span v-if="showLabel">{{ label }}</span>
      <span v-else class="sr-only">{{ label }}</span>
    </slot>
  </RekaPaginationPrev>
</template>
