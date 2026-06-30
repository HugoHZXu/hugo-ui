<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import {
  paginationControlVariants,
  type PaginationLinkEmits,
  type PaginationLinkProps,
} from './pagination';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PaginationLinkProps>(), {
  as: 'a',
  asChild: false,
  disabled: false,
  isActive: false,
  size: 'default',
  type: 'button',
});

const emit = defineEmits<PaginationLinkEmits>();
const attrs = useAttrs();

const isNativeButton = computed(() => !props.asChild && props.as === 'button');

const passthroughAttrs = computed(() => {
  const {
    class: _class,
    href: _href,
    tabindex: _tabindex,
    type: _type,
    ...rest
  } = attrs;

  return rest;
});

const resolvedHref = computed(() => (props.disabled || isNativeButton.value ? undefined : props.href));

const rootClassName = computed(() =>
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

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <Primitive
    v-bind="passthroughAttrs"
    :as="as"
    :as-child="asChild"
    :aria-current="isActive ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    :class="rootClassName"
    :data-active="isActive ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    data-slot="pagination-link"
    :disabled="isNativeButton ? disabled : undefined"
    :href="resolvedHref"
    :tabindex="disabled ? -1 : attrs.tabindex"
    :type="isNativeButton ? type : undefined"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
