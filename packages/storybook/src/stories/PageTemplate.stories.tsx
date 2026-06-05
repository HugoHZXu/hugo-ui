import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateIcon from '@mui/icons-material/Update';
import WidgetsIcon from '@mui/icons-material/Widgets';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { PageTemplate, PageTemplateNavItem } from '@hugo-ui/mui';

const navItems: PageTemplateNavItem[] = [
  {
    id: 'components',
    label: 'Components',
    icon: <WidgetsIcon fontSize="small" />,
    children: [
      {
        id: 'updates',
        label: 'Updates',
        icon: <UpdateIcon fontSize="small" />,
      },
    ],
  },
];

const DemoContent = () => (
  <div
    style={{
      minHeight: 280,
      border: '1px solid #d5d7de',
      borderRadius: 8,
      background: '#fff',
      padding: 24,
    }}
  >
    Template content
  </div>
);

const TallDemoContent = () => (
  <div
    style={{
      display: 'grid',
      gap: 16,
    }}
  >
    {Array.from({ length: 16 }).map((_, index) => (
      <div
        key={index}
        style={{
          minHeight: 96,
          border: '1px solid #d5d7de',
          borderRadius: 8,
          background: '#fff',
          padding: 24,
        }}
      >
        Content section {index + 1}
      </div>
    ))}
  </div>
);

const meta = {
  title: 'HugoUI/Templates/PageTemplate',
  component: PageTemplate,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageTemplate>;

export default meta;

type Story = StoryObj;

export const WithoutNavigation: Story = {
  render: () => (
    <PageTemplate appTitle="Component Library" appIcon={<WidgetsIcon />}>
      <DemoContent />
    </PageTemplate>
  ),
};

export const WithNavigation: Story = {
  render: () => (
    <PageTemplate
      appTitle="Component Library"
      appIcon={<WidgetsIcon />}
      titleSlot={<SettingsIcon fontSize="small" />}
      navProps={{
        navItems,
        defaultSelected: 'components',
        defaultExpanded: ['components'],
        onBeforeSelection: (selection, onSelection) => {
          action('nav selected')(selection);
          onSelection();
        },
      }}
    >
      <DemoContent />
    </PageTemplate>
  ),
};

export const ChildSelected: Story = {
  render: () => (
    <PageTemplate
      appTitle="Component Library"
      appIcon={<WidgetsIcon />}
      navProps={{
        navItems,
        defaultSelected: 'updates',
        defaultExpanded: ['components'],
        onBeforeSelection: (selection, onSelection) => {
          action('nav selected')(selection);
          onSelection();
        },
      }}
    >
      <DemoContent />
    </PageTemplate>
  ),
};

export const ScrollableMainContent: Story = {
  render: () => (
    <PageTemplate
      appTitle="Component Library"
      appIcon={<WidgetsIcon />}
      navProps={{
        navItems,
        defaultSelected: 'updates',
        defaultExpanded: ['components'],
      }}
    >
      <TallDemoContent />
    </PageTemplate>
  ),
};

export const MobileWidth: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <PageTemplate
      appTitle="Component Library"
      appIcon={<WidgetsIcon />}
      navProps={{
        navItems,
        defaultSelected: 'updates',
        defaultExpanded: ['components'],
      }}
    >
      <DemoContent />
    </PageTemplate>
  ),
};
