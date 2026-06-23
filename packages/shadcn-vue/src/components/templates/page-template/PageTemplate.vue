<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs, watch } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

import { cn } from '@/components/lib/utils';
import type { PageTemplateEmits, PageTemplateNavItem, PageTemplateProps } from './pageTemplate';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PageTemplateProps>(), {
  as: 'div',
  hidden: false,
});

const emit = defineEmits<PageTemplateEmits>();
const attrs = useAttrs();
const instance = getCurrentInstance();

const selectedId = ref(props.navProps?.defaultSelected);
const expandedIds = ref<string[]>(props.navProps?.defaultExpanded ?? []);

const hasVisibleNav = computed(() => Boolean(props.navProps && !props.navProps.hidden));
const hasBeforeSelectionListener = computed(() => Boolean(instance?.vnode.props?.onBeforeSelection));
const expandedSet = computed(() => new Set(expandedIds.value));
const rootClassName = computed(() =>
  cn(
    'flex h-screen min-h-screen flex-col overflow-hidden bg-hugo-surface-subtle text-hugo-text-default',
    props.class,
    attrs.class
  )
);

watch(
  () => props.navProps?.defaultSelected,
  (nextSelected) => {
    selectedId.value = nextSelected;
  }
);

watch(
  () => props.navProps?.defaultExpanded,
  (nextExpanded) => {
    expandedIds.value = nextExpanded ?? [];
  }
);

function hasChildren(item: PageTemplateNavItem) {
  return Boolean(item.children?.length);
}

function renderValue(value: unknown) {
  return typeof value === 'function' ? value() : value;
}

function toggleExpanded(itemId: string) {
  expandedIds.value = expandedIds.value.includes(itemId)
    ? expandedIds.value.filter((currentId) => currentId !== itemId)
    : [...expandedIds.value, itemId];
}

function runSelection(item: PageTemplateNavItem) {
  selectedId.value = item.id;

  if (hasChildren(item) && !expandedSet.value.has(item.id)) {
    expandedIds.value = [...expandedIds.value, item.id];
  }

  emit('selectionChange', item.id);
}

function selectItem(item: PageTemplateNavItem) {
  if (hasBeforeSelectionListener.value) {
    emit('beforeSelection', item.id, () => runSelection(item));
    return;
  }

  runSelection(item);
}
</script>

<template>
  <component :is="as" v-bind="{ ...attrs, class: undefined }" :class="rootClassName">
    <header
      class="flex min-h-14 flex-none items-center gap-3 border-b border-hugo-surface-inverse bg-hugo-surface-inverse px-6 text-hugo-text-inverse max-[900px]:px-4"
    >
      <div
        v-if="$slots.appIcon || appIcon"
        class="grid h-9 w-9 place-items-center rounded-lg bg-hugo-brand-accent text-hugo-text-inverse [&_svg]:h-5 [&_svg]:w-5"
        data-slot="app-icon"
      >
        <slot name="appIcon">
          <component :is="() => renderValue(appIcon)" />
        </slot>
      </div>
      <h1 v-if="$slots.appTitle || appTitle" class="m-0 text-lg font-bold leading-tight tracking-normal">
        <slot name="appTitle">
          <component :is="() => renderValue(appTitle)" />
        </slot>
      </h1>
      <div v-if="$slots.titleSlot || titleSlot" class="ml-auto text-hugo-text-inverse" data-slot="title-slot">
        <slot name="titleSlot">
          <component :is="() => renderValue(titleSlot)" />
        </slot>
      </div>
    </header>

    <div
      class="grid min-h-0 flex-1"
      :class="
        hasVisibleNav
          ? 'grid-cols-[260px_minmax(0,1fr)] max-[900px]:grid-cols-1 max-[900px]:grid-rows-[auto_minmax(0,1fr)]'
          : 'grid-cols-1'
      "
    >
      <aside
        v-if="hasVisibleNav"
        aria-label="Primary navigation"
        class="min-h-0 overflow-y-auto border-r border-hugo-border-default bg-hugo-surface-default max-[900px]:max-h-[40vh] max-[900px]:border-b max-[900px]:border-r-0"
      >
        <div class="grid gap-1 p-4 max-[900px]:p-3">
          <template v-for="item in navProps?.navItems" :key="item.id">
            <div class="grid gap-0.5">
              <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1" :style="{ paddingLeft: '0px' }">
                <button
                  type="button"
                  class="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-transparent bg-transparent px-2.5 text-left text-sm font-semibold leading-tight tracking-normal text-hugo-text-default outline-none hover:bg-hugo-surface-tinted focus-visible:border-hugo-focus focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-hugo-focus"
                  :class="
                    selectedId === item.id &&
                    'bg-hugo-surface-tinted font-bold text-hugo-text-primary hover:bg-hugo-surface-tinted'
                  "
                  :aria-current="selectedId === item.id ? 'page' : undefined"
                  @click="selectItem(item)"
                >
                  <span
                    v-if="item.icon"
                    class="grid h-5 w-5 place-items-center text-inherit [&_svg]:h-5 [&_svg]:w-5"
                    data-slot="nav-icon"
                  >
                    <component :is="() => renderValue(item.icon)" />
                  </span>
                  <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    <component :is="() => renderValue(item.label)" />
                  </span>
                </button>
                <button
                  v-if="item.children?.length"
                  type="button"
                  class="grid h-8 w-8 place-items-center rounded-md text-hugo-text-subtle outline-none hover:bg-hugo-surface-tinted focus-visible:ring-2 focus-visible:ring-hugo-focus"
                  :aria-label="expandedSet.has(item.id) ? `Collapse ${item.label}` : `Expand ${item.label}`"
                  :aria-expanded="expandedSet.has(item.id)"
                  @click="toggleExpanded(item.id)"
                >
                  <ChevronDown v-if="expandedSet.has(item.id)" class="h-4 w-4" />
                  <ChevronRight v-else class="h-4 w-4" />
                </button>
              </div>

              <div v-if="item.children?.length && expandedSet.has(item.id)" class="grid gap-0.5" role="group">
                <div
                  v-for="child in item.children"
                  :key="child.id"
                  class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 pl-[18px] max-[900px]:pl-0"
                >
                  <button
                    type="button"
                    class="flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-transparent bg-transparent px-2.5 text-left text-sm font-semibold leading-tight tracking-normal text-hugo-text-default outline-none hover:bg-hugo-surface-tinted focus-visible:border-hugo-focus focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-hugo-focus"
                    :class="
                      selectedId === child.id &&
                      'bg-hugo-surface-tinted font-bold text-hugo-text-primary hover:bg-hugo-surface-tinted'
                    "
                    :aria-current="selectedId === child.id ? 'page' : undefined"
                    @click="selectItem(child)"
                  >
                    <span
                      v-if="child.icon"
                      class="grid h-5 w-5 place-items-center text-inherit [&_svg]:h-5 [&_svg]:w-5"
                      data-slot="nav-icon"
                    >
                      <component :is="() => renderValue(child.icon)" />
                    </span>
                    <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      <component :is="() => renderValue(child.label)" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>

      <main v-if="!hidden" class="min-h-0 min-w-0 overflow-y-auto p-6 max-[900px]:p-4" data-slot="content">
        <slot />
      </main>
    </div>
  </component>
</template>
