export const modalOverlayClass =
  'fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0';

export const modalContentClass = [
  'fixed z-50 flex flex-col overflow-hidden bg-hugo-surface-default text-hugo-text-default shadow-hugo-medium outline-none',
  'inset-0 h-[100dvh] w-screen rounded-none',
  'data-[loading=true]:data-[show-loading-indicator=false]:text-hugo-text-disabled',
  'min-[687px]:inset-auto min-[687px]:top-1/2 min-[687px]:left-1/2 min-[687px]:h-auto min-[687px]:max-h-[calc(100dvh-104px)] min-[687px]:w-[686px] min-[687px]:max-w-[calc(100vw-48px)] min-[687px]:-translate-x-1/2 min-[687px]:-translate-y-1/2 min-[687px]:rounded-lg',
  'data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
].join(' ');

export const modalHeaderClass = [
  'relative flex shrink-0 items-start bg-hugo-surface-default px-6',
  'data-[closeable=true]:pr-[57px]',
  'min-[687px]:px-8 min-[687px]:data-[closeable=true]:pr-[65px]',
].join(' ');

export const modalTitleClass = [
  'flex min-h-20 flex-1 items-center gap-4 py-6 text-2xl font-semibold leading-8 text-hugo-text-primary',
  'data-[type=destructive]:text-hugo-status-error data-[type=warning]:text-hugo-brand-primary',
].join(' ');

export const modalTitleIconClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center [&_svg]:h-10 [&_svg]:w-10';

export const modalTitleTextClass = 'min-w-0 break-words py-[5px]';

export const modalCloseButtonClass = [
  'absolute top-6 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-hugo-text-default outline-none transition-colors',
  'hover:border-hugo-brand-accent hover:bg-hugo-button-tertiary-brand-hover active:border-hugo-brand-deep active:bg-hugo-button-tertiary-brand-active',
  'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
  'min-[687px]:right-6',
].join(' ');

export const modalBodyClass = [
  'flex min-h-0 flex-1 flex-col overflow-y-auto bg-hugo-surface-default px-6 pb-8',
  'data-[has-header=false]:pt-8',
  'min-[687px]:px-8',
].join(' ');

export const modalBodyContentClass =
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:select-none data-[disabled=true]:text-hugo-text-disabled data-[disabled=true]:[&_*]:text-hugo-text-disabled';

export const modalSubtitleClass = 'mb-4 text-base font-semibold leading-6 text-hugo-text-primary';

export const modalContentTextClass = 'text-base font-normal leading-6 text-hugo-text-default';

export const modalLoadingIndicatorClass =
  'flex min-h-32 flex-1 items-center justify-center text-hugo-brand-primary';

export const modalSpinnerClass =
  'h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent';

export const modalScreenReaderStatusClass =
  'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]';

export const modalFooterClass = [
  'flex shrink-0 flex-col-reverse gap-2 bg-hugo-neutral-200 px-6 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]',
  'min-[687px]:h-[88px] min-[687px]:flex-row min-[687px]:items-center min-[687px]:justify-end min-[687px]:gap-4 min-[687px]:px-8 min-[687px]:py-0',
  'data-[has-tertiary=true]:min-[687px]:justify-between',
].join(' ');

export const modalFooterButtonsClass =
  'flex w-full flex-col-reverse gap-2 min-[687px]:w-auto min-[687px]:flex-row min-[687px]:justify-end min-[687px]:gap-2';

export const modalTertiaryActionClass = [
  'inline-flex min-h-10 items-center justify-center rounded-full px-2 text-sm font-semibold leading-5 text-hugo-brand-accent outline-none transition-colors',
  'hover:bg-hugo-button-tertiary-brand-hover hover:ring-1 hover:ring-hugo-brand-accent hover:ring-inset',
  'active:bg-hugo-button-tertiary-brand-active active:text-hugo-brand-deep active:ring-1 active:ring-hugo-brand-deep active:ring-inset',
  'focus-visible:ring-2 focus-visible:ring-hugo-focus focus-visible:ring-inset',
  'aria-disabled:pointer-events-none aria-disabled:text-hugo-text-disabled',
].join(' ');
