<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { PaginationList as RekaPaginationList } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import {
  paginationContentClass,
  type PaginationContentProps,
} from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationContentProps>(), {
  as: 'div',
});

const attrs = useAttrs();

const delegatedProps = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});

const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const rootClassName = computed(() => cn(paginationContentClass, props.class, attrs.class));
</script>

<template>
  <RekaPaginationList
    v-slot="slotProps"
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :class="rootClassName"
    data-slot="pagination-content"
  >
    <slot v-bind="slotProps" />
  </RekaPaginationList>
</template>
