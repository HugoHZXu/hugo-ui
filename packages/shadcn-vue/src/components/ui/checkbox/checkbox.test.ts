import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Checkbox from './Checkbox.vue';

describe('Checkbox', () => {
  it('renders label, description, and Hugo state classes', () => {
    const wrapper = mount(Checkbox, {
      props: {
        description: 'Helper text',
        label: 'Sample option',
      },
    });

    const root = wrapper.get('[data-component="hugo-checkbox"]');
    const control = wrapper.get('[data-slot="checkbox-control"]');
    const label = wrapper.get('[data-slot="checkbox-label"]');
    const description = wrapper.get('[data-slot="checkbox-description"]');

    expect(root.attributes('data-state')).toBe('unchecked');
    expect(control.attributes('role')).toBe('checkbox');
    expect(control.attributes('aria-checked')).toBe('false');
    expect(control.attributes('aria-labelledby')).toBe(label.attributes('id'));
    expect(control.attributes('aria-describedby')).toBe(description.attributes('id'));
    expect(control.classes()).toContain('hugo-ui-shadcn-vue-checkbox-control');
    expect(control.classes()).toContain('hover:bg-[var(--hugo-ui-shadcn-checkbox-hover)]');
    expect(control.classes()).toContain('active:bg-[var(--hugo-ui-shadcn-checkbox-active)]');
    expect(control.classes()).toContain('focus-visible:ring-hugo-focus');
  });

  it('updates uncontrolled value from the checkbox control', async () => {
    const onUpdateModelValue = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(Checkbox, {
      props: {
        'onUpdate:modelValue': onUpdateModelValue,
        onChange,
      },
    });

    const control = wrapper.get('[data-slot="checkbox-control"]');

    await control.trigger('click');

    expect(onUpdateModelValue).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(control.attributes('aria-checked')).toBe('true');
    expect(wrapper.get('[data-component="hugo-checkbox"]').attributes('data-state')).toBe(
      'checked'
    );
    expect(wrapper.find('[data-slot="checkbox-icon"]').exists()).toBe(true);
  });

  it('renders indeterminate state and resolves it to checked on label click', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(Checkbox, {
      props: {
        defaultValue: 'indeterminate',
        label: 'Mixed option',
        'onUpdate:modelValue': onUpdateModelValue,
      },
    });

    const control = wrapper.get('[data-slot="checkbox-control"]');
    expect(control.attributes('aria-checked')).toBe('mixed');
    expect(wrapper.get('[data-component="hugo-checkbox"]').attributes('data-state')).toBe(
      'indeterminate'
    );
    expect(wrapper.find('[data-slot="checkbox-icon"]').exists()).toBe(true);

    await wrapper.get('[data-slot="checkbox-content"]').trigger('click');

    expect(onUpdateModelValue).toHaveBeenCalledWith(true);
    expect(control.attributes('aria-checked')).toBe('true');
  });

  it('supports controlled value updates', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        'onUpdate:modelValue': onUpdateModelValue,
      },
    });

    const control = wrapper.get('[data-slot="checkbox-control"]');

    await control.trigger('click');
    expect(onUpdateModelValue).toHaveBeenCalledWith(true);
    expect(control.attributes('aria-checked')).toBe('false');

    await wrapper.setProps({ modelValue: true });
    expect(control.attributes('aria-checked')).toBe('true');
  });

  it('applies disabled state and prevents label toggles', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
        label: 'Disabled option',
        'onUpdate:modelValue': onUpdateModelValue,
      },
    });

    const root = wrapper.get('[data-component="hugo-checkbox"]');
    const control = wrapper.get('[data-slot="checkbox-control"]');

    expect(root.attributes('data-disabled')).toBe('true');
    expect(control.attributes('disabled')).toBeDefined();
    expect(control.attributes('data-disabled')).toBe('');

    await wrapper.get('[data-slot="checkbox-content"]').trigger('click');

    expect(onUpdateModelValue).not.toHaveBeenCalled();
    expect(control.attributes('aria-checked')).toBe('false');
  });
});
