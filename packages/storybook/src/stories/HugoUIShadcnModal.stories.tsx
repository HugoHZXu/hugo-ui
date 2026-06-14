import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Info, X } from 'lucide-react';
import {
  Button,
  Modal,
  ModalContentText,
  type ModalButtonsType,
  type ModalProps,
  type ModalType,
} from '@hugo-ui/shadcn';

const hiddenControls = {
  classNames: { control: false },
  footerComponent: { control: false },
  headerComponent: { control: false },
  headerPrefixIcon: { control: false },
  onClose: { control: false },
  onOpenChange: { control: false },
  open: { control: false },
  slotProps: { control: false },
} as const;

const meta = {
  title: 'Hugo UI Shadcn/Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    closeButton: undefined,
    loading: false,
    open: true,
    showLoadingIndicator: undefined,
    title: 'Sample modal',
    type: 'transactional',
  },
  argTypes: {
    ...hiddenControls,
    type: {
      control: { type: 'select' as const },
      options: [
        'transactional',
        'destructive',
        'warning',
        'informational',
        'error',
      ] satisfies ModalType[],
    },
    buttonDefs: {
      control: false,
    },
    children: {
      control: false,
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

type ModalDemoProps = ModalProps & {
  defaultOpen?: boolean;
};

const ModalDemo = ({ children, defaultOpen = true, ...args }: ModalDemoProps) => {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleClose = () => {
    action('onClose')();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal {...args} onClose={handleClose} onOpenChange={setOpen} open={open}>
        {children}
      </Modal>
    </>
  );
};

const defaultAction: ModalButtonsType = {
  primary: {
    onClick: action('primary click'),
  },
};

export const Transactional: Story = {
  render: (args) => (
    <ModalDemo {...args} buttonDefs={defaultAction} title="Transactional" type="transactional">
      <ModalContentText>
        Review this sample note before applying the selected changes.
      </ModalContentText>
    </ModalDemo>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <ModalDemo {...args} buttonDefs={defaultAction} title="Remove example" type="destructive">
      <ModalContentText>
        This action changes the selected example and should be confirmed first.
      </ModalContentText>
    </ModalDemo>
  ),
};

export const Warning: Story = {
  render: (args) => (
    <ModalDemo {...args} buttonDefs={defaultAction} title="Unsaved changes" type="warning">
      <ModalContentText>The current note has changes that have not been applied.</ModalContentText>
    </ModalDemo>
  ),
};

export const Informational: Story = {
  render: (args) => (
    <ModalDemo {...args} title="Informational" type="informational">
      <ModalContentText>
        This message gives additional context for the current example.
      </ModalContentText>
    </ModalDemo>
  ),
};

export const SystemError: Story = {
  render: (args) => (
    <ModalDemo {...args} title="Example unavailable" type="error">
      <ModalContentText>The selected example cannot be displayed right now.</ModalContentText>
    </ModalDemo>
  ),
};

export const LoadingButton: Story = {
  render: (args) => {
    const LoadingButtonDemo = () => {
      const [loading, setLoading] = React.useState(false);
      const buttonDefs: ModalButtonsType = {
        primary: {
          label: loading ? 'Applying' : 'Apply',
          onClick: () => {
            action('primary click')();
            setLoading(true);
          },
        },
        tertiary: {
          label: 'Read note',
          onClick: action('tertiary click'),
        },
      };

      return (
        <ModalDemo
          {...args}
          buttonDefs={buttonDefs}
          loading={loading}
          showLoadingIndicator={false}
          title="Apply changes"
          type="transactional"
        >
          <ModalContentText>
            The content remains visible while the primary action is loading.
          </ModalContentText>
        </ModalDemo>
      );
    };

    return <LoadingButtonDemo />;
  },
};

export const LoadingIndicator: Story = {
  render: (args) => (
    <ModalDemo
      {...args}
      buttonDefs={defaultAction}
      loading
      showLoadingIndicator
      title="Loading example"
      type="transactional"
    >
      <ModalContentText>
        This content is hidden while the central indicator is active.
      </ModalContentText>
    </ModalDemo>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <ModalDemo
      {...args}
      buttonDefs={{
        primary: { label: 'Apply', onClick: action('primary click') },
        secondary: { label: 'Dismiss' },
        tertiary: { label: 'Read note', onClick: action('tertiary click') },
      }}
      subTitle="Sample section"
      title="Long content"
      type="transactional"
    >
      {Array.from({ length: 24 }, (_, index) => (
        <ModalContentText className="mb-3" key={index}>
          Sample content line {index + 1} keeps the dialog scroll area visible and stable.
        </ModalContentText>
      ))}
    </ModalDemo>
  ),
};

export const CustomHeaderAndFooter: Story = {
  render: (args) => {
    const CustomShellDemo = () => {
      const [open, setOpen] = React.useState(true);

      return (
        <>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Modal
            {...args}
            footerComponent={
              <div className="flex min-h-16 items-center justify-end bg-hugo-neutral-200 px-6">
                <Button onClick={() => setOpen(false)} variant="outline">
                  Done
                </Button>
              </div>
            }
            headerComponent={
              <div className="flex min-h-16 items-center justify-between px-6">
                <span className="inline-flex items-center gap-2 text-lg font-semibold text-hugo-text-primary">
                  <Info size={20} />
                  Custom header
                </span>
                <button
                  aria-label="close"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-hugo-text-default hover:bg-hugo-surface-tinted"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </div>
            }
            onOpenChange={setOpen}
            open={open}
            type="transactional"
          >
            <ModalContentText>
              Custom header and footer content can frame the same modal body.
            </ModalContentText>
          </Modal>
        </>
      );
    };

    return <CustomShellDemo />;
  },
};
