import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import EmptyState from './EmptyState.vue';
import ErrorState from './ErrorState.vue';

describe('EmptyState', () => {
  it('renders neutral empty content and action slot', () => {
    const wrapper = mount(EmptyState, {
      props: {
        description: 'Add an item to see it here.',
        title: 'No items yet',
        variant: 'table',
      },
      slots: {
        action: '<button type="button">Add item</button>',
      },
    });

    const root = wrapper.get('[data-slot="empty-state"]');
    expect(root.attributes('data-component')).toBe('hugo-empty-state');
    expect(root.attributes('data-variant')).toBe('table');
    expect(wrapper.get('[data-slot="empty-state-title"]').text()).toBe('No items yet');
    expect(wrapper.get('[data-slot="empty-state-action"]').text()).toBe('Add item');
  });

  it('renders error state with alert semantics and optional code', () => {
    const wrapper = mount(ErrorState, {
      props: {
        description: 'Try again later.',
        errorCode: 'E_SAMPLE',
        retryable: true,
      },
    });

    const root = wrapper.get('[data-slot="empty-state"]');
    expect(root.attributes('data-component')).toBe('hugo-error-state');
    expect(root.attributes('role')).toBe('alert');
    expect(root.attributes('data-tone')).toBe('danger');
    expect(root.attributes('data-retryable')).toBe('true');
    expect(wrapper.get('[data-slot="error-state-code"]').text()).toBe('Code E_SAMPLE');
  });
});
