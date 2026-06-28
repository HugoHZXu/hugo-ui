import type { Component, HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type EmptyStateVariant = 'page' | 'section' | 'table' | 'compact';
export type EmptyStateTone = 'neutral' | 'danger' | 'info';

export type EmptyStateClassNames = {
  root?: HTMLAttributes['class'];
  icon?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  title?: HTMLAttributes['class'];
  description?: HTMLAttributes['class'];
  action?: HTMLAttributes['class'];
  code?: HTMLAttributes['class'];
};

export type EmptyStateProps = {
  class?: HTMLAttributes['class'];
  classNames?: EmptyStateClassNames;
  componentName?: string;
  description?: string | number | VNode;
  icon?: Component;
  role?: string;
  title: string | number | VNode;
  tone?: EmptyStateTone;
  variant?: EmptyStateVariant;
};

export type ErrorStateProps = Omit<EmptyStateProps, 'componentName' | 'role' | 'title' | 'tone'> & {
  errorCode?: string | number;
  retryable?: boolean;
  title?: string | number | VNode;
};

export const emptyStateRootVariants = cva('flex max-w-full flex-col items-center font-sans', {
  variants: {
    variant: {
      page: 'min-h-80 justify-center gap-5 px-6 py-16 text-center',
      section: 'gap-4 px-6 py-10 text-center',
      table: 'gap-3 px-4 py-8 text-center',
      compact: 'items-start gap-2 px-3 py-4 text-left',
    },
  },
  defaultVariants: {
    variant: 'section',
  },
});

export const emptyStateIconVariants = cva('grid shrink-0 place-items-center rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-hugo-surface-subtle text-hugo-text-subtle',
      danger: 'bg-hugo-error-bg text-hugo-status-error',
      info: 'bg-hugo-surface-tinted text-hugo-brand-deep',
    },
    variant: {
      page: 'size-14 [&_svg]:size-7',
      section: 'size-12 [&_svg]:size-6',
      table: 'size-10 [&_svg]:size-5',
      compact: 'size-8 [&_svg]:size-4',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    variant: 'section',
  },
});
