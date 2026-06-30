<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { PaginationListItem as RekaPaginationListItem, Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { paginationControlVariants, type PaginationItemProps } from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationItemProps>(), {
  asChild: false,
  isActive: false,
  size: 'default',
});

const attrs = useAttrs();

const isPageItem = computed(() => typeof props.value === 'number');

const pageItemProps = computed(() => {
  const {
    as: _as,
    asChild: _asChild,
    class: _class,
    isActive: _isActive,
    size: _size,
    value: _value,
    ...rest
  } = props;

  return rest;
});

const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const pageClassName = computed(() =>
  cn(
    paginationControlVariants({
      active: props.isActive,
      iconOnly: true,
      size: props.size,
    }),
    props.class,
    attrs.class
  )
);

const wrapperClassName = computed(() => cn('list-none', props.class, attrs.class));
const resolvedPageValue = computed(() => props.value ?? 1);
</script>

<template>
  <RekaPaginationListItem
    v-if="isPageItem"
    v-bind="{ ...passthroughAttrs, ...pageItemProps }"
    :as="as ?? 'button'"
    :as-child="asChild"
    :class="pageClassName"
    data-slot="pagination-item"
    :value="resolvedPageValue"
  >
    <slot>{{ value }}</slot>
  </RekaPaginationListItem>
  <Primitive
    v-else
    v-bind="{ ...passthroughAttrs, class: undefined }"
    :as="as ?? 'div'"
    :as-child="asChild"
    :class="wrapperClassName"
    data-slot="pagination-item"
  >
    <slot />
  </Primitive>
</template>
