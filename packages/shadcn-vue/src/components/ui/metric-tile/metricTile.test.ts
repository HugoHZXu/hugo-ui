import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MetricTile from './MetricTile.vue';

describe('MetricTile', () => {
  it('renders a compact statistic with supporting text', () => {
    const wrapper = mount(MetricTile, {
      props: {
        compact: true,
        delta: '+4',
        description: 'since last check',
        label: 'Ready',
        tone: 'success',
        trend: 'up',
        value: 42,
      },
    });

    const root = wrapper.get('[data-slot="metric-tile"]');
    expect(root.attributes('data-compact')).toBe('true');
    expect(root.attributes('data-tone')).toBe('success');
    expect(wrapper.get('[data-slot="metric-tile-label"]').text()).toBe('Ready');
    expect(wrapper.get('[data-slot="metric-tile-value"]').text()).toBe('42');
    expect(wrapper.get('[data-slot="metric-tile-delta"]').classes()).toContain(
      'text-hugo-status-success'
    );
  });

  it('renders loading skeleton with busy state', () => {
    const wrapper = mount(MetricTile, {
      props: {
        label: 'Total',
        loading: true,
        value: 0,
      },
    });

    const root = wrapper.get('[data-slot="metric-tile"]');
    expect(root.attributes('aria-busy')).toBe('true');
    expect(wrapper.find('[data-slot="metric-tile-value"]').exists()).toBe(false);
    expect(wrapper.get('[data-slot="metric-tile-skeleton"]').classes()).toContain('animate-pulse');
  });
});
