import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FileDropzone from './FileDropzone.vue';

function setInputFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  });
}

describe('FileDropzone', () => {
  it('selects files through the file input', async () => {
    const file = new File(['sample'], 'sample.csv', { type: 'text/csv' });
    const wrapper = mount(FileDropzone, {
      props: {
        accept: '.csv',
      },
    });

    const input = wrapper.get<HTMLInputElement>('[data-slot="file-dropzone-input"]');
    setInputFiles(input.element, [file]);
    await input.trigger('change');

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([file]);
    expect(wrapper.emitted('select')?.[0]?.[0]).toEqual([file]);
    expect(wrapper.get('[data-slot="file-dropzone"]').attributes('data-status')).toBe('selected');
    expect(wrapper.get('[data-slot="file-dropzone-file"]').text()).toContain('sample.csv');
  });

  it('rejects files that exceed maxSize', async () => {
    const file = new File(['sample'], 'sample.csv', { type: 'text/csv' });
    const wrapper = mount(FileDropzone, {
      props: {
        maxSize: 2,
      },
    });

    const input = wrapper.get<HTMLInputElement>('[data-slot="file-dropzone-input"]');
    setInputFiles(input.element, [file]);
    await input.trigger('change');

    expect(wrapper.emitted('reject')?.[0]?.[0]).toMatchObject([
      {
        reason: 'too-large',
      },
    ]);
    expect(wrapper.get('[data-slot="file-dropzone"]').attributes('data-status')).toBe('error');
    expect(wrapper.get('[data-slot="file-dropzone-error"]').text()).toContain('2 B');
  });

  it('shows dragging state during drag interaction', async () => {
    const wrapper = mount(FileDropzone);
    const root = wrapper.get('[data-slot="file-dropzone"]');

    await root.trigger('dragenter');
    expect(root.attributes('data-status')).toBe('dragging');

    await root.trigger('dragleave');
    expect(root.attributes('data-status')).toBe('idle');
  });
});
