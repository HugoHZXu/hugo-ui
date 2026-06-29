import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import WorkflowStepper from './WorkflowStepper.vue';
import type { WorkflowStep } from './workflowStepper';

const steps: WorkflowStep[] = [
  {
    description: 'The sample file is ready.',
    id: 'prepare',
    status: 'success',
    title: 'Prepare',
  },
  {
    description: 'Items are being checked.',
    id: 'review',
    status: 'active',
    timestamp: 'Now',
    title: 'Review',
  },
  {
    description: 'Finish the workflow.',
    id: 'finish',
    title: 'Finish',
  },
];

describe('WorkflowStepper', () => {
  it('renders vertical workflow states and metadata', () => {
    const wrapper = mount(WorkflowStepper, {
      props: { steps },
    });

    const items = wrapper.findAll('[data-slot="workflow-stepper-item"]');
    expect(items).toHaveLength(3);
    expect(items[0].attributes('data-status')).toBe('success');
    expect(items[1].attributes('data-status')).toBe('active');
    expect(items[2].attributes('data-status')).toBe('pending');
    expect(wrapper.get('[data-slot="workflow-stepper-meta"]').text()).toBe('Now');
  });

  it('emits selected step updates when clickable', async () => {
    const wrapper = mount(WorkflowStepper, {
      props: {
        clickable: true,
        modelValue: 'prepare',
        steps,
      },
    });

    await wrapper.findAll('[data-slot="workflow-stepper-trigger"]')[1].trigger('click');

    expect(wrapper.emitted('stepClick')?.[0]?.[0]).toBe('review');
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('review');
    expect(wrapper.emitted('stepChange')?.[0]?.[0]).toBe('review');
  });
});
