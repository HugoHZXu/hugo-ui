import React from 'react';
import userEvent from '@testing-library/user-event';
import { HugoUISearchBox } from './SearchBox';
import { render, screen } from '../utils/testUtils';

const renderSearchBox = (props: Partial<React.ComponentProps<typeof HugoUISearchBox>> = {}) => {
  const onChange = jest.fn();
  const onSearch = jest.fn();

  render(
    <HugoUISearchBox
      aria-label="Search items"
      value=""
      onChange={onChange}
      onSearch={onSearch}
      {...props}
    />
  );

  return { onChange, onSearch };
};

describe('HugoUISearchBox', () => {
  it('renders a native search input and design-system structure classes', () => {
    const { container } = render(
      <HugoUISearchBox aria-label="Search items" value="Alpha" onChange={jest.fn()} />
    );

    expect(screen.getByRole('searchbox', { name: 'Search items' })).toHaveValue('Alpha');
    expect(container.querySelector('.HugoUISearchBox-root')).not.toBeNull();
    expect(container.querySelector('.HugoUISearchBox-input')).not.toBeNull();
  });

  it('calls onChange as the user types', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSearchBox();

    await user.type(screen.getByRole('searchbox', { name: 'Search items' }), 'Alpha');

    expect(onChange).toHaveBeenCalledWith('A');
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('submits trimmed search text with Enter and the search button', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    renderSearchBox({ value: '  Alpha  ', onSearch });
    screen.getByRole('searchbox', { name: 'Search items' }).focus();

    await user.keyboard('[Enter]');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledTimes(2);
    expect(onSearch).toHaveBeenCalledWith('Alpha');
  });

  it('clears the current value and submits an empty search', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const onSearch = jest.fn();
    renderSearchBox({ value: 'Alpha', onChange, onSearch });

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onChange).toHaveBeenCalledWith('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('shows loading state and prevents search actions', () => {
    renderSearchBox({ value: 'Alpha', loading: true });

    expect(screen.getByText('Searching')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Search' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeDisabled();
  });
});
