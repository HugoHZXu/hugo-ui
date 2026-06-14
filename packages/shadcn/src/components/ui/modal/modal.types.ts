import * as React from 'react';

import type { ButtonProps } from '@/components/ui/button';
import type { DialogContent, DialogOverlay } from '@/components/ui/dialog';

export type ModalType = 'transactional' | 'destructive' | 'warning' | 'informational' | 'error';

export type ModalClassNames = {
  overlay?: string;
  content?: string;
  header?: string;
  title?: string;
  titleIcon?: string;
  titleText?: string;
  closeButton?: string;
  body?: string;
  bodyContent?: string;
  subtitle?: string;
  contentText?: string;
  footer?: string;
  footerButtons?: string;
  tertiaryAction?: string;
  loadingIndicator?: string;
  screenReaderStatus?: string;
};

export type ModalSlotProps = {
  overlay?: React.ComponentProps<typeof DialogOverlay>;
  content?: Omit<React.ComponentProps<typeof DialogContent>, 'children'>;
  header?: React.HTMLAttributes<HTMLDivElement>;
  body?: React.HTMLAttributes<HTMLDivElement>;
  footer?: React.HTMLAttributes<HTMLDivElement>;
  loadingIndicator?: React.HTMLAttributes<HTMLDivElement>;
};

type NativeModalButtonProps = Omit<ButtonProps, 'children' | 'type'>;

export type ModalButtonProps = NativeModalButtonProps & {
  hidden?: boolean;
  label?: React.ReactNode;
};

export type ModalTertiaryActionProps = {
  'aria-label'?: string;
  className?: string;
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  label?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  rel?: string;
  renderCustomComponent?: () => React.ReactNode;
  target?: string;
};

export type ModalButtonsType = {
  primary?: ModalButtonProps;
  secondary?: ModalButtonProps;
  tertiary?: ModalTertiaryActionProps;
};

export type ModalProps = {
  ariaLabel?: string;
  buttonDefs?: ModalButtonsType;
  children?: React.ReactNode;
  className?: string;
  classNames?: ModalClassNames;
  closeButton?: boolean;
  disableAutoFocus?: boolean;
  footerComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  headerPrefixIcon?: React.ReactElement<{ className?: string }>;
  loading?: boolean;
  modal?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  showLoadingIndicator?: boolean;
  slotProps?: ModalSlotProps;
  subTitle?: React.ReactNode;
  title?: React.ReactNode;
  type?: ModalType;
};

export type ModalTitleProps = {
  className?: string;
  classNames?: Pick<ModalClassNames, 'closeButton' | 'titleIcon' | 'titleText'>;
  closeable?: boolean;
  onClose?: () => void;
  prefixIcon?: React.ReactElement<{ className?: string }>;
  title?: React.ReactNode;
  type?: ModalType;
};

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  actionProps?: ModalButtonsType;
  classNames?: Pick<ModalClassNames, 'footerButtons' | 'tertiaryAction'>;
  disableAutoFocus?: boolean;
};

export type ModalContentTextProps = React.ComponentProps<'p'>;
