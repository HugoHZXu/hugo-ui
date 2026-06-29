<script setup lang="ts">
import { CheckCircle2, FileUp, Loader2, XCircle } from 'lucide-vue-next';
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  fileDropzoneRootVariants,
  fileMatchesAccept,
  formatFileSize,
  normalizeAcceptEntries,
  type FileDropzoneEmits,
  type FileDropzoneProps,
  type FileDropzoneRejection,
  type FileDropzoneStatus,
} from './fileDropzone';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FileDropzoneProps>(), {
  browseLabel: 'Browse files',
  clearable: true,
  disabled: false,
  multiple: false,
  title: 'Drop files here',
});

const emit = defineEmits<FileDropzoneEmits>();
const attrs = useAttrs();
const slots = useSlots();

const inputRef = ref<HTMLInputElement | null>(null);
const internalFiles = ref<File[]>(props.modelValue ?? []);
const internalError = ref<string | null>(null);
const dragging = ref(false);

watch(
  () => props.modelValue,
  (modelValue) => {
    if (modelValue) {
      internalFiles.value = modelValue;
    }
  }
);

const acceptEntries = computed(() => normalizeAcceptEntries(props.accept));
const acceptAttribute = computed(() =>
  Array.isArray(props.accept) ? props.accept.join(',') : props.accept
);
const hasFiles = computed(() => internalFiles.value.length > 0);
const displayedError = computed(() => props.error ?? internalError.value);
const resolvedStatus = computed<FileDropzoneStatus>(() => {
  if (props.status) {
    return props.status;
  }

  if (displayedError.value) {
    return 'error';
  }

  if (dragging.value) {
    return 'dragging';
  }

  if (hasFiles.value) {
    return 'selected';
  }

  return 'idle';
});
const hasDescription = computed(() =>
  Boolean(slots.description || slots.default || props.description)
);
const rootClassName = computed(() =>
  cn(
    fileDropzoneRootVariants({
      disabled: props.disabled,
      status: resolvedStatus.value,
    }),
    props.classNames?.root,
    props.class,
    attrs.class
  )
);
const inputClassName = computed(() => cn('sr-only', props.classNames?.input));
const iconClassName = computed(() =>
  cn(
    'mb-3 grid size-10 place-items-center rounded-full bg-hugo-surface-subtle text-hugo-text-subtle [&_svg]:size-5',
    resolvedStatus.value === 'dragging' && 'bg-hugo-surface-default text-hugo-brand-deep',
    resolvedStatus.value === 'error' && 'bg-hugo-surface-default text-hugo-status-error',
    resolvedStatus.value === 'done' && 'bg-hugo-surface-default text-hugo-status-success',
    props.classNames?.icon
  )
);
const contentClassName = computed(() =>
  cn('flex min-w-0 flex-col items-center gap-1', props.classNames?.content)
);
const titleClassName = computed(() =>
  cn('text-sm font-semibold leading-5 text-current', props.classNames?.title)
);
const descriptionClassName = computed(() =>
  cn('max-w-md text-sm leading-5 text-hugo-text-subtle', props.classNames?.description)
);
const filesClassName = computed(() =>
  cn('mt-4 flex w-full max-w-md flex-col gap-2', props.classNames?.files)
);
const fileClassName = computed(() =>
  cn(
    'flex min-w-0 items-center justify-between gap-3 rounded-md border border-hugo-neutral-500 bg-hugo-surface-default px-3 py-2 text-left',
    props.classNames?.file
  )
);
const actionsClassName = computed(() =>
  cn('mt-4 flex flex-wrap items-center justify-center gap-2', props.classNames?.actions)
);
const errorClassName = computed(() =>
  cn('mt-3 text-sm font-medium leading-5 text-hugo-status-error', props.classNames?.error)
);

function openFileDialog() {
  if (props.disabled) {
    return;
  }

  inputRef.value?.click();
}

function rejectFiles(rejections: FileDropzoneRejection[]) {
  internalError.value = rejections[0]?.message ?? null;
  emit('reject', rejections);
}

function createRejection(
  file: File,
  reason: FileDropzoneRejection['reason']
): FileDropzoneRejection {
  const message =
    reason === 'too-many-files'
      ? 'Select one file.'
      : reason === 'too-large'
        ? `File must be ${formatFileSize(props.maxSize ?? 0)} or smaller.`
        : 'File type is not supported.';

  return { file, message, reason };
}

function setSelectedFiles(files: File[]) {
  if (props.disabled) {
    return;
  }

  if (!props.multiple && files.length > 1) {
    rejectFiles(files.map((file) => createRejection(file, 'too-many-files')));
    return;
  }

  const rejections = files
    .map((file) => {
      if (!fileMatchesAccept(file, acceptEntries.value)) {
        return createRejection(file, 'invalid-type');
      }

      if (props.maxSize && file.size > props.maxSize) {
        return createRejection(file, 'too-large');
      }

      return undefined;
    })
    .filter((rejection): rejection is FileDropzoneRejection => Boolean(rejection));

  if (rejections.length > 0) {
    rejectFiles(rejections);
    return;
  }

  const nextFiles = props.multiple ? files : files.slice(0, 1);
  internalError.value = null;
  internalFiles.value = nextFiles;
  emit('update:modelValue', nextFiles);
  emit('select', nextFiles);
}

function handleInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);

  if (files.length > 0) {
    setSelectedFiles(files);
  }

  input.value = '';
}

function handleDragenter(event: DragEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  dragging.value = true;
}

function handleDragover(event: DragEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  dragging.value = true;
}

function handleDragleave(event: DragEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  dragging.value = false;
}

function handleDrop(event: DragEvent) {
  if (props.disabled) {
    return;
  }

  event.preventDefault();
  dragging.value = false;
  emit('drop', event);

  const files = Array.from(event.dataTransfer?.files ?? []);

  if (files.length > 0) {
    setSelectedFiles(files);
  }
}

function clearFiles(event?: MouseEvent) {
  event?.stopPropagation();
  internalFiles.value = [];
  internalError.value = null;
  emit('update:modelValue', []);
  emit('clear');
}
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    :aria-disabled="disabled || undefined"
    :aria-invalid="resolvedStatus === 'error' || undefined"
    :class="rootClassName"
    data-component="hugo-file-dropzone"
    data-slot="file-dropzone"
    :data-disabled="disabled ? 'true' : undefined"
    :data-status="resolvedStatus"
    role="button"
    :tabindex="disabled ? -1 : 0"
    @click="openFileDialog"
    @dragenter="handleDragenter"
    @dragleave="handleDragleave"
    @dragover="handleDragover"
    @drop="handleDrop"
    @keydown.enter.prevent="openFileDialog"
    @keydown.space.prevent="openFileDialog"
  >
    <input
      ref="inputRef"
      :accept="acceptAttribute"
      :class="inputClassName"
      data-slot="file-dropzone-input"
      :disabled="disabled || undefined"
      :multiple="multiple || undefined"
      type="file"
      @change="handleInputChange"
    />

    <div :class="iconClassName" data-slot="file-dropzone-icon">
      <slot name="icon" :status="resolvedStatus">
        <Loader2 v-if="resolvedStatus === 'uploading'" aria-hidden="true" class="animate-spin" />
        <CheckCircle2 v-else-if="resolvedStatus === 'done'" aria-hidden="true" />
        <XCircle v-else-if="resolvedStatus === 'error'" aria-hidden="true" />
        <FileUp v-else aria-hidden="true" />
      </slot>
    </div>

    <div :class="contentClassName" data-slot="file-dropzone-content">
      <div :class="titleClassName" data-slot="file-dropzone-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div
        v-if="hasDescription"
        :class="descriptionClassName"
        data-slot="file-dropzone-description"
      >
        <slot name="description">
          <slot>{{ description }}</slot>
        </slot>
      </div>
      <span
        class="mt-2 text-sm font-semibold leading-5 text-hugo-brand-deep"
        data-slot="file-dropzone-browse"
      >
        <slot name="browse">{{ browseLabel }}</slot>
      </span>
    </div>

    <div v-if="hasFiles" :class="filesClassName" data-slot="file-dropzone-files">
      <slot name="files" :files="internalFiles">
        <div
          v-for="file in internalFiles"
          :key="`${file.name}-${file.size}`"
          :class="fileClassName"
          data-slot="file-dropzone-file"
        >
          <span class="min-w-0 truncate text-sm font-medium leading-5 text-hugo-text-primary">
            {{ file.name }}
          </span>
          <span class="shrink-0 text-xs leading-4 text-hugo-text-subtle">
            {{ formatFileSize(file.size) }}
          </span>
        </div>
      </slot>
    </div>

    <div
      v-if="$slots.actions || (clearable && hasFiles)"
      :class="actionsClassName"
      data-slot="file-dropzone-actions"
    >
      <slot name="actions" :clear="clearFiles" :files="internalFiles">
        <button
          v-if="clearable && hasFiles"
          class="rounded-full px-3 py-1 text-xs font-semibold leading-4 text-hugo-brand-deep hover:bg-hugo-surface-tinted"
          type="button"
          @click="clearFiles"
        >
          Clear
        </button>
      </slot>
    </div>

    <div v-if="displayedError" :class="errorClassName" data-slot="file-dropzone-error">
      <slot name="error">{{ displayedError }}</slot>
    </div>
  </div>
</template>
