import * as React from 'react';

import { cn } from '@/components/lib/utils';

import {
  modalLoadingIndicatorClass,
  modalScreenReaderStatusClass,
  modalSpinnerClass,
} from './modal.styles';
import type { ModalClassNames, ModalSlotProps } from './modal.types';

type ModalLoadingIndicatorProps = {
  className?: string;
  classNames?: Pick<ModalClassNames, 'loadingIndicator' | 'screenReaderStatus'>;
  loading?: boolean;
  slotProps?: Pick<ModalSlotProps, 'loadingIndicator'>;
};

export function ModalLoadingIndicator({
  className,
  classNames,
  loading,
  slotProps,
}: ModalLoadingIndicatorProps) {
  const [readoutLoading, setReadoutLoading] = React.useState(false);
  const { className: loadingSlotClassName, ...loadingProps } = slotProps?.loadingIndicator ?? {};

  React.useEffect(() => {
    if (!loading) {
      setReadoutLoading(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setReadoutLoading(true);
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [loading]);

  return (
    <>
      {loading && (
        <div
          {...loadingProps}
          className={cn(
            modalLoadingIndicatorClass,
            classNames?.loadingIndicator,
            loadingSlotClassName,
            className
          )}
          data-slot="modal-loading-indicator"
        >
          <span aria-hidden="true" className={modalSpinnerClass} data-slot="modal-spinner" />
        </div>
      )}
      <div
        aria-live="polite"
        className={cn(modalScreenReaderStatusClass, classNames?.screenReaderStatus)}
        data-slot="modal-screen-reader-status"
      >
        {readoutLoading ? 'Loading' : ''}
      </div>
    </>
  );
}
