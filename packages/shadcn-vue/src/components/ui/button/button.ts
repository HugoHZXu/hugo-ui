import type { Component, HTMLAttributes } from 'vue';
import { cva } from 'class-variance-authority';

export type HugoUIShadcnVueButtonVariant = 'solid' | 'outline' | 'ghost';
export type HugoUIShadcnVueButtonSize = 'sm' | 'default' | 'lg' | 'icon';
export type HugoUIShadcnVueButtonTone = 'brand' | 'neutral' | 'danger' | 'inverse';

export const buttonVariants = cva(
  [
    'hugo-ui-shadcn-vue-button relative inline-flex min-w-fit cursor-pointer items-center justify-center',
    'box-border rounded-full border-0 font-sans text-sm font-semibold leading-hugo-button',
    'tracking-hugo-button whitespace-nowrap outline-none transition-colors duration-150 ease-linear',
    'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
    'data-[tone=inverse]:focus-visible:ring-hugo-focus-on-dark',
    'disabled:cursor-not-allowed data-[loading=true]:cursor-not-allowed',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-hugo-neutral-disabled',
    'data-[disabled=true]:text-hugo-text-inverse data-[disabled=true]:ring-0',
    'data-[variant=outline]:data-[disabled=true]:bg-transparent data-[variant=outline]:data-[disabled=true]:text-hugo-text-disabled',
    'data-[variant=outline]:data-[disabled=true]:ring-1 data-[variant=outline]:data-[disabled=true]:ring-hugo-neutral-disabled',
    'data-[variant=ghost]:data-[disabled=true]:bg-transparent data-[variant=ghost]:data-[disabled=true]:text-hugo-text-disabled',
    'data-[variant=ghost]:data-[disabled=true]:ring-1 data-[variant=ghost]:data-[disabled=true]:ring-hugo-neutral-disabled',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'bg-transparent ring-1 ring-hugo-button-border-mid ring-inset',
        ghost: 'bg-transparent ring-0',
      },
      tone: {
        brand: '',
        neutral: '',
        danger: '',
        inverse: '',
      },
      size: {
        sm: 'h-6 px-4 text-xs leading-4 tracking-hugo-button-small [&_svg]:h-4 [&_svg]:w-4',
        default: 'h-10 px-6 [&_svg]:h-6 [&_svg]:w-6',
        lg: 'h-12 px-8 [&_svg]:h-6 [&_svg]:w-6',
        icon: 'h-10 w-14 px-0 [&_svg]:h-6 [&_svg]:w-6',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'brand',
        className:
          'bg-hugo-brand-primary text-hugo-text-inverse hover:bg-hugo-button-brand-hover active:bg-hugo-button-brand-active data-[loading=true]:bg-hugo-button-brand-active',
      },
      {
        variant: 'solid',
        tone: 'danger',
        className:
          'bg-hugo-status-error text-hugo-text-inverse hover:bg-hugo-status-destruct-strong active:bg-hugo-status-destruct-active data-[loading=true]:bg-hugo-status-destruct-active',
      },
      {
        variant: 'solid',
        tone: 'inverse',
        className:
          'bg-hugo-surface-default text-hugo-brand-accent hover:bg-hugo-button-inverse-hover active:bg-hugo-button-inverse-active active:text-hugo-brand-deep data-[loading=true]:bg-hugo-button-inverse-active data-[loading=true]:text-hugo-brand-deep',
      },
      {
        variant: 'solid',
        tone: 'neutral',
        className:
          'bg-hugo-neutral-1200 text-hugo-text-inverse hover:bg-hugo-neutral-1100 active:bg-hugo-neutral-1200',
      },
      {
        variant: 'outline',
        tone: 'brand',
        className:
          'text-hugo-brand-accent hover:bg-hugo-button-brand-soft-hover hover:ring-hugo-brand-accent active:bg-hugo-button-brand-soft-active active:text-hugo-brand-deep active:ring-hugo-brand-deep data-[loading=true]:bg-hugo-button-brand-soft-active data-[loading=true]:text-hugo-brand-deep data-[loading=true]:ring-hugo-brand-deep',
      },
      {
        variant: 'outline',
        tone: 'neutral',
        className:
          'text-hugo-neutral-1200 hover:bg-hugo-neutral-200 hover:ring-hugo-neutral-800 active:bg-hugo-neutral-500 active:ring-hugo-neutral-1100 data-[loading=true]:bg-hugo-neutral-500 data-[loading=true]:ring-hugo-neutral-1100',
      },
      {
        variant: 'outline',
        tone: 'inverse',
        className:
          'text-hugo-text-inverse ring-hugo-button-border-light hover:bg-hugo-button-brand-soft-hover',
      },
      {
        variant: 'outline',
        tone: 'danger',
        className: 'text-hugo-status-error hover:bg-hugo-error-bg hover:ring-hugo-status-error',
      },
      {
        variant: 'ghost',
        tone: 'brand',
        className:
          'text-hugo-brand-accent hover:bg-hugo-button-tertiary-brand-hover hover:ring-1 hover:ring-hugo-brand-accent hover:ring-inset active:bg-hugo-button-tertiary-brand-active active:text-hugo-brand-deep active:ring-1 active:ring-hugo-brand-deep active:ring-inset data-[loading=true]:bg-hugo-button-tertiary-brand-active data-[loading=true]:text-hugo-brand-deep data-[loading=true]:ring-1 data-[loading=true]:ring-hugo-brand-deep data-[loading=true]:ring-inset',
      },
      {
        variant: 'ghost',
        tone: 'neutral',
        className:
          'text-hugo-neutral-1200 hover:bg-hugo-neutral-200 hover:ring-1 hover:ring-hugo-neutral-800 hover:ring-inset',
      },
      {
        variant: 'ghost',
        tone: 'inverse',
        className:
          'text-hugo-text-inverse hover:bg-hugo-button-brand-soft-hover hover:ring-1 hover:ring-hugo-text-inverse hover:ring-inset',
      },
      {
        variant: 'ghost',
        tone: 'danger',
        className:
          'text-hugo-status-error hover:bg-hugo-error-bg hover:ring-1 hover:ring-hugo-status-error hover:ring-inset',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      tone: 'brand',
      size: 'default',
    },
  }
);

export type ButtonProps = {
  as?: string | Component;
  asChild?: boolean;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  loading?: boolean;
  loadingPosition?: 'start' | 'center';
  size?: HugoUIShadcnVueButtonSize;
  tone?: HugoUIShadcnVueButtonTone;
  type?: 'button' | 'submit' | 'reset';
  variant?: HugoUIShadcnVueButtonVariant;
};
