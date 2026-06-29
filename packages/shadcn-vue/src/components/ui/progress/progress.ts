import type { HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type ProgressSize = 'sm' | 'default' | 'lg';
export type ProgressTone = 'default' | 'success' | 'warning' | 'danger';

export type ProgressClassNames = {
  root?: HTMLAttributes['class'];
  header?: HTMLAttributes['class'];
  label?: HTMLAttributes['class'];
  value?: HTMLAttributes['class'];
  track?: HTMLAttributes['class'];
  indicator?: HTMLAttributes['class'];
};

export type ProgressProps = {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  classNames?: ProgressClassNames;
  indeterminate?: boolean;
  label?: string | number | VNode;
  max?: number;
  modelValue?: number | null;
  showValue?: boolean;
  size?: ProgressSize;
  tone?: ProgressTone;
  value?: number | null;
  valueLabel?: string | number | VNode;
};

export const progressTrackVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-hugo-surface-subtle',
  {
    variants: {
      size: {
        sm: 'h-1.5',
        default: 'h-2.5',
        lg: 'h-3.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const progressIndicatorVariants = cva(
  'h-full rounded-full transition-[width,transform] duration-300 ease-out',
  {
    variants: {
      indeterminate: {
        true: 'w-1/3 animate-pulse',
        false: '',
      },
      tone: {
        default: 'bg-hugo-brand-accent',
        success: 'bg-hugo-status-success',
        warning: 'bg-hugo-status-warning',
        danger: 'bg-hugo-status-error',
      },
    },
    defaultVariants: {
      indeterminate: false,
      tone: 'default',
    },
  }
);

export function clampProgressValue(value: number | null | undefined, max: number) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return Math.min(Math.max(value, 0), max);
}

export function getProgressPercent(value: number | null | undefined, max: number) {
  const normalizedMax = max > 0 ? max : 100;
  const normalizedValue = clampProgressValue(value, normalizedMax);

  if (normalizedValue == null) {
    return null;
  }

  return Math.round((normalizedValue / normalizedMax) * 100);
}
