import type { HTMLAttributes, VNode } from 'vue';

export type InputStatus = 'default' | 'success' | 'error';
export type InputSize = 'default' | 'sm';
export type InputElement = 'input' | 'textarea';

export type InputClassNames = {
  root?: HTMLAttributes['class'];
  label?: HTMLAttributes['class'];
  requiredMark?: HTMLAttributes['class'];
  control?: HTMLAttributes['class'];
  field?: HTMLAttributes['class'];
  input?: HTMLAttributes['class'];
  textarea?: HTMLAttributes['class'];
  adornment?: HTMLAttributes['class'];
  helper?: HTMLAttributes['class'];
  helperContent?: HTMLAttributes['class'];
  status?: HTMLAttributes['class'];
  spinner?: HTMLAttributes['class'];
  counter?: HTMLAttributes['class'];
};

export type InputSlotAttributes = HTMLAttributes & Record<string, unknown>;

export type InputSlotProps = {
  label?: InputSlotAttributes;
  control?: InputSlotAttributes;
  input?: InputSlotAttributes;
  textarea?: InputSlotAttributes;
  helper?: InputSlotAttributes;
};

export type InputProps = {
  as?: InputElement;
  autoFocus?: boolean;
  autoFocusSource?: 'keyboard' | 'mouse';
  class?: HTMLAttributes['class'];
  classNames?: InputClassNames;
  defaultValue?: string | number | null;
  description?: string | number | VNode;
  disabled?: boolean;
  id?: string;
  label?: string | number | VNode;
  loading?: boolean;
  maxLength?: number;
  message?: string | number | VNode;
  modelValue?: string | number | null;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  showCharacterCount?: boolean;
  size?: InputSize;
  slotProps?: InputSlotProps;
  status?: InputStatus;
  type?: string;
  value?: string | number | null;
};

export type InputEmits = {
  (event: 'update:modelValue', value: string): void;
  (event: 'blur', value: FocusEvent): void;
  (event: 'change', value: Event): void;
  (event: 'focus', value: FocusEvent): void;
  (event: 'input', value: Event): void;
  (event: 'keydown', value: KeyboardEvent): void;
};

export const DEFAULT_MAX_LENGTH = 500;
