import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import Badge from './Badge.vue';

describe('Badge', () => {
  it('renders neutral tone by default', () => {
    const wrapper = mount(Badge, {
      slots: { default: 'Hidden' },
    });

    const badge = wrapper.get('[data-slot="badge"]');
    expect(badge.text()).toBe('Hidden');
    expect(badge.attributes('data-tone')).toBe('neutral');
    expect(badge.classes()).toContain('bg-hugo-surface-subtle');
  });

  it('renders selected tone classes', () => {
    const wrapper = mount(Badge, {
      props: { tone: 'success' },
      slots: { default: 'Ready' },
    });

    const badge = wrapper.get('[data-slot="badge"]');
    expect(badge.attributes('data-tone')).toBe('success');
    expect(badge.classes()).toContain('bg-hugo-success-bg');
    expect(badge.classes()).toContain('text-hugo-status-success');
  });
});
