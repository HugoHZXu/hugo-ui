<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Primitive } from 'reka-ui';

import { cn } from '@/components/lib/utils';
import { buttonVariants, type ButtonProps } from './button';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  asChild: false,
  disabled: false,
  loading: false,
  loadingPosition: 'start',
  size: 'default',
  tone: 'brand',
  type: 'button',
  variant: 'solid',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();

const isDisabled = computed(() => props.disabled || props.loading);
const isIconOnly = computed(() => props.size === 'icon');
const isNativeButton = computed(() => !props.asChild && props.as === 'button');
const showCenterLoading = computed(() => props.loading && props.loadingPosition === 'center');
const showStartLoading = computed(() => props.loading && props.loadingPosition === 'start');

const rootClassName = computed(() =>
  cn(
    buttonVariants({
      size: props.size,
      tone: props.tone,
      variant: props.variant,
    }),
    props.class,
    attrs.class
  )
);

const spinnerClassName = computed(() =>
  cn(
    'rounded-full border-2 border-current border-t-transparent animate-spin',
    props.size === 'sm' ? 'h-4 w-4' : 'h-6 w-6',
    showCenterLoading.value &&
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  )
);

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}
</script>

<template>
  <Primitive
    v-bind="{ ...attrs, class: undefined }"
    :as="as"
    :as-child="asChild"
    :aria-busy="loading || undefined"
    :aria-disabled="!isNativeButton && isDisabled ? true : undefined"
    :class="rootClassName"
    :data-disabled="disabled ? 'true' : undefined"
    :data-icon-only="isIconOnly ? 'true' : undefined"
    :data-loading="loading ? 'true' : undefined"
    :data-size="size"
    data-slot="button"
    :data-tone="tone"
    :data-variant="variant"
    :disabled="isNativeButton ? isDisabled : undefined"
    :tabindex="isDisabled ? -1 : attrs.tabindex"
    :type="isNativeButton ? type : undefined"
    @click="handleClick"
  >
    <span
      v-if="showCenterLoading"
      aria-hidden="true"
      :class="spinnerClassName"
      data-position="center"
      data-slot="button-spinner"
    />
    <span
      :class="cn('inline-flex items-center justify-center gap-2', showCenterLoading && 'invisible')"
      data-slot="button-content"
    >
      <span
        v-if="showStartLoading"
        aria-hidden="true"
        :class="spinnerClassName"
        data-position="start"
        data-slot="button-spinner"
      />
      <slot />
    </span>
  </Primitive>
</template>
