<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { ChevronsLeft } from 'lucide-vue-next';
import { PaginationFirst as RekaPaginationFirst } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationControlVariants, type PaginationFirstProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationFirstProps>(), {
  as: 'button',
  asChild: false,
  label: 'First',
  showLabel: false,
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
  <RekaPaginationFirst
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :class="rootClassName"
    data-slot="pagination-first"
  >
    <slot>
      <ChevronsLeft aria-hidden="true" />
      <span v-if="showLabel">{{ label }}</span>
      <span v-else class="sr-only">{{ label }}</span>
    </slot>
  </RekaPaginationFirst>
</template>
