import type { Component, HTMLAttributes } from 'vue';

export type CardSize = 'default' | 'sm';

export type CardProps = {
  as?: string | Component;
  class?: HTMLAttributes['class'];
  clickable?: boolean;
  size?: CardSize;
};

export type CardSectionProps = {
  as?: string | Component;
  class?: HTMLAttributes['class'];
};
