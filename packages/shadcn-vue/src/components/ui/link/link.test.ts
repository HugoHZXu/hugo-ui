import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Link from './Link.vue';

describe('Link', () => {
  it('renders Hugo defaults and emits clicks', async () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const wrapper = mount(Link, {
      props: {
        href: '/examples',
        onClick,
      },
      slots: { default: 'Example link' },
    });

    const link = wrapper.get('a');
    expect(link.text()).toBe('Example link');
    expect(link.attributes('href')).toBe('/examples');
    expect(link.attributes('data-mode')).toBe('white');
    expect(link.attributes('data-size')).toBe('medium');
    expect(link.classes()).toContain('hugo-ui-shadcn-vue-link');
    expect(link.classes()).toContain('text-sm');
    expect(link.classes()).toContain('text-[var(--hugo-ui-shadcn-link-color)]');

    await link.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies size and mode classes', () => {
    const wrapper = mount(Link, {
      props: {
        href: '/examples',
        mode: 'error',
        size: 'small',
      },
      slots: { default: 'Error link' },
    });

    const link = wrapper.get('a');
    expect(link.attributes('data-mode')).toBe('error');
    expect(link.attributes('data-size')).toBe('small');
    expect(link.classes()).toContain('text-xs');
    expect(link.classes()).toContain(
      '[--hugo-ui-shadcn-link-color:var(--hugo-ui-shadcn-link-error)]'
    );
  });

  it('sets rel and aria-label for new-page links', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        target: '_blank',
      },
      slots: { default: 'Read note' },
    });

    const link = wrapper.get('a');
    expect(link.attributes('rel')).toBe('noreferrer');
    expect(link.attributes('aria-label')).toBe('Read note (opens in new page)');
  });

  it('preserves custom aria-label text for new-page links', () => {
    const wrapper = mount(Link, {
      attrs: {
        'aria-label': 'Open example',
      },
      props: {
        href: 'https://example.com',
        target: '_blank',
      },
      slots: { default: 'Read note' },
    });

    expect(wrapper.get('a').attributes('aria-label')).toBe(
      'Open example (opens in new page)'
    );
  });

  it('prevents disabled links from navigating or emitting clicks', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Link, {
      props: {
        disabled: true,
        href: '/examples',
        onClick,
      },
      slots: { default: 'Disabled link' },
    });

    const link = wrapper.get('a');
    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('data-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');

    await link.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders loading state and prevents clicks', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Link, {
      props: {
        href: '/examples',
        loading: true,
        onClick,
      },
      slots: { default: 'Loading link' },
    });

    const link = wrapper.get('a');
    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('aria-busy')).toBe('true');
    expect(link.attributes('data-loading')).toBe('true');
    expect(wrapper.find('[data-slot="link-spinner"]').exists()).toBe(true);

    await link.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
