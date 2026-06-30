<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { PaginationRoot as RekaPaginationRoot } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationRootClass, type PaginationEmits, type PaginationProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationProps>(), {
  ariaLabel: 'Pagination',
  as: 'nav',
  defaultPage: 1,
  disabled: false,
  itemsPerPage: 1,
  showEdges: false,
  siblingCount: 2,
  total: 0,
});

const emit = defineEmits<PaginationEmits>();
const attrs = useAttrs();

const delegatedProps = computed(() => {
  const { ariaLabel: _ariaLabel, class: _class, ...rest } = props;
  return rest;
});

const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const rootClassName = computed(() => cn(paginationRootClass, props.class, attrs.class));
</script>

<template>
  <RekaPaginationRoot
    v-slot="slotProps"
    v-bind="{ ...passthroughAttrs, ...delegatedProps }"
    :aria-label="ariaLabel"
    :class="rootClassName"
    data-component="hugo-pagination"
    data-slot="pagination"
    @update:page="emit('update:page', $event)"
  >
    <slot v-bind="slotProps" />
  </RekaPaginationRoot>
</template>
