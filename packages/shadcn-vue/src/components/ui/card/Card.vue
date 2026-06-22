<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import type { CardProps } from './card';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CardProps>(), {
  as: 'div',
  clickable: false,
  size: 'default',
});

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent];
  keydown: [event: KeyboardEvent];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();

const hasClickListener = computed(() => Boolean(instance?.vnode.props?.onClick));
const isClickable = computed(() => props.clickable || hasClickListener.value);

const rootClassName = computed(() =>
  cn(
    [
      'group/card box-border grid min-w-0 gap-[14px] rounded-lg border border-hugo-neutral-500',
      'bg-card p-[18px] text-sm text-card-foreground shadow-sm outline-none',
      'transition-[background-color,border-color,box-shadow] duration-150 ease-linear',
      'data-[clickable=true]:cursor-pointer data-[clickable=true]:hover:border-hugo-neutral-800',
      'data-[clickable=true]:hover:bg-hugo-surface-tinted data-[clickable=true]:hover:shadow-hugo-medium',
      'data-[clickable=true]:focus-visible:border-hugo-neutral-800 data-[clickable=true]:focus-visible:ring-2',
      'data-[clickable=true]:focus-visible:ring-hugo-focus data-[clickable=true]:focus-visible:ring-offset-0',
      'data-[size=sm]:gap-3 data-[size=sm]:p-4',
    ],
    props.class,
    attrs.class
  )
);

function handleClick(event: MouseEvent) {
  emit('click', event);
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event);

  if (event.defaultPrevented || !isClickable.value) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('click', event);
  }
}
</script>

<template>
  <Primitive
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :class="rootClassName"
    :data-clickable="isClickable ? 'true' : undefined"
    :data-size="size"
    data-slot="card"
    :role="attrs.role ?? (isClickable ? 'button' : undefined)"
    :tabindex="attrs.tabindex ?? (isClickable ? 0 : undefined)"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </Primitive>
</template>
