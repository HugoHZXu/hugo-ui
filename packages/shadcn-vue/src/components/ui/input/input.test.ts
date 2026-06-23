import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Input from './Input.vue';

describe('Input', () => {
  it('forwards native attrs', () => {
    const wrapper = mount(Input, {
      props: {
        'aria-label': 'Item name',
        placeholder: '@hugo-ui/shadcn-vue',
      },
    });

    const input = wrapper.get('input');
    const root = wrapper.get('[data-component="hugo-input"]');

    expect(input.attributes('placeholder')).toBe('@hugo-ui/shadcn-vue');
    expect(input.attributes('aria-label')).toBe('Item name');
    expect(root.attributes('data-slot')).toBe('root');
    expect(wrapper.find('[data-slot="control"]').exists()).toBe(true);
    expect(input.attributes('data-slot')).toBe('input');
  });

  it('renders labels, helper text, required state, and value changes', async () => {
    const onUpdateModelValue = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(Input, {
      props: {
        description: 'Helper text',
        label: 'Field label',
        modelValue: '',
        onChange,
        'onUpdate:modelValue': onUpdateModelValue,
        required: true,
      },
    });

    const input = wrapper.get('input');

    expect(wrapper.text()).toContain('Field label');
    expect(wrapper.text()).toContain('*');
    expect(wrapper.text()).toContain('Helper text');
    expect(wrapper.find('[data-slot="label"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="required-mark"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="helper"]').exists()).toBe(true);

    await input.setValue('Alpha');
    expect(onUpdateModelValue).toHaveBeenCalledWith('Alpha');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('uses label text as placeholder for search inputs', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Search items',
        name: 'search',
      },
    });

    expect(wrapper.get('input').attributes('placeholder')).toBe('Search items');
    expect(wrapper.find('[data-slot="label"]').exists()).toBe(false);
  });

  it('renders success, error, loading, and small states', async () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Success',
        message: 'Saved',
        size: 'sm',
        status: 'success',
      },
    });

    expect(wrapper.text()).toContain('Saved');
    expect(wrapper.get('input').attributes('aria-required')).toBeUndefined();
    expect(wrapper.find('[data-slot="status"][data-status="success"]').exists()).toBe(true);

    await wrapper.setProps({
      label: 'Error',
      message: 'Required',
      size: 'default',
      status: 'error',
    });
    expect(wrapper.text()).toContain('Required');
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.find('[data-slot="status"][data-status="error"]').exists()).toBe(true);

    await wrapper.setProps({
      label: 'Loading',
      loading: true,
      message: undefined,
      status: 'default',
    });
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true');
    expect(wrapper.find('[data-slot="spinner"]').exists()).toBe(true);
  });

  it('renders textarea input with count', () => {
    const wrapper = mount(Input, {
      props: {
        as: 'textarea',
        label: 'Description',
        maxLength: 20,
        value: 'Hello',
      },
    });

    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('[data-slot="textarea"]').exists()).toBe(true);
    expect(wrapper.find('[data-slot="counter"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('5/20');
  });

  it('emits blur when Enter is pressed for single-line inputs', async () => {
    const onBlur = vi.fn();
    const wrapper = mount(Input, {
      props: {
        'aria-label': 'Editable',
        onBlur,
      },
    });

    await wrapper.get('input').trigger('keydown', { key: 'Enter' });
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('does not emit blur when Enter is pressed for textarea inputs', async () => {
    const onBlur = vi.fn();
    const wrapper = mount(Input, {
      props: {
        'aria-label': 'Editable',
        as: 'textarea',
        onBlur,
      },
    });

    await wrapper.get('textarea').trigger('keydown', { key: 'Enter' });
    expect(onBlur).not.toHaveBeenCalled();
  });

  it('forwards slot props and class names to internal parts', () => {
    const wrapper = mount(Input, {
      props: {
        classNames: {
          control: 'custom-control',
          input: 'custom-input',
        },
        label: 'Item',
        slotProps: {
          control: { 'data-testid': 'control' },
          input: { 'data-testid': 'field' },
          label: { 'data-testid': 'label' },
        },
      },
    });

    expect(wrapper.get('[data-testid="label"]').attributes('data-slot')).toBe('label');
    expect(wrapper.get('[data-testid="control"]').classes()).toContain('custom-control');
    expect(wrapper.get('[data-testid="field"]').classes()).toContain('custom-input');
  });

  it('renders icon slots', () => {
    const wrapper = mount(Input, {
      slots: {
        'end-icon': '<span data-testid="end-icon" />',
        'start-icon': '<span data-testid="start-icon" />',
      },
    });

    expect(wrapper.find('[data-testid="start-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="end-icon"]').exists()).toBe(true);
  });
});
