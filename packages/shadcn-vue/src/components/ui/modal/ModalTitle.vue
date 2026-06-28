<script setup lang="ts">
import { CircleAlert, TriangleAlert, X } from 'lucide-vue-next';
import { DialogClose, DialogTitle } from 'reka-ui';
import { computed, useSlots } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  modalCloseButtonClass,
  modalTitleClass,
  modalTitleIconClass,
  modalTitleTextClass,
} from './modal.styles';
import type { ModalTitleProps, ModalType } from './modal';

const props = withDefaults(defineProps<ModalTitleProps>(), {
  closeable: true,
  type: 'transactional',
});

const slots = useSlots();

const statusIconByType: Partial<
  Record<
    ModalType,
    {
      Icon: typeof CircleAlert;
      ariaLabel: string;
      className: string;
    }
  >
> = {
  destructive: {
    Icon: CircleAlert,
    ariaLabel: 'alert',
    className: 'text-hugo-status-error',
  },
  error: {
    Icon: CircleAlert,
    ariaLabel: 'alert',
    className: 'text-hugo-status-warning',
  },
  warning: {
    Icon: TriangleAlert,
    ariaLabel: 'warning',
    className: 'text-hugo-brand-primary',
  },
};

const iconDefinition = computed(() => statusIconByType[props.type]);
const hasPrefixIcon = computed(() => Boolean(slots['prefix-icon'] || slots.prefixIcon));

const titleClassName = computed(() => cn(modalTitleClass, props.class));
const titleIconClassName = computed(() =>
  cn(modalTitleIconClass, props.classNames?.titleIcon)
);
const titleTextClassName = computed(() =>
  cn(modalTitleTextClass, props.classNames?.titleText)
);
const closeButtonClassName = computed(() =>
  cn(modalCloseButtonClass, props.classNames?.closeButton)
);
</script>

<template>
  <DialogTitle :class="titleClassName" data-slot="modal-title" :data-type="type">
    <span
      v-if="hasPrefixIcon"
      aria-hidden="true"
      :class="titleIconClassName"
      data-slot="modal-title-icon"
    >
      <slot name="prefix-icon">
        <slot name="prefixIcon" />
      </slot>
    </span>
    <span v-else-if="iconDefinition" :class="titleIconClassName" data-slot="modal-title-icon">
      <component
        :is="iconDefinition.Icon"
        :aria-label="iconDefinition.ariaLabel"
        :class="iconDefinition.className"
        role="img"
      />
    </span>
    <span v-if="$slots.default || title" :class="titleTextClassName" data-slot="modal-title-text">
      <slot>{{ title }}</slot>
    </span>
  </DialogTitle>
  <DialogClose v-if="closeable" as-child>
    <button
      aria-label="close"
      :class="closeButtonClassName"
      data-slot="modal-close"
      type="button"
    >
      <X aria-hidden="true" :size="20" />
    </button>
  </DialogClose>
</template>
