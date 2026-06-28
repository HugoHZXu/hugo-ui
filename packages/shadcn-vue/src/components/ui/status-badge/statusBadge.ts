import type { Component, HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type StatusBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type StatusBadgeVariant = 'soft' | 'outline' | 'solid';
export type StatusBadgeSize = 'sm' | 'md';

export const statusBadgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center rounded-full font-sans font-semibold',
    'whitespace-nowrap align-middle transition-colors duration-150 ease-linear',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-5 gap-1 px-2 text-[11px] leading-4 [&_svg]:size-3.5',
        md: 'min-h-6 gap-1.5 px-2.5 text-xs leading-4 [&_svg]:size-4',
      },
      variant: {
        soft: '',
        outline: 'bg-transparent ring-1 ring-inset',
        solid: 'text-hugo-text-inverse',
      },
      tone: {
        neutral: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
    },
    compoundVariants: [
      {
        variant: 'soft',
        tone: 'neutral',
        className: 'bg-hugo-surface-subtle text-hugo-text-default',
      },
      {
        variant: 'soft',
        tone: 'success',
        className: 'bg-hugo-success-bg text-hugo-status-success',
      },
      {
        variant: 'soft',
        tone: 'warning',
        className:
          'bg-[color-mix(in_oklab,var(--hugo-ui-shadcn-status-warning)_12%,transparent)] text-hugo-status-warning',
      },
      {
        variant: 'soft',
        tone: 'danger',
        className: 'bg-hugo-error-bg text-hugo-status-error',
      },
      {
        variant: 'soft',
        tone: 'info',
        className: 'bg-hugo-surface-tinted text-hugo-brand-deep',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        className: 'text-hugo-text-default ring-hugo-border-default',
      },
      {
        variant: 'outline',
        tone: 'success',
        className: 'text-hugo-status-success ring-hugo-status-success',
      },
      {
        variant: 'outline',
        tone: 'warning',
        className: 'text-hugo-status-warning ring-hugo-status-warning',
      },
      {
        variant: 'outline',
        tone: 'danger',
        className: 'text-hugo-status-error ring-hugo-status-error',
      },
      {
        variant: 'outline',
        tone: 'info',
        className: 'text-hugo-brand-deep ring-hugo-brand-accent',
      },
      {
        variant: 'solid',
        tone: 'neutral',
        className: 'bg-hugo-neutral-1200',
      },
      {
        variant: 'solid',
        tone: 'success',
        className: 'bg-hugo-status-success',
      },
      {
        variant: 'solid',
        tone: 'warning',
        className: 'bg-hugo-status-warning',
      },
      {
        variant: 'solid',
        tone: 'danger',
        className: 'bg-hugo-status-error',
      },
      {
        variant: 'solid',
        tone: 'info',
        className: 'bg-hugo-brand-accent',
      },
    ],
    defaultVariants: {
      size: 'md',
      tone: 'neutral',
      variant: 'soft',
    },
  }
);

export type StatusBadgeProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  icon?: Component;
  label?: string | number | VNode;
  showDot?: boolean;
  showIcon?: boolean;
  size?: StatusBadgeSize;
  status?: string | number | null;
  tone?: StatusBadgeTone;
  variant?: StatusBadgeVariant;
};

const successStatuses = new Set([
  'active',
  'complete',
  'completed',
  'done',
  'passed',
  'ready',
  'success',
  'succeeded',
]);
const warningStatuses = new Set(['attention', 'review', 'warn', 'warning']);
const dangerStatuses = new Set(['blocked', 'danger', 'error', 'failed', 'failure']);
const infoStatuses = new Set(['info', 'notice', 'processing', 'running']);

export function normalizeStatusKey(status: string | number | null | undefined) {
  return String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}

export function resolveStatusTone(status: string | number | null | undefined): StatusBadgeTone {
  const key = normalizeStatusKey(status);

  if (successStatuses.has(key)) {
    return 'success';
  }

  if (warningStatuses.has(key)) {
    return 'warning';
  }

  if (dangerStatuses.has(key)) {
    return 'danger';
  }

  if (infoStatuses.has(key)) {
    return 'info';
  }

  return 'neutral';
}

export function formatStatusLabel(status: string | number | null | undefined) {
  const key = normalizeStatusKey(status);

  if (!key) {
    return '';
  }

  return key
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
