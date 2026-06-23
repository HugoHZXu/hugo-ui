import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import ContentTemplate from './ContentTemplate.vue';

describe('ContentTemplate', () => {
  it('renders title, description, action slot, and content', () => {
    const wrapper = mount(ContentTemplate, {
      props: {
        pageTitle: 'Components',
        titleInfo: 'Browse reusable component examples.',
        type: 'table',
      },
      slots: {
        actions: '<button type="button">Add</button>',
        default: '<div>Table content</div>',
      },
    });

    expect(wrapper.get('h2').text()).toBe('Components');
    expect(wrapper.text()).toContain('Browse reusable component examples.');
    expect(wrapper.get('button').text()).toBe('Add');
    expect(wrapper.text()).toContain('Table content');
  });

  it('emits back from the back action', async () => {
    const onBack = vi.fn();
    const wrapper = mount(ContentTemplate, {
      props: {
        onBack,
        pageTitle: 'Alpha pattern',
        type: 'card',
      },
      slots: {
        default: '<div>Detail content</div>',
      },
    });

    await wrapper.get('[aria-label="Back"]').trigger('click');
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders error message inside error content', () => {
    const wrapper = mount(ContentTemplate, {
      props: {
        errorMessage: 'The requested route does not exist.',
        pageTitle: 'Page not found',
        type: 'error',
      },
    });

    expect(wrapper.text()).toContain('The requested route does not exist.');
    expect(wrapper.find('[data-type="error"]').exists()).toBe(true);
  });
});
