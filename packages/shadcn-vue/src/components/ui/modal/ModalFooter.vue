<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { computed, nextTick, onMounted, ref } from 'vue';

import { cn } from '@/components/lib/utils';
import Button from '@/components/ui/button/Button.vue';
import {
  modalFooterButtonsClass,
  modalFooterClass,
  modalTertiaryActionClass,
} from './modal.styles';
import type { ModalFooterProps, ModalTertiaryActionProps } from './modal';

const props = withDefaults(defineProps<ModalFooterProps>(), {
  disableAutoFocus: false,
});

const primaryRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
const secondaryRef = ref<ComponentPublicInstance | HTMLElement | null>(null);
const tertiaryRef = ref<HTMLElement | null>(null);

const primary = computed(() => props.actionProps?.primary);
const secondary = computed(() => props.actionProps?.secondary);
const tertiary = computed(() => props.actionProps?.tertiary);

const hasTertiary = computed(() =>
  Boolean(tertiary.value && !tertiary.value.hidden && tertiary.value.label)
);

const rootClassName = computed(() => cn(modalFooterClass, props.class));
const footerButtonsClassName = computed(() =>
  cn(modalFooterButtonsClass, props.classNames?.footerButtons)
);
const tertiaryActionClassName = computed(() =>
  cn(modalTertiaryActionClass, props.classNames?.tertiaryAction, tertiary.value?.class)
);

function getFocusableElement(target: ComponentPublicInstance | HTMLElement | null) {
  if (!target) {
    return null;
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  return target.$el instanceof HTMLElement ? target.$el : null;
}

function focusPreferredAction() {
  if (props.disableAutoFocus) {
    return;
  }

  nextTick(() => {
    if (hasTertiary.value && tertiaryRef.value) {
      tertiaryRef.value.focus();
      return;
    }

    if (secondary.value && !secondary.value.hidden) {
      getFocusableElement(secondaryRef.value)?.focus();
      return;
    }

    getFocusableElement(primaryRef.value)?.focus();
  });
}

function handleTertiaryClick(event: MouseEvent, action: ModalTertiaryActionProps) {
  if (action.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  action.onClick?.(event);
}

onMounted(focusPreferredAction);
</script>

<template>
  <div
    :class="rootClassName"
    :data-has-tertiary="hasTertiary ? 'true' : undefined"
    data-slot="modal-footer"
  >
    <a
      v-if="tertiary && !tertiary.hidden && tertiary.href && tertiary.label"
      ref="tertiaryRef"
      :aria-disabled="tertiary.disabled ? true : undefined"
      :aria-label="tertiary.ariaLabel"
      :class="tertiaryActionClassName"
      data-slot="modal-tertiary-action"
      :href="tertiary.href"
      :rel="tertiary.rel"
      :target="tertiary.target"
      @click="handleTertiaryClick($event, tertiary)"
    >
      {{ tertiary.label }}
    </a>
    <button
      v-else-if="tertiary && !tertiary.hidden && tertiary.label"
      ref="tertiaryRef"
      :aria-disabled="tertiary.disabled ? true : undefined"
      :aria-label="tertiary.ariaLabel"
      :class="tertiaryActionClassName"
      data-slot="modal-tertiary-action"
      type="button"
      @click="handleTertiaryClick($event, tertiary)"
    >
      {{ tertiary.label }}
    </button>

    <div :class="footerButtonsClassName" data-slot="modal-footer-buttons">
      <Button
        v-if="secondary && !secondary.hidden"
        ref="secondaryRef"
        :class="secondary.class"
        :disabled="secondary.disabled"
        :loading="secondary.loading"
        :loading-position="secondary.loadingPosition"
        :size="secondary.size"
        :tone="secondary.tone"
        type="button"
        :variant="secondary.variant"
        @click="secondary.onClick"
      >
        {{ secondary.label ?? 'Cancel' }}
      </Button>
      <Button
        v-if="primary && !primary.hidden"
        ref="primaryRef"
        :class="primary.class"
        :disabled="primary.disabled"
        :loading="primary.loading"
        :loading-position="primary.loadingPosition"
        :size="primary.size"
        :tone="primary.tone"
        type="button"
        :variant="primary.variant"
        @click="primary.onClick"
      >
        {{ primary.label ?? 'Save' }}
      </Button>
    </div>
  </div>
</template>
