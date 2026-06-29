<script setup lang="ts">
import { computed, useAttrs, useSlots, type VNode } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { linkVariants, type LinkProps } from './link';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LinkProps>(), {
  as: 'a',
  asChild: false,
  disabled: false,
  loading: false,
  mode: 'white',
  size: 'medium',
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();
const slots = useSlots();

const isInactive = computed(() => props.disabled || props.loading);
const isNativeButton = computed(() => !props.asChild && props.as === 'button');
const slotText = computed(() => getSlotText(slots.default?.()));

const passthroughAttrs = computed(() => {
  const {
    class: _class,
    href: _href,
    rel: _rel,
    tabindex: _tabindex,
    target: _target,
    type: _type,
    'aria-label': _ariaLabel,
    ...rest
  } = attrs;

  return rest;
});

const resolvedAriaLabel = computed(() => {
  if (isInactive.value) {
    return undefined;
  }

  const customLabel = attrs['aria-label'];
  const label = customLabel == null ? slotText.value : String(customLabel);

  if (!label) {
    return undefined;
  }

  return props.target === '_blank' ? `${label} (opens in new page)` : label;
});

const resolvedHref = computed(() => {
  if (isInactive.value || isNativeButton.value) {
    return undefined;
  }

  return props.href;
});

const resolvedRel = computed(() =>
  props.target === '_blank' && !props.rel ? 'noreferrer' : props.rel
);

const rootClassName = computed(() =>
  cn(
    linkVariants({
      mode: props.mode,
      size: props.size,
    }),
    props.class,
    attrs.class
  )
);

const spinnerClassName = computed(() =>
  cn(
    'rounded-full border-2 border-current border-t-transparent animate-spin',
    props.size === 'small' ? 'h-3 w-3' : 'h-4 w-4'
  )
);

function getSlotText(nodes: VNode[] | undefined): string {
  return (nodes ?? [])
    .map((node) => {
      if (typeof node.children === 'string') {
        return node.children;
      }

      if (Array.isArray(node.children)) {
        return getSlotText(node.children as VNode[]);
      }

      return '';
    })
    .join('')
    .trim();
}

function handleClick(event: MouseEvent) {
  if (isInactive.value) {
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
    :aria-busy="loading || undefined"
    :aria-disabled="!isNativeButton && isInactive ? true : undefined"
    :aria-label="resolvedAriaLabel"
    :class="rootClassName"
    data-component="hugo-link"
    :data-disabled="disabled ? 'true' : undefined"
    :data-loading="loading ? 'true' : undefined"
    :data-mode="mode"
    :data-size="size"
    data-slot="link"
    :disabled="isNativeButton ? isInactive : undefined"
    :href="resolvedHref"
    :rel="resolvedRel"
    :tabindex="isInactive ? -1 : attrs.tabindex"
    :target="target"
    :type="isNativeButton ? type : undefined"
    @click="handleClick"
  >
    <span
      v-if="loading"
      aria-hidden="true"
      :class="spinnerClassName"
      data-slot="link-spinner"
    />
    <slot />
  </Primitive>
</template>
