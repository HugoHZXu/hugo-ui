import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Button from './Button.vue';

describe('Button', () => {
  it('renders Hugo defaults and emits clicks', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: { onClick },
      slots: { default: 'Create item' },
    });

    const button = wrapper.get('button');
    expect(button.text()).toBe('Create item');
    expect(button.attributes('data-variant')).toBe('solid');
    expect(button.attributes('data-tone')).toBe('brand');
    expect(button.attributes('data-size')).toBe('default');
    expect(button.classes()).toContain('hugo-ui-shadcn-vue-button');
    expect(button.classes()).toContain('h-10');
    expect(button.classes()).toContain('cursor-pointer');

    await button.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant, tone, size, and icon-only state', () => {
    const wrapper = mount(Button, {
      props: {
        ariaLabel: 'Completed',
        size: 'icon',
        tone: 'neutral',
        variant: 'outline',
      },
      slots: { default: '<span data-testid="icon" />' },
    });

    const button = wrapper.get('button');
    expect(button.attributes('aria-label')).toBe('Completed');
    expect(button.attributes('data-icon-only')).toBe('true');
    expect(button.attributes('data-variant')).toBe('outline');
    expect(button.attributes('data-tone')).toBe('neutral');
    expect(button.classes()).toContain('w-14');
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
  });

  it('disables click behavior while loading', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: {
        loading: true,
        loadingPosition: 'center',
        onClick,
      },
      slots: { default: 'Saving' },
    });

    const button = wrapper.get('button');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.attributes('aria-busy')).toBe('true');
    expect(button.attributes('data-loading')).toBe('true');
    expect(wrapper.find('[data-slot="button-spinner"]').exists()).toBe(true);

    await button.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
