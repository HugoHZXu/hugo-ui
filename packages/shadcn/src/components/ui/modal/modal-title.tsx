import * as React from 'react';
import { CircleAlert, TriangleAlert, X } from 'lucide-react';

import { cn } from '@/components/lib/utils';
import { DialogClose, DialogTitle } from '@/components/ui/dialog';

import {
  modalCloseButtonClass,
  modalTitleClass,
  modalTitleIconClass,
  modalTitleTextClass,
} from './modal.styles';
import type { ModalTitleProps, ModalType } from './modal.types';

const statusIconByType: Partial<
  Record<
    ModalType,
    {
      Icon: typeof CircleAlert;
      ariaLabel: string;
      className: string;
    }
  >
> = {
  destructive: {
    Icon: CircleAlert,
    ariaLabel: 'alert',
    className: 'text-hugo-status-error',
  },
  error: {
    Icon: CircleAlert,
    ariaLabel: 'alert',
    className: 'text-hugo-status-warning',
  },
  warning: {
    Icon: TriangleAlert,
    ariaLabel: 'warning',
    className: 'text-hugo-brand-primary',
  },
};

export function ModalTitle({
  className,
  classNames,
  closeable = true,
  onClose,
  prefixIcon,
  title,
  type = 'transactional',
}: ModalTitleProps) {
  const renderIcon = () => {
    if (prefixIcon) {
      const iconProps = prefixIcon.props;
      return (
        <span
          aria-hidden="true"
          className={cn(modalTitleIconClass, classNames?.titleIcon)}
          data-slot="modal-title-icon"
        >
          {React.cloneElement(prefixIcon, {
            className: cn(iconProps.className),
          })}
        </span>
      );
    }

    const iconDefinition = statusIconByType[type];

    if (!iconDefinition) {
      return null;
    }

    const { Icon, ariaLabel, className: iconClassName } = iconDefinition;

    return (
      <span className={cn(modalTitleIconClass, classNames?.titleIcon)} data-slot="modal-title-icon">
        <Icon aria-label={ariaLabel} className={iconClassName} role="img" />
      </span>
    );
  };

  return (
    <>
      <DialogTitle
        className={cn(modalTitleClass, className)}
        data-slot="modal-title"
        data-type={type}
      >
        {renderIcon()}
        {title && (
          <span
            className={cn(modalTitleTextClass, classNames?.titleText)}
            data-slot="modal-title-text"
          >
            {title}
          </span>
        )}
      </DialogTitle>
      {closeable && (
        <DialogClose asChild>
          <button
            aria-label="close"
            className={cn(modalCloseButtonClass, classNames?.closeButton)}
            data-slot="modal-close"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </DialogClose>
      )}
    </>
  );
}
