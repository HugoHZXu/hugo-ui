import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import DropdownMenu from './DropdownMenu.vue';
import DropdownMenuItem from './DropdownMenuItem.vue';
import DropdownMenuSeparator from './DropdownMenuSeparator.vue';

let wrappers: VueWrapper[] = [];

afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.body.innerHTML = '';
});

describe('DropdownMenu', () => {
  it('renders menu content, items, destructive state, shortcut, and separator', async () => {
    const wrapper = mount(
      {
        components: { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator },
        template: `
          <DropdownMenu default-open force-mount>
            <template #trigger>
              <button type="button">Actions</button>
            </template>
            <DropdownMenuItem shortcut="Cmd+E">Export</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Remove</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
          </DropdownMenu>
        `,
      },
      { attachTo: document.body }
    );
    wrappers.push(wrapper);
    await nextTick();

    const content = document.body.querySelector('[data-slot="dropdown-menu-content"]');
    const items = document.body.querySelectorAll('[data-slot="dropdown-menu-item"]');

    expect(content).toBeTruthy();
    expect(items).toHaveLength(3);
    expect(document.body.querySelector('[data-slot="dropdown-menu-shortcut"]')?.textContent).toBe(
      'Cmd+E'
    );
    expect(document.body.querySelector('[data-slot="dropdown-menu-separator"]')).toBeTruthy();
    expect(items[1].getAttribute('data-destructive')).toBe('true');
    expect(items[2].hasAttribute('data-disabled')).toBe(true);
  });

  it('emits open updates from the trigger', async () => {
    const onUpdateOpen = vi.fn();
    const wrapper = mount(
      {
        components: { DropdownMenu, DropdownMenuItem },
        template: `
          <DropdownMenu :open="false" @update:open="onUpdateOpen">
            <template #trigger>
              <button type="button">Actions</button>
            </template>
            <DropdownMenuItem>Open</DropdownMenuItem>
          </DropdownMenu>
        `,
        setup() {
          return { onUpdateOpen };
        },
      },
      { attachTo: document.body }
    );
    wrappers.push(wrapper);

    await wrapper.get('button').trigger('click');
    await nextTick();

    expect(onUpdateOpen).toHaveBeenCalledWith(true);
  });
});
