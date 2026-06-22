import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Card from './Card.vue';
import CardDescription from './CardDescription.vue';
import CardFooter from './CardFooter.vue';
import CardHeader from './CardHeader.vue';
import CardTitle from './CardTitle.vue';

describe('Card', () => {
  it('renders structured card content', () => {
    const wrapper = mount({
      components: { Card, CardDescription, CardFooter, CardHeader, CardTitle },
      template: `
        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
            <CardDescription>Grouped supporting details.</CardDescription>
          </CardHeader>
          <CardFooter>Ready</CardFooter>
        </Card>
      `,
    });

    expect(wrapper.get('[data-slot="card"]').classes()).toContain('rounded-lg');
    expect(wrapper.get('[data-slot="card-title"]').text()).toBe('Basic information');
    expect(wrapper.get('[data-slot="card-description"]').text()).toBe('Grouped supporting details.');
    expect(wrapper.get('[data-slot="card-footer"]').text()).toBe('Ready');
  });

  it('activates clickable cards with keyboard', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Card, {
      props: { onClick },
      slots: { default: 'Open details' },
    });

    const card = wrapper.get('[data-slot="card"]');
    expect(card.attributes('role')).toBe('button');
    expect(card.attributes('tabindex')).toBe('0');
    expect(card.attributes('data-clickable')).toBe('true');

    await card.trigger('keydown', { key: 'Enter' });
    await card.trigger('keydown', { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
