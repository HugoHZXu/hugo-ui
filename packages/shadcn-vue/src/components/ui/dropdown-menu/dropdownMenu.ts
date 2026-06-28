import type { Component, HTMLAttributes, VNode } from 'vue';

export type DropdownMenuAlign = 'start' | 'center' | 'end';
export type DropdownMenuSide = 'top' | 'right' | 'bottom' | 'left';

export type DropdownMenuClassNames = {
  content?: HTMLAttributes['class'];
  trigger?: HTMLAttributes['class'];
};

export type DropdownMenuSlotAttributes = HTMLAttributes & Record<string, unknown>;

export type DropdownMenuSlotProps = {
  content?: DropdownMenuSlotAttributes;
  portal?: DropdownMenuSlotAttributes;
  trigger?: DropdownMenuSlotAttributes;
};

export type DropdownMenuProps = {
  align?: DropdownMenuAlign;
  alignOffset?: number;
  class?: HTMLAttributes['class'];
  classNames?: DropdownMenuClassNames;
  defaultOpen?: boolean;
  forceMount?: boolean;
  modal?: boolean;
  modelValue?: boolean;
  open?: boolean;
  side?: DropdownMenuSide;
  sideOffset?: number;
  slotProps?: DropdownMenuSlotProps;
};

export type DropdownMenuEmits = {
  (event: 'update:modelValue', value: boolean): void;
  (event: 'update:open', value: boolean): void;
  (event: 'openChange', value: boolean): void;
};

export type DropdownMenuItemProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  destructive?: boolean;
  disabled?: boolean;
  icon?: Component;
  shortcut?: string | number | VNode;
  textValue?: string;
};

export type DropdownMenuItemEmits = {
  (event: 'click', value: MouseEvent): void;
  (event: 'select', value: Event): void;
};

export type DropdownMenuSeparatorProps = {
  class?: HTMLAttributes['class'];
};
