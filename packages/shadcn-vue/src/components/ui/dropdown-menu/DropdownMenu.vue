<script setup lang="ts">
import {
  DropdownMenuContent as RekaDropdownMenuContent,
  DropdownMenuPortal as RekaDropdownMenuPortal,
  DropdownMenuRoot as RekaDropdownMenuRoot,
  DropdownMenuTrigger as RekaDropdownMenuTrigger,
} from 'reka-ui';
import { computed, ref, useAttrs, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import type {
  DropdownMenuEmits,
  DropdownMenuProps,
  DropdownMenuSlotAttributes,
} from './dropdownMenu';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  align: 'end',
  alignOffset: 0,
  defaultOpen: false,
  forceMount: false,
  modal: true,
  modelValue: undefined,
  open: undefined,
  side: 'bottom',
  sideOffset: 8,
});

const emit = defineEmits<DropdownMenuEmits>();
const attrs = useAttrs();

const internalOpen = ref(props.open ?? props.modelValue ?? props.defaultOpen);

const isControlled = computed(() => props.open !== undefined || props.modelValue !== undefined);
const menuOpen = computed(() =>
  isControlled.value ? Boolean(props.open ?? props.modelValue) : internalOpen.value
);

const triggerAttributes = computed(() => omitAttributes(props.slotProps?.trigger, ['class']));
const portalAttributes = computed(() => omitAttributes(props.slotProps?.portal, ['class']));
const contentAttributes = computed(() =>
  omitAttributes({ ...attrs, ...props.slotProps?.content }, ['class'])
);

const triggerClassName = computed(() =>
  cn(props.classNames?.trigger, props.slotProps?.trigger?.class)
);
const contentClassName = computed(() =>
  cn(
    'z-50 min-w-48 overflow-hidden rounded-md border border-hugo-neutral-500 bg-hugo-surface-default',
    'p-1 font-sans text-hugo-text-default shadow-hugo-medium outline-none',
    'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
    'data-[side=right]:translate-x-1 data-[side=left]:-translate-x-1',
    props.classNames?.content,
    props.slotProps?.content?.class,
    props.class,
    attrs.class
  )
);

function omitAttributes(source: DropdownMenuSlotAttributes | undefined, keys: string[]) {
  if (!source) {
    return {};
  }

  const blocked = new Set(keys);

  return Object.fromEntries(Object.entries(source).filter(([key]) => !blocked.has(key)));
}

function handleOpenChange(nextOpen: boolean) {
  if (!isControlled.value) {
    internalOpen.value = nextOpen;
  }

  emit('update:modelValue', nextOpen);
  emit('update:open', nextOpen);
  emit('openChange', nextOpen);
}

watch(
  () => [props.open, props.modelValue] as const,
  ([open, modelValue]) => {
    if (open !== undefined) {
      internalOpen.value = open;
      return;
    }

    if (modelValue !== undefined) {
      internalOpen.value = modelValue;
    }
  }
);
</script>

<template>
  <RekaDropdownMenuRoot
    :default-open="defaultOpen"
    :modal="modal"
    :open="menuOpen"
    @update:open="handleOpenChange"
  >
    <RekaDropdownMenuTrigger
      v-if="$slots.trigger"
      v-bind="triggerAttributes"
      as-child
      :class="triggerClassName"
      data-slot="dropdown-menu-trigger"
    >
      <slot name="trigger" :open="menuOpen" />
    </RekaDropdownMenuTrigger>

    <RekaDropdownMenuPortal v-bind="portalAttributes">
      <RekaDropdownMenuContent
        v-bind="contentAttributes"
        :align="align"
        :align-offset="alignOffset"
        :class="contentClassName"
        data-component="hugo-dropdown-menu"
        data-slot="dropdown-menu-content"
        :force-mount="forceMount || undefined"
        :side="side"
        :side-offset="sideOffset"
      >
        <slot :open="menuOpen" />
      </RekaDropdownMenuContent>
    </RekaDropdownMenuPortal>
  </RekaDropdownMenuRoot>
</template>
