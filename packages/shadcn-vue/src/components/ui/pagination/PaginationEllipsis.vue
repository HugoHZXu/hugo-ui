<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { MoreHorizontal } from 'lucide-vue-next';
import { PaginationEllipsis as RekaPaginationEllipsis } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationEllipsisClass, type PaginationEllipsisProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<PaginationEllipsisProps>();
const attrs = useAttrs();

const delegatedProps = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});

const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const rootClassName = computed(() => cn(paginationEllipsisClass, props.class, attrs.class));
</script>

<template>
  <RekaPaginationEllipsis
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :class="rootClassName"
    data-slot="pagination-ellipsis"
  >
    <slot>
      <MoreHorizontal aria-hidden="true" />
      <span class="sr-only">More pages</span>
    </slot>
  </RekaPaginationEllipsis>
</template>
