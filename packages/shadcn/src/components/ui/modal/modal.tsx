import * as React from 'react';

import { cn } from '@/components/lib/utils';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

import { ModalContentText } from './modal-content-text';
import { ModalFooter } from './modal-footer';
import { ModalLoadingIndicator } from './modal-loading';
import {
  modalBodyClass,
  modalBodyContentClass,
  modalContentClass,
  modalHeaderClass,
  modalOverlayClass,
  modalSubtitleClass,
} from './modal.styles';
import { ModalTitle } from './modal-title';
import type { ModalButtonProps, ModalButtonsType, ModalProps, ModalType } from './modal.types';

const actionModalTypes: ModalType[] = ['transactional', 'destructive', 'warning'];

const isActionModalType = (type: ModalType) => actionModalTypes.includes(type);

const withLoadingConstraints = (
  actions: ModalButtonsType,
  loading: boolean | undefined,
  showLoadingIndicator: boolean
): ModalButtonsType => {
  if (!loading) {
    return actions;
  }

  const primaryConstraintProps: Pick<ModalButtonProps, 'disabled' | 'loading' | 'loadingPosition'> =
    showLoadingIndicator
      ? { disabled: true }
      : actions.secondary?.loading
        ? { disabled: true }
        : { loading: true, loadingPosition: 'center' };
  const secondaryConstraintProps: Pick<
    ModalButtonProps,
    'disabled' | 'loading' | 'loadingPosition'
  > = showLoadingIndicator
    ? { disabled: true }
    : actions.secondary?.loading
      ? { loading: true, loadingPosition: 'center' }
      : { disabled: true };

  return {
    ...actions,
    primary: actions.primary ? { ...actions.primary, ...primaryConstraintProps } : undefined,
    secondary: actions.secondary
      ? { ...actions.secondary, ...secondaryConstraintProps }
      : undefined,
    tertiary: actions.tertiary ? { ...actions.tertiary, disabled: true } : undefined,
  };
};

const createModalActions = ({
  buttonDefs,
  loading,
  onClose,
  showLoadingIndicator,
  type,
}: {
  buttonDefs?: ModalButtonsType;
  loading?: boolean;
  onClose?: () => void;
  showLoadingIndicator: boolean;
  type: ModalType;
}) => {
  const primaryDefaults: ModalButtonProps = {
    label: 'Save',
    size: 'lg',
    tone: 'brand',
    variant: 'solid',
  };
  const secondaryDefaults: ModalButtonProps = {
    label: 'Cancel',
    onClick: onClose,
    size: 'lg',
    tone: 'brand',
    variant: 'outline',
  };

  const typeDefaults: ModalButtonsType =
    type === 'destructive'
      ? {
          primary: { label: 'Destruct', tone: 'danger', variant: 'solid' },
          secondary: { tone: 'neutral', variant: 'outline' },
        }
      : type === 'warning'
        ? {
            secondary: { label: 'Leave without saving', tone: 'brand', variant: 'outline' },
          }
        : {};

  const actions: ModalButtonsType = {
    primary: {
      ...primaryDefaults,
      ...typeDefaults.primary,
      ...buttonDefs?.primary,
    },
    secondary: {
      ...secondaryDefaults,
      ...typeDefaults.secondary,
      ...buttonDefs?.secondary,
    },
  };

  if (typeDefaults.tertiary || buttonDefs?.tertiary) {
    actions.tertiary = {
      ...typeDefaults.tertiary,
      ...buttonDefs?.tertiary,
    };
  }

  return withLoadingConstraints(actions, loading, showLoadingIndicator);
};

export function Modal({
  ariaLabel,
  buttonDefs,
  children,
  className,
  classNames,
  closeButton,
  disableAutoFocus,
  footerComponent,
  headerComponent,
  headerPrefixIcon,
  loading,
  modal = true,
  onClose,
  onOpenChange,
  open,
  showLoadingIndicator,
  slotProps,
  subTitle,
  title,
  type = 'transactional',
}: ModalProps) {
  const showActions = isActionModalType(type);
  const closeable = closeButton ?? !showActions;
  const shouldRenderHeader = Boolean(headerComponent || title || headerPrefixIcon || closeable);
  const resolvedShowLoadingIndicator = showLoadingIndicator ?? !showActions;
  const showCenteredLoading = Boolean(loading && resolvedShowLoadingIndicator);
  const bodyContentDisabled = Boolean(loading && !resolvedShowLoadingIndicator);
  const { className: overlaySlotClassName, ...overlayProps } = slotProps?.overlay ?? {};
  const { className: contentSlotClassName, ...contentProps } = slotProps?.content ?? {};
  const { className: headerSlotClassName, ...headerProps } = slotProps?.header ?? {};
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      onClose?.();
    }
  };
  const { className: bodySlotClassName, ...bodyProps } = slotProps?.body ?? {};
  const actions = showActions
    ? createModalActions({
        buttonDefs,
        loading,
        onClose: () => handleOpenChange(false),
        showLoadingIndicator: resolvedShowLoadingIndicator,
        type,
      })
    : undefined;

  return (
    <Dialog modal={modal} onOpenChange={handleOpenChange} open={open}>
      <DialogPortal>
        <DialogOverlay
          {...overlayProps}
          className={cn(modalOverlayClass, classNames?.overlay, overlaySlotClassName)}
        />
        <DialogContent
          {...contentProps}
          aria-label={!title ? ariaLabel : undefined}
          className={cn(modalContentClass, classNames?.content, contentSlotClassName, className)}
          data-loading={loading ? 'true' : undefined}
          data-show-loading-indicator={resolvedShowLoadingIndicator ? 'true' : 'false'}
          data-type={type}
        >
          {headerComponent ??
            (shouldRenderHeader && (
              <div
                {...headerProps}
                className={cn(modalHeaderClass, classNames?.header, headerSlotClassName)}
                data-closeable={closeable ? 'true' : undefined}
                data-slot="modal-header"
              >
                <ModalTitle
                  className={classNames?.title}
                  classNames={classNames}
                  closeable={closeable}
                  prefixIcon={headerPrefixIcon}
                  title={title}
                  type={type}
                />
              </div>
            ))}
          <div
            {...bodyProps}
            className={cn(modalBodyClass, classNames?.body, bodySlotClassName)}
            data-has-header={shouldRenderHeader ? 'true' : 'false'}
            data-slot="modal-body"
          >
            <ModalLoadingIndicator
              classNames={classNames}
              loading={showCenteredLoading}
              slotProps={slotProps}
            />
            {!showCenteredLoading && (
              <div
                className={cn(modalBodyContentClass, classNames?.bodyContent)}
                data-disabled={bodyContentDisabled ? 'true' : undefined}
                data-slot="modal-body-content"
              >
                {subTitle && (
                  <h3
                    className={cn(modalSubtitleClass, classNames?.subtitle)}
                    data-slot="modal-subtitle"
                  >
                    {subTitle}
                  </h3>
                )}
                {children}
              </div>
            )}
          </div>
          {footerComponent ??
            (showActions && (
              <ModalFooter
                actionProps={actions}
                className={classNames?.footer}
                classNames={classNames}
                disableAutoFocus={disableAutoFocus}
                {...slotProps?.footer}
              />
            ))}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export { ModalContentText };
