import type { Component, HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';

export type HugoUIShadcnVueLinkSize = 'small' | 'medium';
export type HugoUIShadcnVueLinkMode = 'white' | 'light' | 'dark' | 'error';

export const linkVariants = cva(
  [
    'hugo-ui-shadcn-vue-link inline-flex w-fit min-w-0 items-center gap-2 align-baseline',
    'border-0 bg-transparent p-0 font-sans font-normal underline underline-offset-2',
    'cursor-pointer appearance-none outline-none transition-colors duration-150 ease-linear',
    'text-[var(--hugo-ui-shadcn-link-color)] hover:text-[var(--hugo-ui-shadcn-link-hover-color)]',
    'visited:text-[var(--hugo-ui-shadcn-link-visited-color)] visited:hover:text-[var(--hugo-ui-shadcn-link-hover-color)]',
    'focus-visible:-mx-[3px] focus-visible:px-[3px] focus-visible:outline focus-visible:outline-2',
    'focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--hugo-ui-shadcn-link-focus-color)]',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-[var(--hugo-ui-shadcn-link-disabled-color)]',
    'data-[disabled=true]:hover:text-[var(--hugo-ui-shadcn-link-disabled-color)]',
    'data-[disabled=true]:visited:text-[var(--hugo-ui-shadcn-link-disabled-color)]',
    'data-[disabled=true]:focus-visible:outline-none',
    'data-[loading=true]:cursor-default data-[loading=true]:no-underline',
    'data-[loading=true]:text-[var(--hugo-ui-shadcn-link-loading-color)]',
    'data-[loading=true]:hover:text-[var(--hugo-ui-shadcn-link-loading-color)]',
    'data-[loading=true]:visited:text-[var(--hugo-ui-shadcn-link-loading-color)]',
    'data-[loading=true]:focus-visible:outline-none',
  ],
  {
    variants: {
      mode: {
        white: [
          '[--hugo-ui-shadcn-link-color:var(--hugo-ui-shadcn-link-white)]',
          '[--hugo-ui-shadcn-link-hover-color:var(--hugo-ui-shadcn-link-hover)]',
          '[--hugo-ui-shadcn-link-visited-color:var(--hugo-ui-shadcn-link-visited)]',
          '[--hugo-ui-shadcn-link-disabled-color:var(--hugo-ui-shadcn-link-disabled)]',
          '[--hugo-ui-shadcn-link-focus-color:var(--hugo-ui-shadcn-link-focus)]',
          '[--hugo-ui-shadcn-link-loading-color:var(--hugo-ui-shadcn-link-loading)]',
        ].join(' '),
        light: [
          '[--hugo-ui-shadcn-link-color:var(--hugo-ui-shadcn-link-light)]',
          '[--hugo-ui-shadcn-link-hover-color:var(--hugo-ui-shadcn-link-hover)]',
          '[--hugo-ui-shadcn-link-visited-color:var(--hugo-ui-shadcn-link-visited)]',
          '[--hugo-ui-shadcn-link-disabled-color:var(--hugo-ui-shadcn-link-disabled)]',
          '[--hugo-ui-shadcn-link-focus-color:var(--hugo-ui-shadcn-link-focus)]',
          '[--hugo-ui-shadcn-link-loading-color:var(--hugo-ui-shadcn-link-loading)]',
        ].join(' '),
        dark: [
          '[--hugo-ui-shadcn-link-color:var(--hugo-ui-shadcn-link-dark)]',
          '[--hugo-ui-shadcn-link-hover-color:var(--hugo-ui-shadcn-link-dark-hover)]',
          '[--hugo-ui-shadcn-link-visited-color:var(--hugo-ui-shadcn-link-dark-visited)]',
          '[--hugo-ui-shadcn-link-disabled-color:var(--hugo-ui-shadcn-link-dark-disabled)]',
          '[--hugo-ui-shadcn-link-focus-color:var(--hugo-ui-shadcn-link-dark-focus)]',
          '[--hugo-ui-shadcn-link-loading-color:var(--hugo-ui-shadcn-link-dark-loading)]',
        ].join(' '),
        error: [
          '[--hugo-ui-shadcn-link-color:var(--hugo-ui-shadcn-link-error)]',
          '[--hugo-ui-shadcn-link-hover-color:var(--hugo-ui-shadcn-link-error-hover)]',
          '[--hugo-ui-shadcn-link-visited-color:var(--hugo-ui-shadcn-link-error-visited)]',
          '[--hugo-ui-shadcn-link-disabled-color:var(--hugo-ui-shadcn-link-disabled)]',
          '[--hugo-ui-shadcn-link-focus-color:var(--hugo-ui-shadcn-link-focus)]',
          '[--hugo-ui-shadcn-link-loading-color:var(--hugo-ui-shadcn-link-loading)]',
        ].join(' '),
      },
      size: {
        small: 'text-xs leading-5',
        medium: 'text-sm leading-6',
      },
    },
    defaultVariants: {
      mode: 'white',
      size: 'medium',
    },
  }
);

export type LinkProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  href?: string;
  loading?: boolean;
  mode?: HugoUIShadcnVueLinkMode;
  rel?: string;
  size?: HugoUIShadcnVueLinkSize;
  target?: string;
  type?: 'button' | 'submit' | 'reset';
};
