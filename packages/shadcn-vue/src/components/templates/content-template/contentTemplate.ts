import type { Component, HTMLAttributes, VNode } from 'vue';

export type ContentTemplateType = 'card' | 'table' | 'error' | 'full';

export type ContentTemplateProps = {
  actionItems?: string | VNode;
  as?: string | Component;
  class?: HTMLAttributes['class'];
  errorMessage?: string | VNode;
  pageTitle?: string | VNode;
  titleInfo?: string | VNode;
  type: ContentTemplateType;
};

export type ContentTemplateEmits = {
  (event: 'back'): void;
};
