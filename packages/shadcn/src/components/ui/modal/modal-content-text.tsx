import * as React from 'react';

import { cn } from '@/components/lib/utils';

import { modalContentTextClass } from './modal.styles';
import type { ModalContentTextProps } from './modal.types';

export function ModalContentText({ className, ...props }: ModalContentTextProps) {
  return (
    <p data-slot="modal-content-text" className={cn(modalContentTextClass, className)} {...props} />
  );
}
