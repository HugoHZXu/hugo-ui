import type { Component, HTMLAttributes, VNode } from 'vue';

export type PageTemplateNavItem = {
  id: string;
  label: string | VNode;
  icon?: string | VNode;
  path?: string;
  children?: PageTemplateNavItem[];
};

export type PageTemplateNavProps = {
  navItems: PageTemplateNavItem[];
  defaultSelected?: string;
  defaultExpanded?: string[];
  hidden?: boolean;
};

export type PageTemplateProps = {
  appIcon?: string | VNode;
  appTitle?: string | VNode;
  as?: string | Component;
  class?: HTMLAttributes['class'];
  hidden?: boolean;
  navProps?: PageTemplateNavProps;
  titleSlot?: string | VNode;
};

export type PageTemplateEmits = {
  (event: 'beforeSelection', selection: string, onSelection: () => void): void;
  (event: 'selectionChange', selection: string): void;
};
