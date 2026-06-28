import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StatusBadge from './StatusBadge.vue';

describe('StatusBadge', () => {
  it('maps common status values to semantic tones', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'blocked' },
    });

    const badge = wrapper.get('[data-slot="status-badge"]');
    expect(badge.text()).toBe('Blocked');
    expect(badge.attributes('data-tone')).toBe('danger');
    expect(badge.classes()).toContain('bg-hugo-error-bg');
    expect(badge.classes()).toContain('text-hugo-status-error');
  });

  it('allows explicit tone, variant, size, and dot presentation', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        label: 'Ready',
        showDot: true,
        size: 'sm',
        tone: 'success',
        variant: 'solid',
      },
    });

    const badge = wrapper.get('[data-slot="status-badge"]');
    expect(badge.attributes('data-size')).toBe('sm');
    expect(badge.attributes('data-variant')).toBe('solid');
    expect(badge.classes()).toContain('bg-hugo-status-success');
    expect(wrapper.get('[data-slot="status-badge-dot"]').classes()).toContain('size-1.5');
  });
});
