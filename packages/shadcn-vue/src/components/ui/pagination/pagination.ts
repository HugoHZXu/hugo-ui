import type { Component, HTMLAttributes } from 'vue';
import type {
  PaginationEllipsisProps as RekaPaginationEllipsisProps,
  PaginationFirstProps as RekaPaginationFirstProps,
  PaginationLastProps as RekaPaginationLastProps,
  PaginationListItemProps as RekaPaginationListItemProps,
  PaginationListProps as RekaPaginationListProps,
  PaginationNextProps as RekaPaginationNextProps,
  PaginationPrevProps as RekaPaginationPrevProps,
  PaginationRootEmits as RekaPaginationRootEmits,
  PaginationRootProps as RekaPaginationRootProps,
} from 'reka-ui';
import { cva } from 'class-variance-authority';

export type PaginationControlSize = 'sm' | 'default';

export const paginationRootClass =
  'flex w-full min-w-0 items-center justify-center font-sans text-hugo-text-default';

export const paginationContentClass = 'flex flex-row flex-wrap items-center justify-center gap-1';

export const paginationControlVariants = cva(
  [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border',
    'border-transparent bg-transparent font-sans font-semibold outline-none',
    'transition-colors duration-150 ease-linear',
    'hover:bg-hugo-surface-tinted hover:text-hugo-brand-deep',
    'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
    'data-[selected=true]:border-hugo-brand-accent data-[selected=true]:bg-hugo-surface-tinted',
    'data-[selected=true]:text-hugo-brand-deep',
    'disabled:cursor-not-allowed disabled:text-hugo-text-disabled disabled:hover:bg-transparent',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-hugo-text-disabled',
    'data-[disabled=true]:hover:bg-transparent',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      active: {
        false: 'text-hugo-text-default',
        true: 'border-hugo-brand-accent bg-hugo-surface-tinted text-hugo-brand-deep',
      },
      iconOnly: {
        false: '',
        true: 'px-0',
      },
      size: {
        sm: 'h-8 min-w-8 px-2 text-xs leading-4',
        default: 'h-9 min-w-9 px-3 text-sm leading-5',
      },
    },
    defaultVariants: {
      active: false,
      iconOnly: false,
      size: 'default',
    },
  }
);

export const paginationEllipsisClass =
  'inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-md text-hugo-text-subtle [&_svg]:size-4';

export type PaginationProps = Omit<RekaPaginationRootProps, 'class' | 'itemsPerPage'> & {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  itemsPerPage?: number;
};

export type PaginationEmits = RekaPaginationRootEmits;

export type PaginationContentProps = Omit<RekaPaginationListProps, 'class'> & {
  class?: HTMLAttributes['class'];
};

export type PaginationItemProps = Omit<Partial<RekaPaginationListItemProps>, 'class'> & {
  class?: HTMLAttributes['class'];
  isActive?: boolean;
  size?: PaginationControlSize;
};

export type PaginationLinkProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  href?: string;
  isActive?: boolean;
  size?: PaginationControlSize;
  type?: 'button' | 'submit' | 'reset';
};

export type PaginationLinkEmits = {
  (event: 'click', value: MouseEvent): void;
};

export type PaginationDirectionProps<T> = Omit<T, 'class'> & {
  class?: HTMLAttributes['class'];
  label?: string;
  showLabel?: boolean;
  size?: PaginationControlSize;
};

export type PaginationPreviousProps = PaginationDirectionProps<RekaPaginationPrevProps>;
export type PaginationNextProps = PaginationDirectionProps<RekaPaginationNextProps>;
export type PaginationFirstProps = PaginationDirectionProps<RekaPaginationFirstProps>;
export type PaginationLastProps = PaginationDirectionProps<RekaPaginationLastProps>;

export type PaginationEllipsisProps = Omit<RekaPaginationEllipsisProps, 'class'> & {
  class?: HTMLAttributes['class'];
};
