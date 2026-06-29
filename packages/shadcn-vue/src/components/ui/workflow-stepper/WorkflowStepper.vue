<script setup lang="ts">
import { Check, CircleAlert, Clock3 } from 'lucide-vue-next';
import {
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperRoot,
  StepperTitle,
  StepperTrigger,
} from 'reka-ui';
import { computed, ref, useAttrs } from 'vue';

import { cn } from '@/components/lib/utils';
import {
  getWorkflowStepMeta,
  workflowStepperIndicatorClass,
  workflowStepperStatusTextClass,
  type WorkflowStep,
  type WorkflowStepperEmits,
  type WorkflowStepperProps,
  type WorkflowStepperStatus,
} from './workflowStepper';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<WorkflowStepperProps>(), {
  clickable: false,
  linear: false,
  orientation: 'vertical',
});

const emit = defineEmits<WorkflowStepperEmits>();
const attrs = useAttrs();

const internalActiveId = ref(props.modelValue ?? props.defaultValue);

const inferredActiveId = computed(() => {
  const activeStep = props.steps.find((step) => step.status === 'active');

  if (activeStep) {
    return activeStep.id;
  }

  const firstOpenStep = props.steps.find(
    (step) =>
      !step.status ||
      step.status === 'pending' ||
      step.status === 'warning' ||
      step.status === 'error'
  );

  return firstOpenStep?.id ?? props.steps[props.steps.length - 1]?.id;
});
const activeStepId = computed(
  () => props.modelValue ?? internalActiveId.value ?? inferredActiveId.value
);
const activeStepNumber = computed(() => {
  const index = props.steps.findIndex((step) => step.id === activeStepId.value);

  return index >= 0 ? index + 1 : 1;
});

const rootClassName = computed(() =>
  cn(
    'font-sans text-hugo-text-default',
    props.orientation === 'vertical' && 'flex flex-col',
    props.orientation === 'horizontal' && 'flex flex-wrap gap-3',
    props.classNames?.root,
    props.class,
    attrs.class
  )
);

function resolveStepStatus(step: WorkflowStep, index: number): WorkflowStepperStatus {
  if (step.status) {
    return step.status;
  }

  const stepNumber = index + 1;

  if (stepNumber < activeStepNumber.value) {
    return 'success';
  }

  if (stepNumber === activeStepNumber.value) {
    return 'active';
  }

  return 'pending';
}

function isStepDisabled(step: WorkflowStep) {
  return Boolean(step.disabled || !props.clickable);
}

function getItemClassName(status: WorkflowStepperStatus, index: number) {
  return cn(
    'relative min-w-0',
    props.orientation === 'vertical' && 'grid grid-cols-[2rem_1fr] gap-x-3 pb-5 last:pb-0',
    props.orientation === 'horizontal' && 'min-w-40 flex-1',
    status === 'active' && 'text-hugo-brand-deep',
    props.classNames?.item
  );
}

function getTriggerClassName(step: WorkflowStep, status: WorkflowStepperStatus) {
  return cn(
    'group/workflow-stepper contents text-left outline-none',
    props.clickable &&
      !step.disabled &&
      'cursor-pointer focus-visible:[&_[data-slot=workflow-stepper-indicator]]:ring-2 focus-visible:[&_[data-slot=workflow-stepper-indicator]]:ring-hugo-focus',
    isStepDisabled(step) && 'cursor-default',
    status === 'active' && 'data-[state=active]',
    props.classNames?.trigger
  );
}

function getIndicatorClassName(status: WorkflowStepperStatus) {
  return cn(
    'relative z-10 grid size-8 place-items-center rounded-full border text-sm font-semibold leading-none',
    'transition-[background-color,border-color,color,box-shadow] duration-150 ease-linear',
    workflowStepperIndicatorClass[status],
    props.classNames?.indicator
  );
}

function getLineClassName(status: WorkflowStepperStatus) {
  return cn(
    'absolute left-4 top-8 bottom-0 w-px -translate-x-px',
    status === 'success' ? 'bg-hugo-status-success' : 'bg-hugo-neutral-500',
    props.classNames?.line
  );
}

function getContentClassName(status: WorkflowStepperStatus) {
  return cn(
    'min-w-0 pt-1',
    props.orientation === 'horizontal' && 'mt-2',
    status === 'active' && 'rounded-md',
    props.classNames?.content
  );
}

function getTitleClassName(status: WorkflowStepperStatus) {
  return cn(
    'm-0 text-sm font-semibold leading-5',
    status === 'pending' ? 'text-hugo-text-default' : workflowStepperStatusTextClass[status],
    props.classNames?.title
  );
}

function getDescriptionClassName() {
  return cn('mt-1 text-sm leading-5 text-hugo-text-subtle', props.classNames?.description);
}

function getMetaClassName() {
  return cn('mt-1 text-xs leading-4 text-hugo-text-subtle', props.classNames?.meta);
}

function setActiveStep(stepNumber: number | undefined) {
  if (stepNumber == null) {
    return;
  }

  const step = props.steps[stepNumber - 1];

  if (!step || step.disabled) {
    return;
  }

  if (step.id === activeStepId.value) {
    return;
  }

  internalActiveId.value = step.id;
  emit('update:modelValue', step.id);
  emit('stepChange', step.id, step);
}

function handleStepClick(step: WorkflowStep, index: number) {
  if (isStepDisabled(step)) {
    return;
  }

  emit('stepClick', step.id, step);
  setActiveStep(index + 1);
}
</script>

<template>
  <StepperRoot
    v-bind="{ ...attrs, class: undefined }"
    :class="rootClassName"
    data-component="hugo-workflow-stepper"
    data-slot="workflow-stepper"
    :data-clickable="clickable ? 'true' : undefined"
    :data-orientation="orientation"
    :linear="linear"
    :model-value="activeStepNumber"
    :orientation="orientation"
    @update:model-value="setActiveStep"
  >
    <StepperItem
      v-for="(step, index) in steps"
      :key="step.id"
      :class="getItemClassName(resolveStepStatus(step, index), index)"
      :completed="resolveStepStatus(step, index) === 'success'"
      data-slot="workflow-stepper-item"
      :data-status="resolveStepStatus(step, index)"
      :disabled="isStepDisabled(step) || undefined"
      :step="index + 1"
    >
      <StepperTrigger
        v-if="clickable"
        :aria-current="resolveStepStatus(step, index) === 'active' ? 'step' : undefined"
        :class="getTriggerClassName(step, resolveStepStatus(step, index))"
        data-slot="workflow-stepper-trigger"
        @click="handleStepClick(step, index)"
      >
        <StepperIndicator
          :class="getIndicatorClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-indicator"
        >
          <Check
            v-if="resolveStepStatus(step, index) === 'success'"
            aria-hidden="true"
            :size="16"
          />
          <CircleAlert
            v-else-if="['warning', 'error'].includes(resolveStepStatus(step, index))"
            aria-hidden="true"
            :size="16"
          />
          <Clock3
            v-else-if="resolveStepStatus(step, index) === 'pending'"
            aria-hidden="true"
            :size="16"
          />
          <span v-else>{{ index + 1 }}</span>
        </StepperIndicator>
        <span
          v-if="orientation === 'vertical' && index < steps.length - 1"
          aria-hidden="true"
          :class="getLineClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-line"
        />
        <span
          :class="getContentClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-content"
        >
          <StepperTitle
            :class="getTitleClassName(resolveStepStatus(step, index))"
            data-slot="workflow-stepper-title"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription
            v-if="step.description"
            :class="getDescriptionClassName()"
            data-slot="workflow-stepper-description"
          >
            {{ step.description }}
          </StepperDescription>
          <span
            v-if="getWorkflowStepMeta(step)"
            :class="getMetaClassName()"
            data-slot="workflow-stepper-meta"
          >
            {{ getWorkflowStepMeta(step) }}
          </span>
        </span>
      </StepperTrigger>

      <template v-else>
        <StepperIndicator
          :aria-current="resolveStepStatus(step, index) === 'active' ? 'step' : undefined"
          :class="getIndicatorClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-indicator"
        >
          <Check
            v-if="resolveStepStatus(step, index) === 'success'"
            aria-hidden="true"
            :size="16"
          />
          <CircleAlert
            v-else-if="['warning', 'error'].includes(resolveStepStatus(step, index))"
            aria-hidden="true"
            :size="16"
          />
          <Clock3
            v-else-if="resolveStepStatus(step, index) === 'pending'"
            aria-hidden="true"
            :size="16"
          />
          <span v-else>{{ index + 1 }}</span>
        </StepperIndicator>
        <span
          v-if="orientation === 'vertical' && index < steps.length - 1"
          aria-hidden="true"
          :class="getLineClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-line"
        />
        <span
          :class="getContentClassName(resolveStepStatus(step, index))"
          data-slot="workflow-stepper-content"
        >
          <StepperTitle
            :class="getTitleClassName(resolveStepStatus(step, index))"
            data-slot="workflow-stepper-title"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription
            v-if="step.description"
            :class="getDescriptionClassName()"
            data-slot="workflow-stepper-description"
          >
            {{ step.description }}
          </StepperDescription>
          <span
            v-if="getWorkflowStepMeta(step)"
            :class="getMetaClassName()"
            data-slot="workflow-stepper-meta"
          >
            {{ getWorkflowStepMeta(step) }}
          </span>
        </span>
      </template>
    </StepperItem>
  </StepperRoot>
</template>
