<script setup lang="ts">
import { DialogDescription } from 'reka-ui';
import { computed, useAttrs } from 'vue';

import { cn } from '@/components/lib/utils';
import { modalContentTextClass } from './modal.styles';
import type { ModalContentTextProps } from './modal';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ModalContentTextProps>(), {
  asChild: false,
});

const attrs = useAttrs();

const className = computed(() => cn(modalContentTextClass, props.class, attrs.class));
</script>

<template>
  <DialogDescription
    v-bind="{ ...attrs, class: undefined }"
    :as-child="asChild"
    :class="className"
    data-slot="modal-content-text"
  >
    <slot />
  </DialogDescription>
</template>
