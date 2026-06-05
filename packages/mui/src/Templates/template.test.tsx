import React from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { fireEvent, render, screen } from '../utils/testUtils';
import { HugoUIContentTemplate } from './ContentTemplate';
import { HugoUIPageTemplate, HugoUIPageTemplateNavItem } from './PageTemplate';

const navItems: HugoUIPageTemplateNavItem[] = [
  {
    id: 'components',
    label: 'Components',
    icon: <WidgetsIcon />,
    children: [{ id: 'updates', label: 'Updates', icon: <UpdateIcon /> }],
  },
];

describe('HugoUIPageTemplate', () => {
  it('renders the app title and children', () => {
    const { container } = render(
      <HugoUIPageTemplate appTitle="Component Library">
        <div>Template content</div>
      </HugoUIPageTemplate>
    );

    expect(screen.getByRole('heading', { name: 'Component Library' })).toBeInTheDocument();
    expect(screen.getByText('Template content')).toBeInTheDocument();
    expect(container.querySelector('.HugoUIPageTemplate-bodyNoNav')).not.toBeNull();
    expect(container.querySelector('.HugoUIPageTemplate-content')).not.toBeNull();
  });

  it('marks the selected nav item', () => {
    const { container } = render(
      <HugoUIPageTemplate
        appTitle="Component Library"
        navProps={{
          navItems,
          defaultSelected: 'updates',
          defaultExpanded: ['components'],
        }}
      />
    );

    expect(container.querySelector('.HugoUIPageTemplate-nav')).not.toBeNull();
    expect(container.querySelector('.HugoUIPageTemplate-bodyNoNav')).toBeNull();
    expect(screen.getByRole('button', { name: 'Updates' })).toHaveClass(
      'HugoUIPageTemplate-navItemSelected'
    );
  });

  it('runs navigation selection through onBeforeSelection', () => {
    const onBeforeSelection = jest.fn((_selection: string, onSelection: () => void) =>
      onSelection()
    );

    render(
      <HugoUIPageTemplate
        appTitle="Component Library"
        navProps={{
          navItems,
          defaultSelected: 'components',
          defaultExpanded: ['components'],
          onBeforeSelection,
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Updates' }));

    expect(onBeforeSelection).toHaveBeenCalledWith('updates', expect.any(Function));
    expect(screen.getByRole('button', { name: 'Updates' })).toHaveClass(
      'HugoUIPageTemplate-navItemSelected'
    );
  });
});

describe('HugoUIContentTemplate', () => {
  it('renders a title, description, action area, and content', () => {
    render(
      <HugoUIContentTemplate
        type="table"
        pageTitle="Components"
        titleInfo="Browse reusable component examples."
        actionItems={<button type="button">Add</button>}
      >
        <div>Table content</div>
      </HugoUIContentTemplate>
    );

    expect(screen.getByRole('heading', { name: 'Components' })).toBeInTheDocument();
    expect(screen.getByText('Browse reusable component examples.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByText('Table content')).toBeInTheDocument();
  });

  it('calls onBack from the back action', () => {
    const onBack = jest.fn();

    render(
      <HugoUIContentTemplate type="card" pageTitle="Alpha pattern" onBack={onBack}>
        <div>Detail content</div>
      </HugoUIContentTemplate>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
