import type { HTMLAttributes, VNode } from 'vue';
import type {
  ChoiceAlign,
  ChoiceClassNames,
  ChoiceOption,
  ChoiceSide,
  ChoiceSize,
  ChoiceSlotProps,
  ChoiceStatus,
  ChoiceValue,
} from '../choice/choice';

export type SelectOption = ChoiceOption;
export type SelectValue = ChoiceValue;
export type SelectSize = ChoiceSize;
export type SelectStatus = ChoiceStatus;
export type SelectAlign = ChoiceAlign;
export type SelectSide = ChoiceSide;
export type SelectClassNames = ChoiceClassNames;
export type SelectSlotProps = ChoiceSlotProps;

export type SelectProps = {
  align?: SelectAlign;
  alignOffset?: number;
  class?: HTMLAttributes['class'];
  classNames?: SelectClassNames;
  defaultOpen?: boolean;
  defaultValue?: SelectValue | null;
  description?: string | number | VNode;
  disabled?: boolean;
  error?: string | number | VNode;
  forceMount?: boolean;
  id?: string;
  label?: string | number | VNode;
  message?: string | number | VNode;
  modelValue?: SelectValue | null;
  name?: string;
  open?: boolean;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  side?: SelectSide;
  sideOffset?: number;
  size?: SelectSize;
  slotProps?: SelectSlotProps;
  status?: SelectStatus;
};

export type SelectEmits = {
  (event: 'update:modelValue', value: SelectValue | null): void;
  (event: 'update:open', value: boolean): void;
  (event: 'change', value: SelectValue | null): void;
  (event: 'openChange', value: boolean): void;
};
