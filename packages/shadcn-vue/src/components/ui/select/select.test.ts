import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import Select from './Select.vue';
import type { SelectOption } from './select';

const options: SelectOption[] = [
  { label: 'Assign', value: 'assign' },
  { label: 'Revoke', value: 'revoke' },
  { disabled: true, label: 'Archived', value: 'archived' },
];

let wrappers: VueWrapper[] = [];

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.body.innerHTML = '';
});

describe('Select', () => {
  it('renders selected value and helper error state', async () => {
    const wrapper = mount(Select, {
      props: {
        error: 'Select an action.',
        label: 'Action',
        modelValue: 'assign',
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await nextTick();

    const root = wrapper.get('[data-slot="select"]');
    const control = wrapper.get('[data-slot="select-control"]');

    expect(root.attributes('data-component')).toBe('hugo-select');
    expect(wrapper.get('[data-slot="select-label"]').text()).toBe('Action');
    expect(control.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('[data-slot="select-value"]').text()).toBe('Assign');
    expect(wrapper.get('[data-slot="select-message"]').text()).toBe('Select an action.');
  });

  it('renders options, disabled item state, and grouped labels', async () => {
    const wrapper = mount(Select, {
      props: {
        defaultOpen: true,
        forceMount: true,
        options: [
          { group: 'Actions', label: 'Assign', value: 'assign' },
          { disabled: true, group: 'Actions', label: 'Revoke', value: 'revoke' },
        ],
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);
    await nextTick();

    const items = document.body.querySelectorAll('[data-slot="select-item"]');
    expect(document.body.querySelector('[data-slot="select-group-label"]')?.textContent).toBe(
      'Actions'
    );
    expect(items).toHaveLength(2);
    expect(items[1].hasAttribute('data-disabled')).toBe(true);
  });

  it('opens options from the trigger keyboard interaction', async () => {
    const wrapper = mount(Select, {
      props: {
        options,
      },
      attachTo: document.body,
    });
    wrappers.push(wrapper);

    await wrapper.get('[data-slot="select-control"]').trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    await nextTick();

    expect(wrapper.emitted('update:open')?.[0]?.[0]).toBe(true);
    expect(wrapper.get('[data-slot="select-control"]').attributes('aria-expanded')).toBe('true');
    expect(document.body.querySelector('[data-slot="select-content"]')).toBeTruthy();
    expect(document.body.querySelectorAll('[data-slot="select-item"]')).toHaveLength(3);
  });
});
