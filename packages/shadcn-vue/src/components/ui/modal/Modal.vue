<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from 'reka-ui';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import ModalFooter from './ModalFooter.vue';
import ModalLoadingIndicator from './ModalLoadingIndicator.vue';
import ModalTitle from './ModalTitle.vue';
import {
  modalBodyClass,
  modalBodyContentClass,
  modalContentClass,
  modalHeaderClass,
  modalOverlayClass,
  modalSubtitleClass,
} from './modal.styles';
import type {
  ModalButtonProps,
  ModalButtonsType,
  ModalEmits,
  ModalProps,
  ModalSlotAttributes,
  ModalType,
} from './modal';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ModalProps>(), {
  closeButton: undefined,
  defaultOpen: false,
  disableAutoFocus: false,
  loading: false,
  modal: true,
  modelValue: undefined,
  open: undefined,
  showLoadingIndicator: undefined,
  type: 'transactional',
});

const emit = defineEmits<ModalEmits>();
const attrs = useAttrs();
const slots = useSlots();

const actionModalTypes: ModalType[] = ['transactional', 'destructive', 'warning'];

const internalOpen = ref(props.open ?? props.modelValue ?? props.defaultOpen);

const isControlled = computed(() => props.open !== undefined || props.modelValue !== undefined);
const dialogOpen = computed(() =>
  isControlled.value ? Boolean(props.open ?? props.modelValue) : internalOpen.value
);
const showActions = computed(() => actionModalTypes.includes(props.type));
const closeable = computed(() => props.closeButton ?? !showActions.value);
const hasTitle = computed(() => Boolean(slots.title || props.title));
const hasHeaderPrefixIcon = computed(() =>
  Boolean(slots['header-prefix-icon'] || slots.headerPrefixIcon)
);
const shouldRenderHeader = computed(() =>
  Boolean(slots.header || hasTitle.value || hasHeaderPrefixIcon.value || closeable.value)
);
const resolvedShowLoadingIndicator = computed(() => props.showLoadingIndicator ?? !showActions.value);
const showCenteredLoading = computed(() =>
  Boolean(props.loading && resolvedShowLoadingIndicator.value)
);
const bodyContentDisabled = computed(() =>
  Boolean(props.loading && !resolvedShowLoadingIndicator.value)
);
const hasSubtitle = computed(() => Boolean(slots.subtitle || props.subTitle));

const portalAttributes = computed(() => omitAttributes(props.slotProps?.portal, ['class']));
const overlayAttributes = computed(() => omitAttributes(props.slotProps?.overlay, ['class']));
const contentAttributes = computed(() =>
  omitAttributes({ ...attrs, ...props.slotProps?.content }, ['class'])
);
const headerAttributes = computed(() => omitAttributes(props.slotProps?.header, ['class']));
const bodyAttributes = computed(() => omitAttributes(props.slotProps?.body, ['class']));
const footerAttributes = computed(() => omitAttributes(props.slotProps?.footer, ['class']));

const overlayClassName = computed(() =>
  cn(modalOverlayClass, props.classNames?.overlay, props.slotProps?.overlay?.class)
);
const contentClassName = computed(() =>
  cn(
    modalContentClass,
    props.classNames?.content,
    props.slotProps?.content?.class,
    props.class,
    attrs.class
  )
);
const headerClassName = computed(() =>
  cn(modalHeaderClass, props.classNames?.header, props.slotProps?.header?.class)
);
const bodyClassName = computed(() =>
  cn(modalBodyClass, props.classNames?.body, props.slotProps?.body?.class)
);
const bodyContentClassName = computed(() =>
  cn(modalBodyContentClass, props.classNames?.bodyContent)
);
const subtitleClassName = computed(() => cn(modalSubtitleClass, props.classNames?.subtitle));
const footerClassName = computed(() =>
  cn(props.classNames?.footer, props.slotProps?.footer?.class)
);

function omitAttributes(source: ModalSlotAttributes | undefined, keys: string[]) {
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

  if (!nextOpen) {
    emit('close');
  }
}

function closeModal() {
  handleOpenChange(false);
}

function withLoadingConstraints(
  actions: ModalButtonsType,
  loading: boolean | undefined,
  showLoadingIndicator: boolean
): ModalButtonsType {
  if (!loading) {
    return actions;
  }

  const primaryConstraintProps: Pick<
    ModalButtonProps,
    'disabled' | 'loading' | 'loadingPosition'
  > = showLoadingIndicator
    ? { disabled: true }
    : actions.secondary?.loading
      ? { disabled: true }
      : { loading: true, loadingPosition: 'center' };
  const secondaryConstraintProps: Pick<
    ModalButtonProps,
    'disabled' | 'loading' | 'loadingPosition'
  > = showLoadingIndicator
    ? { disabled: true }
    : actions.secondary?.loading
      ? { loading: true, loadingPosition: 'center' }
      : { disabled: true };

  return {
    ...actions,
    primary: actions.primary ? { ...actions.primary, ...primaryConstraintProps } : undefined,
    secondary: actions.secondary
      ? { ...actions.secondary, ...secondaryConstraintProps }
      : undefined,
    tertiary: actions.tertiary ? { ...actions.tertiary, disabled: true } : undefined,
  };
}

function createModalActions(): ModalButtonsType {
  const primaryDefaults: ModalButtonProps = {
    label: 'Save',
    size: 'lg',
    tone: 'brand',
    variant: 'solid',
  };
  const secondaryDefaults: ModalButtonProps = {
    label: 'Cancel',
    onClick: closeModal,
    size: 'lg',
    tone: 'brand',
    variant: 'outline',
  };

  const typeDefaults: ModalButtonsType =
    props.type === 'destructive'
      ? {
          primary: { label: 'Destruct', tone: 'danger', variant: 'solid' },
          secondary: { tone: 'neutral', variant: 'outline' },
        }
      : props.type === 'warning'
        ? {
            secondary: { label: 'Leave without saving', tone: 'brand', variant: 'outline' },
          }
        : {};

  const actions: ModalButtonsType = {
    primary: {
      ...primaryDefaults,
      ...typeDefaults.primary,
      ...props.buttonDefs?.primary,
    },
    secondary: {
      ...secondaryDefaults,
      ...typeDefaults.secondary,
      ...props.buttonDefs?.secondary,
    },
  };

  if (typeDefaults.tertiary || props.buttonDefs?.tertiary) {
    actions.tertiary = {
      ...typeDefaults.tertiary,
      ...props.buttonDefs?.tertiary,
    };
  }

  return withLoadingConstraints(actions, props.loading, resolvedShowLoadingIndicator.value);
}

const actions = computed(() => (showActions.value ? createModalActions() : undefined));

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
  <DialogRoot :modal="modal" :open="dialogOpen" @update:open="handleOpenChange">
    <DialogPortal v-bind="portalAttributes">
      <DialogOverlay v-bind="overlayAttributes" :class="overlayClassName" />
      <DialogContent
        v-bind="contentAttributes"
        :aria-label="!hasTitle ? ariaLabel : undefined"
        :class="contentClassName"
        :data-loading="loading ? 'true' : undefined"
        :data-show-loading-indicator="resolvedShowLoadingIndicator ? 'true' : 'false'"
        data-slot="modal-content"
        :data-type="type"
      >
        <slot v-if="$slots.header" name="header" :close="closeModal" :open="dialogOpen" />
        <div
          v-else-if="shouldRenderHeader"
          v-bind="headerAttributes"
          :class="headerClassName"
          :data-closeable="closeable ? 'true' : undefined"
          data-slot="modal-header"
        >
          <ModalTitle
            :class="classNames?.title"
            :class-names="classNames"
            :closeable="closeable"
            :title="title"
            :type="type"
          >
            <template v-if="$slots.title" #default>
              <slot name="title" />
            </template>
            <template v-if="$slots['header-prefix-icon'] || $slots.headerPrefixIcon" #prefix-icon>
              <slot name="header-prefix-icon">
                <slot name="headerPrefixIcon" />
              </slot>
            </template>
          </ModalTitle>
        </div>

        <div
          v-bind="bodyAttributes"
          :class="bodyClassName"
          :data-has-header="shouldRenderHeader ? 'true' : 'false'"
          data-slot="modal-body"
        >
          <ModalLoadingIndicator
            :class-names="classNames"
            :loading="showCenteredLoading"
            :slot-props="slotProps"
          />
          <div
            v-if="!showCenteredLoading"
            :class="bodyContentClassName"
            :data-disabled="bodyContentDisabled ? 'true' : undefined"
            data-slot="modal-body-content"
          >
            <h3 v-if="hasSubtitle" :class="subtitleClassName" data-slot="modal-subtitle">
              <slot name="subtitle">{{ subTitle }}</slot>
            </h3>
            <slot />
          </div>
        </div>

        <slot
          v-if="$slots.footer"
          name="footer"
          :actions="actions"
          :close="closeModal"
          :open="dialogOpen"
        />
        <ModalFooter
          v-else-if="showActions"
          v-bind="footerAttributes"
          :action-props="actions"
          :class="footerClassName"
          :class-names="classNames"
          :disable-auto-focus="disableAutoFocus"
        />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
