import type { HTMLAttributes, VNode } from 'vue';

export type WorkflowStepperStatus = 'pending' | 'active' | 'success' | 'warning' | 'error';
export type WorkflowStepperOrientation = 'vertical' | 'horizontal';

export type WorkflowStep = {
  id: string;
  title: string | number | VNode;
  description?: string | number | VNode;
  disabled?: boolean;
  duration?: string | number | VNode;
  status?: WorkflowStepperStatus;
  timestamp?: string | number | VNode;
};

export type WorkflowStepperClassNames = {
  root?: HTMLAttributes['class'];
  item?: HTMLAttributes['class'];
  trigger?: HTMLAttributes['class'];
  indicator?: HTMLAttributes['class'];
  line?: HTMLAttributes['class'];
  content?: HTMLAttributes['class'];
  title?: HTMLAttributes['class'];
  description?: HTMLAttributes['class'];
  meta?: HTMLAttributes['class'];
};

export type WorkflowStepperProps = {
  class?: HTMLAttributes['class'];
  classNames?: WorkflowStepperClassNames;
  clickable?: boolean;
  defaultValue?: string;
  linear?: boolean;
  modelValue?: string;
  orientation?: WorkflowStepperOrientation;
  steps: WorkflowStep[];
};

export type WorkflowStepperEmits = {
  (event: 'update:modelValue', value: string): void;
  (event: 'stepChange', value: string, step: WorkflowStep): void;
  (event: 'stepClick', value: string, step: WorkflowStep): void;
};

export const workflowStepperStatusTextClass: Record<WorkflowStepperStatus, string> = {
  pending: 'text-hugo-text-subtle',
  active: 'text-hugo-brand-deep',
  success: 'text-hugo-status-success',
  warning: 'text-hugo-status-warning',
  error: 'text-hugo-status-error',
};

export const workflowStepperIndicatorClass: Record<WorkflowStepperStatus, string> = {
  pending: 'border-hugo-neutral-500 bg-hugo-surface-default text-hugo-text-subtle',
  active: 'border-hugo-brand-accent bg-hugo-surface-tinted text-hugo-brand-deep',
  success: 'border-hugo-status-success bg-hugo-success-bg text-hugo-status-success',
  warning:
    'border-hugo-status-warning bg-[color-mix(in_oklab,var(--hugo-ui-shadcn-status-warning)_12%,transparent)] text-hugo-status-warning',
  error: 'border-hugo-status-error bg-hugo-error-bg text-hugo-status-error',
};

export function getWorkflowStepMeta(step: WorkflowStep) {
  return step.timestamp ?? step.duration;
}
