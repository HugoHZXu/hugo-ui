import type { HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type ChoiceValue = string | number;

export type ChoiceOption = {
  description?: string | number | VNode;
  disabled?: boolean;
  group?: string;
  label: string | number;
  value: ChoiceValue;
};

export type ChoiceSize = 'sm' | 'default';
export type ChoiceStatus = 'default' | 'error';
export type ChoiceAlign = 'start' | 'center' | 'end';
export type ChoiceSide = 'top' | 'right' | 'bottom' | 'left';

export type ChoiceClassNames = {
  root?: HTMLAttributes['class'];
  label?: HTMLAttributes['class'];
  requiredMark?: HTMLAttributes['class'];
  control?: HTMLAttributes['class'];
  value?: HTMLAttributes['class'];
  input?: HTMLAttributes['class'];
  icon?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  viewport?: HTMLAttributes['class'];
  group?: HTMLAttributes['class'];
  groupLabel?: HTMLAttributes['class'];
  item?: HTMLAttributes['class'];
  itemIndicator?: HTMLAttributes['class'];
  itemText?: HTMLAttributes['class'];
  itemDescription?: HTMLAttributes['class'];
  helper?: HTMLAttributes['class'];
  helperContent?: HTMLAttributes['class'];
  message?: HTMLAttributes['class'];
  spinner?: HTMLAttributes['class'];
  clearButton?: HTMLAttributes['class'];
  empty?: HTMLAttributes['class'];
};

export type ChoiceSlotAttributes = HTMLAttributes & Record<string, unknown>;

export type ChoiceSlotProps = {
  root?: ChoiceSlotAttributes;
  label?: ChoiceSlotAttributes;
  control?: ChoiceSlotAttributes;
  content?: ChoiceSlotAttributes;
  helper?: ChoiceSlotAttributes;
  portal?: ChoiceSlotAttributes;
};

export type GroupedChoiceOptions = {
  group?: string;
  options: ChoiceOption[];
};

export const choiceRootClass = 'inline-flex w-60 max-w-full flex-col gap-1 font-sans';

export const choiceLabelClass = cva(
  'text-base font-normal leading-6 tracking-[0.02em] text-hugo-text-default',
  {
    variants: {
      size: {
        sm: 'sr-only',
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const choiceControlClass = cva(
  [
    'flex w-full items-center gap-2 rounded-md border border-hugo-border-strong',
    'bg-hugo-surface-default text-hugo-text-primary outline-none',
    'transition-[background-color,border-color,box-shadow] duration-150 ease-linear',
    'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
    'data-[placeholder=true]:text-hugo-text-default',
    'disabled:cursor-not-allowed disabled:border-hugo-border-default disabled:text-hugo-text-disabled',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-hugo-border-default data-[disabled=true]:text-hugo-text-disabled',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-[34px] px-2 text-sm leading-5',
        default: 'min-h-[50px] px-3 pl-4 text-base leading-6',
      },
      status: {
        default: '',
        error: 'border-hugo-status-error',
      },
    },
    defaultVariants: {
      size: 'default',
      status: 'default',
    },
  }
);

export const choiceContentClass =
  'z-50 max-h-72 min-w-[var(--reka-select-trigger-width,16rem)] overflow-hidden rounded-md border border-hugo-neutral-500 bg-hugo-surface-default p-1 font-sans text-hugo-text-default shadow-hugo-medium outline-none';

export const choiceItemClass = [
  'relative flex min-h-9 cursor-default select-none items-start gap-2 rounded-sm px-2.5 py-2',
  'text-sm leading-5 outline-none transition-colors duration-150 ease-linear',
  'data-[highlighted]:bg-hugo-surface-tinted data-[highlighted]:text-hugo-brand-deep',
  'data-[state=checked]:bg-hugo-surface-tinted data-[state=checked]:text-hugo-brand-deep',
  'data-[disabled]:pointer-events-none data-[disabled]:text-hugo-text-disabled',
].join(' ');

export const choiceGroupLabelClass =
  'px-2.5 py-1.5 text-xs font-semibold uppercase leading-4 text-hugo-text-subtle';

export const choiceHelperClass =
  'flex justify-between gap-3 px-2 pl-4 text-xs font-normal leading-5 text-hugo-text-default';

export function getChoiceLabel(option: ChoiceOption | undefined) {
  return option == null ? '' : String(option.label);
}

export function findChoiceOption(options: ChoiceOption[], value: ChoiceValue | null | undefined) {
  return options.find((option) => option.value === value);
}

export function getGroupedChoiceOptions(options: ChoiceOption[]) {
  const groups: GroupedChoiceOptions[] = [];
  const groupByName = new Map<string | undefined, GroupedChoiceOptions>();

  options.forEach((option) => {
    const key = option.group;
    let group = groupByName.get(key);

    if (!group) {
      group = { group: key, options: [] };
      groupByName.set(key, group);
      groups.push(group);
    }

    group.options.push(option);
  });

  return groups;
}

export function filterChoiceOptions(options: ChoiceOption[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return options;
  }

  return options.filter((option) => {
    const label = String(option.label).toLowerCase();
    const description =
      typeof option.description === 'string' || typeof option.description === 'number'
        ? String(option.description).toLowerCase()
        : '';
    const group = option.group?.toLowerCase() ?? '';

    return (
      label.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      group.includes(normalizedQuery)
    );
  });
}

export function omitChoiceAttributes(source: ChoiceSlotAttributes | undefined, keys: string[]) {
  if (!source) {
    return {};
  }

  const blocked = new Set(keys);

  return Object.fromEntries(Object.entries(source).filter(([key]) => !blocked.has(key)));
}
