import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import Combobox from './Combobox.vue';
import type { ComboboxOption } from './combobox';

const options: ComboboxOption[] = [
  { description: 'First sample item', group: 'Examples', label: 'Alpha', value: 'alpha' },
  { description: 'Second sample item', group: 'Examples', label: 'Beta', value: 'beta' },
  { disabled: true, label: 'Hidden', value: 'hidden' },
];

let wrappers: VueWrapper[] = [];

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.body.innerHTML = '';
});

describe('Combobox', () => {
  it('filters local options and renders descriptions', async () => {
    const wrapper = mount(Combobox, {
      props: {
        defaultOpen: true,
        forceMount: true,
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="combobox-input"]').setValue('Beta');
    await nextTick();

    const items = document.body.querySelectorAll('[data-slot="combobox-item"]');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('Beta');
    expect(items[0].textContent).toContain('Second sample item');
  });

  it('opens options when the input receives focus', async () => {
    const wrapper = mount(Combobox, {
      props: {
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="combobox-input"]').trigger('focus');
    await nextTick();
    await nextTick();

    expect(wrapper.get('[data-slot="combobox-input"]').attributes('aria-expanded')).toBe('true');
    expect(document.body.querySelector('[data-slot="combobox-content"]')).toBeTruthy();
    expect(document.body.querySelectorAll('[data-slot="combobox-item"]')).toHaveLength(3);
  });

  it('opens options while typing', async () => {
    const wrapper = mount(Combobox, {
      props: {
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="combobox-input"]').setValue('Alpha');
    await nextTick();
    await nextTick();

    expect(wrapper.emitted('update:open')?.[0]?.[0]).toBe(true);
    expect(wrapper.get('[data-slot="combobox-input"]').attributes('aria-expanded')).toBe('true');
    expect(document.body.querySelector('[data-slot="combobox-content"]')).toBeTruthy();
    expect(document.body.querySelectorAll('[data-slot="combobox-item"]')).toHaveLength(1);
  });

  it('renders the selected indicator after the item text and centered in the option block', async () => {
    const wrapper = mount(Combobox, {
      props: {
        defaultOpen: true,
        defaultValue: 'alpha',
        forceMount: true,
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await nextTick();

    const selectedItem = document.body.querySelector(
      '[data-slot="combobox-item"][data-value="alpha"]'
    );
    const childSlots = Array.from(selectedItem?.children ?? []).map((child) =>
      child.getAttribute('data-slot')
    );
    const indicator = selectedItem?.querySelector('[data-slot="combobox-item-indicator"]');

    expect(childSlots.indexOf('combobox-item-text')).toBeGreaterThanOrEqual(0);
    expect(childSlots.indexOf('combobox-item-indicator')).toBeGreaterThanOrEqual(0);
    expect(childSlots.indexOf('combobox-item-text')).toBeLessThan(
      childSlots.indexOf('combobox-item-indicator')
    );
    expect(indicator?.className).toContain('self-center');
  });

  it('runs async search and shows returned options', async () => {
    const search = vi.fn(async (query: string) => [{ label: `${query} result`, value: 'result' }]);
    const wrapper = mount(Combobox, {
      props: {
        debounce: 0,
        defaultOpen: true,
        forceMount: true,
        search,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="combobox-input"]').setValue('Alpha');
    await nextTick();
    await Promise.resolve();
    await nextTick();

    expect(search).toHaveBeenLastCalledWith('Alpha');
    expect(document.body.querySelector('[data-slot="combobox-item"]')?.textContent).toContain(
      'Alpha result'
    );
  });

  it('clears selected value and query', async () => {
    const wrapper = mount(Combobox, {
      props: {
        clearable: true,
        modelValue: 'alpha',
        options,
        query: 'Alpha',
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="combobox-clear"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBeNull();
    expect(wrapper.emitted('update:query')?.[0]?.[0]).toBe('');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });
});
