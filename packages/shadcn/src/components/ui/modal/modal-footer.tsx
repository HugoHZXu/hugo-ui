import * as React from 'react';

import { cn } from '@/components/lib/utils';
import { Button } from '@/components/ui/button';

import {
  modalFooterButtonsClass,
  modalFooterClass,
  modalTertiaryActionClass,
} from './modal.styles';
import type { ModalFooterProps, ModalTertiaryActionProps } from './modal.types';

const renderTertiaryAction = (
  tertiary: ModalTertiaryActionProps | undefined,
  className?: string
) => {
  if (!tertiary || tertiary.hidden) {
    return null;
  }

  if (tertiary.renderCustomComponent) {
    return tertiary.renderCustomComponent();
  }

  if (!tertiary.label) {
    return null;
  }

  const {
    className: tertiaryClassName,
    disabled,
    href,
    label,
    onClick,
    rel,
    target,
    ...tertiaryProps
  } = tertiary;
  const sharedProps = {
    ...tertiaryProps,
    'aria-disabled': disabled ? true : undefined,
    className: cn(modalTertiaryActionClass, className, tertiaryClassName),
    'data-slot': 'modal-tertiary-action',
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    },
  };

  if (href) {
    return (
      <a href={href} rel={rel} target={target} {...sharedProps}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" {...sharedProps}>
      {label}
    </button>
  );
};

export function ModalFooter({
  actionProps,
  className,
  classNames,
  disableAutoFocus,
  ...props
}: ModalFooterProps) {
  const { primary, secondary, tertiary } = actionProps ?? {};
  const primaryRef = React.useRef<HTMLButtonElement | null>(null);
  const secondaryRef = React.useRef<HTMLButtonElement | null>(null);
  const tertiaryRef = React.useRef<HTMLElement | null>(null);
  const hasTertiary = Boolean(
    tertiary && !tertiary.hidden && (tertiary.label || tertiary.renderCustomComponent)
  );

  React.useEffect(() => {
    if (disableAutoFocus) {
      return;
    }

    if (hasTertiary && tertiaryRef.current) {
      tertiaryRef.current.focus();
      return;
    }

    if (secondary && !secondary.hidden) {
      secondaryRef.current?.focus();
      return;
    }

    primaryRef.current?.focus();
  }, [disableAutoFocus, hasTertiary, primary, secondary]);

  const renderPrimary = () => {
    if (!primary || primary.hidden) {
      return null;
    }

    const { label, ...buttonProps } = primary;

    return (
      <Button ref={primaryRef} {...buttonProps} type="button">
        {label ?? 'Save'}
      </Button>
    );
  };

  const renderSecondary = () => {
    if (!secondary || secondary.hidden) {
      return null;
    }

    const { label, ...buttonProps } = secondary;

    return (
      <Button ref={secondaryRef} {...buttonProps} type="button">
        {label ?? 'Cancel'}
      </Button>
    );
  };

  const tertiaryAction = renderTertiaryAction(
    tertiary
      ? {
          ...tertiary,
          renderCustomComponent: tertiary.renderCustomComponent
            ? () => (
                <span
                  ref={tertiaryRef as React.Ref<HTMLSpanElement>}
                  data-slot="modal-tertiary-action"
                >
                  {tertiary.renderCustomComponent?.()}
                </span>
              )
            : undefined,
        }
      : undefined,
    classNames?.tertiaryAction
  );

  return (
    <div
      className={cn(modalFooterClass, className)}
      data-has-tertiary={hasTertiary ? 'true' : undefined}
      data-slot="modal-footer"
      {...props}
    >
      {tertiaryAction &&
        React.cloneElement(tertiaryAction as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
          ref: tertiaryRef,
        })}
      <div
        className={cn(modalFooterButtonsClass, classNames?.footerButtons)}
        data-slot="modal-footer-buttons"
      >
        {renderSecondary()}
        {renderPrimary()}
      </div>
    </div>
  );
}
