import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import Modal from './Modal.vue';
import ModalContentText from './ModalContentText.vue';

let wrappers: VueWrapper[] = [];

const mountModal = (options: Parameters<typeof mount>[1]) => {
  const wrapper = mount(
    {
      components: { Modal, ModalContentText },
      template: `
        <Modal v-bind="$attrs">
          <ModalContentText>Review the selected example before saving.</ModalContentText>
        </Modal>
      `,
    },
    {
      attachTo: document.body,
      ...options,
    }
  );

  wrappers.push(wrapper);

  return wrapper;
};

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('Modal', () => {
  it('renders a titled transactional dialog with default actions', async () => {
    mountModal({
      props: {
        open: true,
        title: 'Transactional',
      },
    });
    await nextTick();

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    const primary = document.body.querySelector('[data-slot="button"][data-variant="solid"]');
    const secondary = document.body.querySelector('[data-slot="button"][data-variant="outline"]');

    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('data-type')).toBe('transactional');
    expect(dialog.textContent).toContain('Review the selected example before saving.');
    expect(primary?.textContent).toContain('Save');
    expect(primary?.getAttribute('data-tone')).toBe('brand');
    expect(secondary?.textContent).toContain('Cancel');
    expect(secondary?.getAttribute('data-tone')).toBe('brand');
  });

  it('maps destructive defaults to danger primary and neutral secondary actions', async () => {
    mountModal({
      props: {
        open: true,
        title: 'Remove example',
        type: 'destructive',
      },
    });
    await nextTick();

    const primary = Array.from(document.body.querySelectorAll('[data-slot="button"]')).find(
      (button) => button.textContent?.includes('Destruct')
    );
    const secondary = Array.from(document.body.querySelectorAll('[data-slot="button"]')).find(
      (button) => button.textContent?.includes('Cancel')
    );

    expect(document.body.querySelector('[role="img"][aria-label="alert"]')).toBeTruthy();
    expect(primary?.getAttribute('data-tone')).toBe('danger');
    expect(secondary?.getAttribute('data-tone')).toBe('neutral');
  });

  it('emits close events from the close button', async () => {
    const onClose = vi.fn();
    const onOpenChange = vi.fn();
    const onUpdateModelValue = vi.fn();
    const onUpdateOpen = vi.fn();

    mountModal({
      props: {
        closeButton: true,
        onClose,
        onOpenChange,
        'onUpdate:modelValue': onUpdateModelValue,
        'onUpdate:open': onUpdateOpen,
        open: true,
        title: 'Informational',
        type: 'informational',
      },
    });
    await nextTick();

    const closeButton = document.body.querySelector('[data-slot="modal-close"]') as HTMLElement;
    closeButton.click();
    await nextTick();

    expect(onUpdateOpen).toHaveBeenCalledWith(false);
    expect(onUpdateModelValue).toHaveBeenCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows button-level loading when the central indicator is disabled', async () => {
    const wrapper = mount(
      {
        components: { Modal, ModalContentText },
        template: `
          <Modal
            :button-defs="{ tertiary: { label: 'Read note' } }"
            loading
            open
            :show-loading-indicator="false"
            title="Loading action"
          >
            <ModalContentText>Content remains visible but disabled while loading.</ModalContentText>
          </Modal>
        `,
      },
      { attachTo: document.body }
    );
    wrappers.push(wrapper);
    await nextTick();

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    const primary = Array.from(document.body.querySelectorAll('[data-slot="button"]')).find(
      (button) => button.textContent?.includes('Save')
    ) as HTMLButtonElement;
    const secondary = Array.from(document.body.querySelectorAll('[data-slot="button"]')).find(
      (button) => button.textContent?.includes('Cancel')
    ) as HTMLButtonElement;
    const tertiary = document.body.querySelector('[data-slot="modal-tertiary-action"]');

    expect(dialog.getAttribute('data-loading')).toBe('true');
    expect(primary.getAttribute('aria-busy')).toBe('true');
    expect(primary.disabled).toBe(true);
    expect(secondary.disabled).toBe(true);
    expect(tertiary?.getAttribute('aria-disabled')).toBe('true');
    expect(
      document.body
        .querySelector('[data-slot="modal-body-content"]')
        ?.getAttribute('data-disabled')
    ).toBe('true');
  });

  it('shows a central loading indicator and announces loading after a delay', async () => {
    vi.useFakeTimers();

    mountModal({
      props: {
        loading: true,
        open: true,
        showLoadingIndicator: true,
        title: 'Loading example',
      },
    });
    await nextTick();

    expect(document.body.querySelector('[data-slot="modal-loading-indicator"]')).toBeTruthy();
    expect(document.body.textContent).not.toContain('Review the selected example before saving.');

    vi.advanceTimersByTime(200);
    await nextTick();

    expect(
      document.body.querySelector('[data-slot="modal-screen-reader-status"]')?.textContent
    ).toContain('Loading');
  });
});
