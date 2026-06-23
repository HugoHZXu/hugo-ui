<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';

import { cn } from '@/components/lib/utils';
import type { ContentTemplateEmits, ContentTemplateProps } from './contentTemplate';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ContentTemplateProps>(), {
  as: 'div',
});

const emit = defineEmits<ContentTemplateEmits>();
const attrs = useAttrs();
const instance = getCurrentInstance();

const hasBackListener = computed(() => Boolean(instance?.vnode.props?.onBack));
const hasHeader = computed(
  () =>
    Boolean(
      props.pageTitle ||
        props.titleInfo ||
        props.actionItems ||
        hasBackListener.value ||
        instance?.slots.actions ||
        instance?.slots.pageTitle ||
        instance?.slots.titleInfo
    )
);
const rootClassName = computed(() =>
  cn('grid min-w-0 gap-[18px]', props.class, attrs.class)
);
const bodyClassName = computed(() =>
  cn(
    'min-w-0',
    props.type !== 'full' &&
      'rounded-lg border border-hugo-neutral-500 bg-hugo-surface-default shadow-sm',
    props.type === 'card' && 'p-5',
    props.type === 'table' && 'overflow-hidden p-5',
    props.type === 'error' && 'p-8'
  )
);

function renderValue(value: unknown) {
  return typeof value === 'function' ? value() : value;
}
</script>

<template>
  <component :is="as" v-bind="{ ...attrs, class: undefined }" :class="rootClassName" :data-type="type">
    <header v-if="hasHeader" class="flex items-start justify-between gap-4 max-[720px]:grid">
      <div class="grid min-w-0 gap-1.5">
        <div class="flex min-w-0 items-center gap-2">
          <button
            v-if="hasBackListener"
            aria-label="Back"
            class="grid h-8 w-8 flex-none cursor-pointer place-items-center rounded-md text-hugo-text-default outline-none hover:bg-hugo-surface-tinted focus-visible:ring-2 focus-visible:ring-hugo-focus"
            type="button"
            @click="emit('back')"
          >
            <ArrowLeft class="h-4 w-4" />
          </button>
          <h2
            v-if="$slots.pageTitle || pageTitle"
            class="m-0 text-2xl font-bold leading-tight tracking-normal text-hugo-text-primary max-[720px]:text-[21px]"
          >
            <slot name="pageTitle">
              <component :is="() => renderValue(pageTitle)" />
            </slot>
          </h2>
        </div>
        <p v-if="$slots.titleInfo || titleInfo" class="m-0 text-sm leading-[1.45] text-hugo-text-subtle">
          <slot name="titleInfo">
            <component :is="() => renderValue(titleInfo)" />
          </slot>
        </p>
      </div>
      <div
        v-if="$slots.actions || actionItems"
        class="flex flex-wrap justify-end gap-2.5 max-[720px]:justify-start"
        data-slot="actions"
      >
        <slot name="actions">
          <component :is="() => renderValue(actionItems)" />
        </slot>
      </div>
    </header>

    <section :class="bodyClassName">
      <div v-if="type === 'error'" class="grid justify-items-start gap-3 text-hugo-text-default">
        <slot />
        <p v-if="$slots.errorMessage || errorMessage" class="m-0 text-sm leading-[1.45] text-hugo-text-subtle">
          <slot name="errorMessage">
            <component :is="() => renderValue(errorMessage)" />
          </slot>
        </p>
      </div>
      <slot v-else />
    </section>
  </component>
</template>
