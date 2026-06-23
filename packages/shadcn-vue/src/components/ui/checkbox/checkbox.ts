import type { Component, HTMLAttributes, VNode } from 'vue';

export type CheckboxModelValue = boolean | 'indeterminate';

export type CheckboxClassNames = {
  root?: HTMLAttributes['class'];
  control?: HTMLAttributes['class'];
  box?: HTMLAttributes['class'];
  indicator?: HTMLAttributes['class'];
  icon?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  label?: HTMLAttributes['class'];
  description?: HTMLAttributes['class'];
};

export type CheckboxSlotAttributes = HTMLAttributes & Record<string, unknown>;

export type CheckboxSlotProps = {
  root?: CheckboxSlotAttributes;
  control?: CheckboxSlotAttributes;
  box?: CheckboxSlotAttributes;
  indicator?: CheckboxSlotAttributes;
  content?: CheckboxSlotAttributes;
  label?: CheckboxSlotAttributes;
  description?: CheckboxSlotAttributes;
};

export type CheckboxProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  classNames?: CheckboxClassNames;
  defaultValue?: CheckboxModelValue | null;
  description?: string | number | VNode;
  disabled?: boolean;
  id?: string;
  label?: string | number | VNode;
  labelClickable?: boolean;
  modelValue?: CheckboxModelValue | null;
  name?: string;
  required?: boolean;
  slotProps?: CheckboxSlotProps;
  value?: string | number | bigint | Record<string, unknown> | null;
};

export type CheckboxEmits = {
  (event: 'update:modelValue', value: CheckboxModelValue): void;
  (event: 'change', value: CheckboxModelValue): void;
  (event: 'focus', value: FocusEvent): void;
  (event: 'blur', value: FocusEvent): void;
};
