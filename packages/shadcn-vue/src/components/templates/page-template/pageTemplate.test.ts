import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import PageTemplate from './PageTemplate.vue';
import type { PageTemplateNavItem } from './pageTemplate';

const navItems: PageTemplateNavItem[] = [
  {
    id: 'components',
    label: 'Components',
    children: [{ id: 'updates', label: 'Updates' }],
  },
];

describe('PageTemplate', () => {
  it('renders app title and content without navigation', () => {
    const wrapper = mount(PageTemplate, {
      props: {
        appTitle: 'Component Library',
      },
      slots: {
        default: '<div>Template content</div>',
      },
    });

    expect(wrapper.get('h1').text()).toBe('Component Library');
    expect(wrapper.text()).toContain('Template content');
    expect(wrapper.find('aside').exists()).toBe(false);
  });

  it('marks the selected navigation item', () => {
    const wrapper = mount(PageTemplate, {
      props: {
        appTitle: 'Component Library',
        navProps: {
          navItems,
          defaultExpanded: ['components'],
          defaultSelected: 'updates',
        },
      },
    });

    const selected = wrapper.get('[aria-current="page"]');
    expect(wrapper.find('aside').exists()).toBe(true);
    expect(selected.text()).toContain('Updates');
    expect(selected.classes()).toContain('bg-hugo-surface-tinted');
    expect(selected.classes()).not.toContain('bg-transparent');
  });

  it('emits beforeSelection and applies selection callback', async () => {
    const onBeforeSelection = vi.fn((_selection: string, onSelection: () => void) => {
      onSelection();
    });
    const wrapper = mount(PageTemplate, {
      props: {
        appTitle: 'Component Library',
        navProps: {
          navItems,
          defaultExpanded: ['components'],
          defaultSelected: 'components',
        },
        onBeforeSelection,
      },
    });

    const updatesButton = wrapper.findAll('button').find((button) => button.text().includes('Updates'));
    expect(updatesButton).toBeDefined();

    await updatesButton!.trigger('click');
    expect(onBeforeSelection).toHaveBeenCalledWith('updates', expect.any(Function));
    expect(wrapper.get('[aria-current="page"]').text()).toContain('Updates');
  });
});
