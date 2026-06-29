import type { HTMLAttributes, VNode } from 'vue';
import { cva } from 'class-variance-authority';

export type FileDropzoneStatus = 'idle' | 'dragging' | 'selected' | 'error' | 'uploading' | 'done';

export type FileDropzoneRejectReason = 'invalid-type' | 'too-large' | 'too-many-files';

export type FileDropzoneRejection = {
  file: File;
  message: string;
  reason: FileDropzoneRejectReason;
};

export type FileDropzoneClassNames = {
  root?: HTMLAttributes['class'];
  input?: HTMLAttributes['class'];
  icon?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  title?: HTMLAttributes['class'];
  description?: HTMLAttributes['class'];
  files?: HTMLAttributes['class'];
  file?: HTMLAttributes['class'];
  actions?: HTMLAttributes['class'];
  error?: HTMLAttributes['class'];
};

export type FileDropzoneProps = {
  accept?: string | string[];
  browseLabel?: string | number | VNode;
  class?: HTMLAttributes['class'];
  classNames?: FileDropzoneClassNames;
  clearable?: boolean;
  description?: string | number | VNode;
  disabled?: boolean;
  error?: string | number | VNode;
  maxSize?: number;
  modelValue?: File[];
  multiple?: boolean;
  status?: FileDropzoneStatus;
  title?: string | number | VNode;
};

export type FileDropzoneEmits = {
  (event: 'update:modelValue', value: File[]): void;
  (event: 'select', value: File[]): void;
  (event: 'reject', value: FileDropzoneRejection[]): void;
  (event: 'clear'): void;
  (event: 'drop', value: DragEvent): void;
};

export const fileDropzoneRootVariants = cva(
  [
    'relative flex min-w-0 flex-col items-center justify-center rounded-lg border border-dashed',
    'bg-hugo-surface-default px-5 py-6 text-center font-sans transition-[background-color,border-color,color]',
    'duration-150 ease-linear outline-none',
  ],
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed border-hugo-neutral-disabled text-hugo-text-disabled',
        false:
          'cursor-pointer hover:border-hugo-brand-accent hover:bg-hugo-surface-tinted focus-within:ring-2 focus-within:ring-hugo-focus',
      },
      status: {
        idle: 'border-hugo-border-default text-hugo-text-default',
        dragging: 'border-hugo-brand-accent bg-hugo-surface-tinted text-hugo-brand-deep',
        selected: 'border-hugo-brand-accent bg-hugo-surface-tinted text-hugo-brand-deep',
        error: 'border-hugo-status-error bg-hugo-error-bg text-hugo-status-error',
        uploading: 'border-hugo-brand-accent bg-hugo-surface-tinted text-hugo-brand-deep',
        done: 'border-hugo-status-success bg-hugo-success-bg text-hugo-status-success',
      },
    },
    defaultVariants: {
      disabled: false,
      status: 'idle',
    },
  }
);

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function normalizeAcceptEntries(accept: string | string[] | undefined) {
  if (!accept) {
    return [];
  }

  return (Array.isArray(accept) ? accept : accept.split(','))
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function fileMatchesAccept(file: File, acceptEntries: string[]) {
  if (acceptEntries.length === 0) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptEntries.some((entry) => {
    if (entry.startsWith('.')) {
      return fileName.endsWith(entry);
    }

    if (entry.endsWith('/*')) {
      return fileType.startsWith(entry.slice(0, -1));
    }

    return fileType === entry;
  });
}
