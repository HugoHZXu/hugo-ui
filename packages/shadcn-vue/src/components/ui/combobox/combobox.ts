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

export type ComboboxOption = ChoiceOption;
export type ComboboxValue = ChoiceValue;
export type ComboboxSize = ChoiceSize;
export type ComboboxStatus = ChoiceStatus;
export type ComboboxAlign = ChoiceAlign;
export type ComboboxSide = ChoiceSide;
export type ComboboxClassNames = ChoiceClassNames;
export type ComboboxSlotProps = ChoiceSlotProps;

export type ComboboxSearch = (query: string) => ComboboxOption[] | Promise<ComboboxOption[]>;

export type ComboboxProps = {
  align?: ComboboxAlign;
  alignOffset?: number;
  class?: HTMLAttributes['class'];
  classNames?: ComboboxClassNames;
  clearable?: boolean;
  debounce?: number;
  defaultOpen?: boolean;
  defaultQuery?: string;
  defaultValue?: ComboboxValue | null;
  description?: string | number | VNode;
  disabled?: boolean;
  emptyText?: string | number | VNode;
  error?: string | number | VNode;
  forceMount?: boolean;
  id?: string;
  label?: string | number | VNode;
  loading?: boolean;
  message?: string | number | VNode;
  modelValue?: ComboboxValue | null;
  name?: string;
  open?: boolean;
  options?: ComboboxOption[];
  placeholder?: string;
  query?: string;
  required?: boolean;
  search?: ComboboxSearch;
  side?: ComboboxSide;
  sideOffset?: number;
  size?: ComboboxSize;
  slotProps?: ComboboxSlotProps;
  status?: ComboboxStatus;
};

export type ComboboxEmits = {
  (event: 'update:modelValue', value: ComboboxValue | null): void;
  (event: 'update:query', value: string): void;
  (event: 'update:open', value: boolean): void;
  (event: 'change', value: ComboboxValue | null): void;
  (event: 'queryChange', value: string): void;
  (event: 'openChange', value: boolean): void;
  (event: 'search', value: string): void;
  (event: 'clear'): void;
};
