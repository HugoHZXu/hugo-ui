<script setup lang="ts">
import { DropdownMenuSeparator as RekaDropdownMenuSeparator } from 'reka-ui';
import { computed, useAttrs } from 'vue';

import { cn } from '@/components/lib/utils';
import type { DropdownMenuSeparatorProps } from './dropdownMenu';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<DropdownMenuSeparatorProps>();
const attrs = useAttrs();

const rootClassName = computed(() =>
  cn('-mx-1 my-1 h-px bg-hugo-neutral-500', props.class, attrs.class)
);
</script>

<template>
  <RekaDropdownMenuSeparator
    v-bind="{ ...attrs, class: undefined }"
    :class="rootClassName"
    data-slot="dropdown-menu-separator"
  />
</template>
