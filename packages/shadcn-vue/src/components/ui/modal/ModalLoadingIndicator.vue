<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  modalLoadingIndicatorClass,
  modalScreenReaderStatusClass,
  modalSpinnerClass,
} from './modal.styles';
import type { ModalLoadingIndicatorProps, ModalSlotAttributes } from './modal';

const props = withDefaults(defineProps<ModalLoadingIndicatorProps>(), {
  loading: false,
});

const readoutLoading = ref(false);

const loadingAttributes = computed(() =>
  omitAttributes(props.slotProps?.loadingIndicator, ['class'])
);

const loadingClassName = computed(() =>
  cn(
    modalLoadingIndicatorClass,
    props.classNames?.loadingIndicator,
    props.slotProps?.loadingIndicator?.class,
    props.class
  )
);

const screenReaderStatusClassName = computed(() =>
  cn(modalScreenReaderStatusClass, props.classNames?.screenReaderStatus)
);

function omitAttributes(source: ModalSlotAttributes | undefined, keys: string[]) {
  if (!source) {
    return {};
  }

  const blocked = new Set(keys);

  return Object.fromEntries(Object.entries(source).filter(([key]) => !blocked.has(key)));
}

watch(
  () => props.loading,
  (loading, _wasLoading, onCleanup) => {
    if (!loading) {
      readoutLoading.value = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      readoutLoading.value = true;
    }, 200);

    onCleanup(() => window.clearTimeout(timeoutId));
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="loading"
    v-bind="loadingAttributes"
    :class="loadingClassName"
    data-slot="modal-loading-indicator"
  >
    <span aria-hidden="true" :class="modalSpinnerClass" data-slot="modal-spinner" />
  </div>
  <div
    aria-live="polite"
    :class="screenReaderStatusClassName"
    data-slot="modal-screen-reader-status"
  >
    {{ readoutLoading ? 'Loading' : '' }}
  </div>
</template>
