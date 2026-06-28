import type { Component, HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type MetricTileTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type MetricTileTrend = 'up' | 'down' | 'neutral';

export type MetricTileClassNames = {
  root?: HTMLAttributes['class'];
  header?: HTMLAttributes['class'];
  label?: HTMLAttributes['class'];
  icon?: HTMLAttributes['class'];
  value?: HTMLAttributes['class'];
  description?: HTMLAttributes['class'];
  delta?: HTMLAttributes['class'];
  skeleton?: HTMLAttributes['class'];
};

export type MetricTileProps = {
  class?: HTMLAttributes['class'];
  classNames?: MetricTileClassNames;
  compact?: boolean;
  delta?: string | number | VNode;
  description?: string | number | VNode;
  icon?: Component;
  label: string | number | VNode;
  loading?: boolean;
  tone?: MetricTileTone;
  trend?: MetricTileTrend;
  value: string | number | VNode;
};

export const metricTileRootVariants = cva(
  [
    'flex min-w-0 flex-col rounded-lg border bg-hugo-surface-default font-sans',
    'transition-colors duration-150 ease-linear',
  ],
  {
    variants: {
      compact: {
        true: 'gap-2 p-3',
        false: 'gap-3 p-4',
      },
      tone: {
        neutral: 'border-hugo-neutral-500',
        success: 'border-hugo-success-bg',
        warning:
          'border-[color-mix(in_oklab,var(--hugo-ui-shadcn-status-warning)_24%,var(--hugo-ui-shadcn-neutral-grey-500))]',
        danger: 'border-hugo-error-bg',
        info: 'border-hugo-surface-tinted',
      },
    },
    defaultVariants: {
      compact: false,
      tone: 'neutral',
    },
  }
);

export const metricTileToneTextClass: Record<MetricTileTone, string> = {
  neutral: 'text-hugo-text-default',
  success: 'text-hugo-status-success',
  warning: 'text-hugo-status-warning',
  danger: 'text-hugo-status-error',
  info: 'text-hugo-brand-deep',
};

export const metricTileIconClass: Record<MetricTileTone, string> = {
  neutral: 'bg-hugo-surface-subtle text-hugo-text-subtle',
  success: 'bg-hugo-success-bg text-hugo-status-success',
  warning:
    'bg-[color-mix(in_oklab,var(--hugo-ui-shadcn-status-warning)_12%,transparent)] text-hugo-status-warning',
  danger: 'bg-hugo-error-bg text-hugo-status-error',
  info: 'bg-hugo-surface-tinted text-hugo-brand-deep',
};
