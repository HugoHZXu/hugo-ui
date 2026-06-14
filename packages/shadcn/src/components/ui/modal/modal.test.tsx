import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { Modal, ModalContentText } from './modal';

describe('Modal', () => {
  it('renders a titled transactional dialog with default actions', () => {
    render(
      <Modal open title="Transactional">
        <ModalContentText>Review the selected example before saving.</ModalContentText>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Transactional' });
    expect(dialog).toHaveAttribute('data-type', 'transactional');
    expect(screen.getByText('Review the selected example before saving.')).toBeInTheDocument();

    const primary = screen.getByRole('button', { name: 'Save' });
    const secondary = screen.getByRole('button', { name: 'Cancel' });
    expect(primary).toHaveAttribute('data-variant', 'solid');
    expect(primary).toHaveAttribute('data-tone', 'brand');
    expect(secondary).toHaveAttribute('data-variant', 'outline');
    expect(secondary).toHaveAttribute('data-tone', 'brand');
  });

  it('maps destructive defaults to danger primary and neutral secondary actions', () => {
    render(
      <Modal open title="Remove example" type="destructive">
        <ModalContentText>This action changes the selected example.</ModalContentText>
      </Modal>
    );

    expect(screen.getByRole('img', { name: 'alert' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Destruct' })).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('data-tone', 'neutral');
  });

  it('closes through Escape and calls close handlers once', () => {
    const handleClose = jest.fn();
    const handleOpenChange = jest.fn();

    render(
      <Modal
        onClose={handleClose}
        onOpenChange={handleOpenChange}
        open
        title="Informational"
        type="informational"
      >
        <ModalContentText>Read this informational example.</ModalContentText>
      </Modal>
    );

    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Informational' }), { key: 'Escape' });

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('uses closeButton as an explicit override for non-action modal headers', () => {
    const { rerender } = render(
      <Modal closeButton={false} open title="System note" type="error">
        <ModalContentText>Something needs attention.</ModalContentText>
      </Modal>
    );

    expect(screen.queryByRole('button', { name: 'close' })).not.toBeInTheDocument();

    rerender(
      <Modal closeButton open title="System note" type="transactional">
        <ModalContentText>Something needs attention.</ModalContentText>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
  });

  it('renders custom header, footer, and tertiary action content', () => {
    render(
      <Modal
        buttonDefs={{
          tertiary: {
            label: 'Read note',
          },
        }}
        footerComponent={<div data-testid="custom-footer">Custom footer</div>}
        headerComponent={<div data-testid="custom-header">Custom header</div>}
        open
      >
        <ModalContentText>Custom shell content.</ModalContentText>
      </Modal>
    );

    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Read note' })).not.toBeInTheDocument();
  });

  it('renders footer actions in tertiary, secondary, primary DOM order', () => {
    render(
      <Modal
        buttonDefs={{
          primary: { label: 'Apply' },
          secondary: { label: 'Dismiss' },
          tertiary: { label: 'Read note' },
        }}
        open
        title="Action order"
      >
        <ModalContentText>Actions should keep a stable reading order.</ModalContentText>
      </Modal>
    );

    const footer = document.querySelector('[data-slot="modal-footer"]') as HTMLElement;
    expect(
      within(footer)
        .getAllByRole('button')
        .map((button) => button.textContent)
    ).toEqual(['Read note', 'Dismiss', 'Apply']);
  });

  it('shows button-level loading when the central indicator is disabled', () => {
    render(
      <Modal
        buttonDefs={{
          tertiary: { label: 'Read note' },
        }}
        loading
        open
        showLoadingIndicator={false}
        title="Loading action"
      >
        <ModalContentText>Content remains visible but disabled while loading.</ModalContentText>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { name: 'Loading action' });
    const primary = screen.getByRole('button', { name: 'Save' });
    const secondary = screen.getByRole('button', { name: 'Cancel' });
    const tertiary = screen.getByRole('button', { name: 'Read note' });

    expect(dialog).toHaveAttribute('data-loading', 'true');
    expect(primary).toHaveAttribute('aria-busy', 'true');
    expect(primary).toBeDisabled();
    expect(secondary).toBeDisabled();
    expect(tertiary).toHaveAttribute('aria-disabled', 'true');
    expect(document.querySelector('[data-slot="modal-body-content"]')).toHaveAttribute(
      'data-disabled',
      'true'
    );
  });

  it('shows a central loading indicator and announces loading after a delay', async () => {
    jest.useFakeTimers();

    render(
      <Modal loading open showLoadingIndicator title="Loading example">
        <ModalContentText>This content is hidden while loading.</ModalContentText>
      </Modal>
    );

    expect(document.querySelector('[data-slot="modal-loading-indicator"]')).toBeInTheDocument();
    expect(screen.queryByText('This content is hidden while loading.')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(document.querySelector('[data-slot="modal-screen-reader-status"]')).toHaveTextContent(
        'Loading'
      );
    });

    jest.useRealTimers();
  });
});
