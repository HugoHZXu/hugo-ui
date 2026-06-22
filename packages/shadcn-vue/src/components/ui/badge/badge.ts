import type { Component, HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';

export type BadgeTone = 'success' | 'warning' | 'neutral' | 'danger' | 'info';

export const badgeVariants = cva(
  [
    'inline-flex min-h-7 w-fit shrink-0 items-center justify-center rounded-full',
    'px-3 py-1 text-xs font-semibold leading-4 tracking-hugo-button-small whitespace-nowrap',
    'align-middle transition-colors duration-150 ease-linear',
  ],
  {
    variants: {
      tone: {
        success: 'bg-hugo-success-bg text-hugo-status-success',
        warning:
          'bg-[color-mix(in_oklab,var(--hugo-ui-shadcn-status-warning)_12%,transparent)] text-hugo-status-warning',
        neutral: 'bg-hugo-surface-subtle text-hugo-text-default',
        danger: 'bg-hugo-error-bg text-hugo-status-error',
        info: 'bg-hugo-surface-tinted text-hugo-brand-deep',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  }
);

export type BadgeProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  tone?: BadgeTone;
};
