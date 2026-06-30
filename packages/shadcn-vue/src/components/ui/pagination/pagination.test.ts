import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './index';

describe('Pagination', () => {
  it('renders page controls from reka pagination state and emits page updates', async () => {
    const onUpdatePage = vi.fn();
    const wrapper = mount({
      components: {
        Pagination,
        PaginationContent,
        PaginationEllipsis,
        PaginationItem,
        PaginationNext,
        PaginationPrevious,
      },
      setup() {
        return { onUpdatePage };
      },
      template: `
        <Pagination
          aria-label="Items pagination"
          :items-per-page="10"
          :page="2"
          :sibling-count="1"
          :total="50"
          show-edges
          @update:page="onUpdatePage"
        >
          <template #default="{ page }">
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :is-active="item.value === page"
                  :value="item.value"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else />
              </template>
              <PaginationNext />
            </PaginationContent>
          </template>
        </Pagination>
      `,
    });

    const root = wrapper.get('[data-slot="pagination"]');
    const pageItems = wrapper.findAll('[data-slot="pagination-item"]');

    expect(root.attributes('aria-label')).toBe('Items pagination');
    expect(pageItems.map((item) => item.text())).toEqual(['1', '2', '3', '4', '5']);
    expect(pageItems[1].attributes('aria-current')).toBe('page');
    expect(pageItems[1].classes()).toContain('bg-hugo-surface-tinted');

    await wrapper.get('[data-slot="pagination-next"]').trigger('click');
    expect(onUpdatePage).toHaveBeenCalledWith(3);
  });

  it('renders first and last controls through the same page model', async () => {
    const onUpdatePage = vi.fn();
    const wrapper = mount({
      components: {
        Pagination,
        PaginationContent,
        PaginationFirst,
        PaginationLast,
      },
      setup() {
        return { onUpdatePage };
      },
      template: `
        <Pagination
          :items-per-page="10"
          :page="2"
          :total="30"
          @update:page="onUpdatePage"
        >
          <PaginationContent>
            <PaginationFirst />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      `,
    });

    await wrapper.get('[data-slot="pagination-first"]').trigger('click');
    await wrapper.get('[data-slot="pagination-last"]').trigger('click');

    expect(onUpdatePage).toHaveBeenNthCalledWith(1, 1);
    expect(onUpdatePage).toHaveBeenNthCalledWith(2, 3);
  });

  it('supports document-style pagination links', async () => {
    const onClick = vi.fn();
    const wrapper = mount(PaginationLink, {
      props: {
        href: '#page-2',
        isActive: true,
        onClick,
      },
      slots: {
        default: '2',
      },
    });

    const link = wrapper.get('[data-slot="pagination-link"]');

    expect(link.text()).toBe('2');
    expect(link.attributes('href')).toBe('#page-2');
    expect(link.attributes('aria-current')).toBe('page');
    expect(link.classes()).toContain('bg-hugo-surface-tinted');

    await link.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('prevents disabled pagination links from navigating or emitting clicks', async () => {
    const onClick = vi.fn();
    const wrapper = mount(PaginationLink, {
      props: {
        disabled: true,
        href: '#page-3',
        onClick,
      },
      slots: {
        default: '3',
      },
    });

    const link = wrapper.get('[data-slot="pagination-link"]');

    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');

    await link.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });
});
