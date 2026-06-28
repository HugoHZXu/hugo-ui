<script setup lang="ts">
import { DropdownMenuItem as RekaDropdownMenuItem } from 'reka-ui';
import { computed, useAttrs, useSlots } from 'vue';

import { cn } from '@/components/lib/utils';
import type { DropdownMenuItemEmits, DropdownMenuItemProps } from './dropdownMenu';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DropdownMenuItemProps>(), {
  as: 'div',
  asChild: false,
  destructive: false,
  disabled: false,
});

const emit = defineEmits<DropdownMenuItemEmits>();
const attrs = useAttrs();
const slots = useSlots();

const hasIcon = computed(() => Boolean(slots.icon || props.icon));
const hasShortcut = computed(() => Boolean(slots.shortcut || props.shortcut));

const rootClassName = computed(() =>
  cn(
    'relative flex min-h-9 cursor-default select-none items-center gap-2 rounded-sm px-2.5 py-2',
    'text-sm leading-5 outline-none transition-colors duration-150 ease-linear',
    'data-[highlighted]:bg-hugo-surface-tinted data-[highlighted]:text-hugo-brand-deep',
    'data-[disabled]:pointer-events-none data-[disabled]:text-hugo-text-disabled',
    props.destructive &&
      'text-hugo-status-error data-[highlighted]:bg-hugo-error-bg data-[highlighted]:text-hugo-status-error',
    props.class,
    attrs.class
  )
);
const iconClassName = computed(() =>
  cn(
    'grid size-5 shrink-0 place-items-center text-current [&_svg]:size-4',
    props.disabled && 'text-hugo-text-disabled'
  )
);
const labelClassName = computed(() => cn('min-w-0 flex-1 truncate'));
const shortcutClassName = computed(() =>
  cn(
    'ml-4 shrink-0 text-xs leading-4 text-hugo-text-subtle',
    props.disabled && 'text-hugo-text-disabled'
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

function handleSelect(event: Event) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('select', event);
}
</script>

<template>
  <RekaDropdownMenuItem
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :as-child="asChild"
    :class="rootClassName"
    :data-destructive="destructive ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    data-slot="dropdown-menu-item"
    :disabled="disabled || undefined"
    :text-value="textValue"
    @click="handleClick"
    @select="handleSelect"
  >
    <span v-if="hasIcon" aria-hidden="true" :class="iconClassName" data-slot="dropdown-menu-icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
    <span :class="labelClassName" data-slot="dropdown-menu-label">
      <slot />
    </span>
    <span v-if="hasShortcut" :class="shortcutClassName" data-slot="dropdown-menu-shortcut">
      <slot name="shortcut">{{ shortcut }}</slot>
    </span>
  </RekaDropdownMenuItem>
</template>
