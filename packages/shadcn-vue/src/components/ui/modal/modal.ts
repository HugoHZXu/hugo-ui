import type { HTMLAttributes, VNode } from 'vue';

import type {
  HugoUIShadcnVueButtonSize,
  HugoUIShadcnVueButtonTone,
  HugoUIShadcnVueButtonVariant,
} from '@/components/ui/button/button';

export type ModalType = 'transactional' | 'destructive' | 'warning' | 'informational' | 'error';

export type ModalClassNames = {
  overlay?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  header?: HTMLAttributes['class'];
  title?: HTMLAttributes['class'];
  titleIcon?: HTMLAttributes['class'];
  titleText?: HTMLAttributes['class'];
  closeButton?: HTMLAttributes['class'];
  body?: HTMLAttributes['class'];
  bodyContent?: HTMLAttributes['class'];
  subtitle?: HTMLAttributes['class'];
  contentText?: HTMLAttributes['class'];
  footer?: HTMLAttributes['class'];
  footerButtons?: HTMLAttributes['class'];
  tertiaryAction?: HTMLAttributes['class'];
  loadingIndicator?: HTMLAttributes['class'];
  screenReaderStatus?: HTMLAttributes['class'];
};

export type ModalSlotAttributes = HTMLAttributes & Record<string, unknown>;

export type ModalSlotProps = {
  portal?: ModalSlotAttributes;
  overlay?: ModalSlotAttributes;
  content?: ModalSlotAttributes;
  header?: ModalSlotAttributes;
  body?: ModalSlotAttributes;
  footer?: ModalSlotAttributes;
  loadingIndicator?: ModalSlotAttributes;
};

export type ModalButtonProps = {
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  hidden?: boolean;
  label?: string | number | VNode;
  loading?: boolean;
  loadingPosition?: 'start' | 'center';
  onClick?: (event: MouseEvent) => void;
  size?: HugoUIShadcnVueButtonSize;
  tone?: HugoUIShadcnVueButtonTone;
  variant?: HugoUIShadcnVueButtonVariant;
};

export type ModalTertiaryActionProps = {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  hidden?: boolean;
  href?: string;
  label?: string | number | VNode;
  onClick?: (event: MouseEvent) => void;
  rel?: string;
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
  class?: HTMLAttributes['class'];
  classNames?: ModalClassNames;
  closeButton?: boolean;
  defaultOpen?: boolean;
  disableAutoFocus?: boolean;
  loading?: boolean;
  modal?: boolean;
  modelValue?: boolean;
  open?: boolean;
  showLoadingIndicator?: boolean;
  slotProps?: ModalSlotProps;
  subTitle?: string | number | VNode;
  title?: string | number | VNode;
  type?: ModalType;
};

export type ModalEmits = {
  (event: 'update:modelValue', value: boolean): void;
  (event: 'update:open', value: boolean): void;
  (event: 'openChange', value: boolean): void;
  (event: 'close'): void;
};

export type ModalTitleProps = {
  class?: HTMLAttributes['class'];
  classNames?: Pick<ModalClassNames, 'closeButton' | 'titleIcon' | 'titleText'>;
  closeable?: boolean;
  title?: string | number | VNode;
  type?: ModalType;
};

export type ModalFooterProps = {
  actionProps?: ModalButtonsType;
  class?: HTMLAttributes['class'];
  classNames?: Pick<ModalClassNames, 'footerButtons' | 'tertiaryAction'>;
  disableAutoFocus?: boolean;
};

export type ModalContentTextProps = {
  asChild?: boolean;
  class?: HTMLAttributes['class'];
};

export type ModalLoadingIndicatorProps = {
  class?: HTMLAttributes['class'];
  classNames?: Pick<ModalClassNames, 'loadingIndicator' | 'screenReaderStatus'>;
  loading?: boolean;
  slotProps?: Pick<ModalSlotProps, 'loadingIndicator'>;
};
