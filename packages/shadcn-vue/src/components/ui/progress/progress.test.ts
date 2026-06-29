import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Progress from './Progress.vue';

describe('Progress', () => {
  it('renders determinate progress with value text', () => {
    const wrapper = mount(Progress, {
      props: {
        label: 'Processing',
        modelValue: 45,
        showValue: true,
        tone: 'success',
      },
    });

    const root = wrapper.get('[data-slot="progress"]');
    const indicator = wrapper.get('[data-slot="progress-indicator"]');

    expect(root.attributes('data-tone')).toBe('success');
    expect(wrapper.get('[data-slot="progress-label"]').text()).toBe('Processing');
    expect(wrapper.get('[data-slot="progress-value"]').text()).toBe('45%');
    expect(indicator.attributes('style')).toContain('width: 45%');
    expect(indicator.classes()).toContain('bg-hugo-status-success');
  });

  it('renders indeterminate progress without a value label', () => {
    const wrapper = mount(Progress, {
      props: {
        indeterminate: true,
        label: 'Loading',
        modelValue: 20,
        showValue: true,
      },
    });

    expect(wrapper.get('[data-slot="progress"]').attributes('data-indeterminate')).toBe('true');
    expect(wrapper.find('[data-slot="progress-value"]').exists()).toBe(false);
    expect(wrapper.get('[data-slot="progress-indicator"]').classes()).toContain('animate-pulse');
  });
});
