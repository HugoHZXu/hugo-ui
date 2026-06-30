<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import { PaginationNext as RekaPaginationNext } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationControlVariants, type PaginationNextProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationNextProps>(), {
  as: 'button',
  asChild: false,
  label: 'Next',
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
  <RekaPaginationNext
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :class="rootClassName"
    data-slot="pagination-next"
  >
    <slot>
      <span v-if="showLabel">{{ label }}</span>
      <span v-else class="sr-only">{{ label }}</span>
      <ChevronRight aria-hidden="true" />
    </slot>
  </RekaPaginationNext>
</template>
