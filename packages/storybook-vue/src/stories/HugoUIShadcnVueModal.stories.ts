import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { Info } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { Button, Modal, ModalContentText } from '@hugo-ui/shadcn-vue';

const launcherStyle = {
  display: 'grid',
  minHeight: '320px',
  padding: '32px',
  placeItems: 'center',
  width: '100%',
};

const getModalArgs = (args: Record<string, unknown>) =>
  computed(() => {
    const rest = { ...args };

    delete rest.defaultOpen;
    delete rest.modelValue;
    delete rest.open;

    return rest;
  });

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    title: 'Review example',
    type: 'transactional',
    loading: false,
    showLoadingIndicator: undefined,
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['transactional', 'destructive', 'warning', 'informational', 'error'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    showLoadingIndicator: {
      control: { type: 'boolean' },
    },
    closeButton: {
      control: { type: 'boolean' },
    },
    class: {
      control: { type: 'text' },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Transactional: Story = {
  render: (args) => ({
    components: { Button, Modal, ModalContentText },
    setup() {
      const open = ref(false);
      const modalArgs = getModalArgs(args);

      return { launcherStyle, modalArgs, open };
    },
    template: `
      <div :style="launcherStyle">
        <Button @click="open = true">Open modal</Button>
        <Modal v-bind="modalArgs" v-model:open="open">
          <ModalContentText>
            Confirm the selected example before saving the changes.
          </ModalContentText>
        </Modal>
      </div>
    `,
  }),
};

export const Destructive: Story = {
  args: {
    title: 'Remove example',
    type: 'destructive',
    buttonDefs: {
      primary: { label: 'Remove' },
    },
  },
  render: (args) => ({
    components: { Button, Modal, ModalContentText },
    setup() {
      const open = ref(false);
      const modalArgs = getModalArgs(args);

      return { launcherStyle, modalArgs, open };
    },
    template: `
      <div :style="launcherStyle">
        <Button @click="open = true">Open destructive modal</Button>
        <Modal v-bind="modalArgs" v-model:open="open">
          <ModalContentText>
            This action changes the selected example and cannot be undone.
          </ModalContentText>
        </Modal>
      </div>
    `,
  }),
};

export const Informational: Story = {
  args: {
    closeButton: true,
    title: 'Example note',
    type: 'informational',
  },
  render: (args) => ({
    components: { Button, Modal, ModalContentText },
    setup() {
      const open = ref(false);
      const modalArgs = getModalArgs(args);

      return { launcherStyle, modalArgs, open };
    },
    template: `
      <div :style="launcherStyle">
        <Button @click="open = true">Open informational modal</Button>
        <Modal v-bind="modalArgs" v-model:open="open">
          <ModalContentText>
            Use informational dialogs for short notes that do not require a decision.
          </ModalContentText>
        </Modal>
      </div>
    `,
  }),
};

export const LoadingAction: Story = {
  args: {
    closeButton: true,
    loading: true,
    showLoadingIndicator: false,
    title: 'Saving example',
  },
  render: Transactional.render,
};

export const CustomSlots: Story = {
  args: {
    ariaLabel: 'Custom example dialog',
    title: undefined,
    type: 'informational',
  },
  render: (args) => ({
    components: { Button, Info, Modal, ModalContentText },
    setup() {
      const open = ref(false);
      const modalArgs = getModalArgs(args);

      return { launcherStyle, modalArgs, open };
    },
    template: `
      <div :style="launcherStyle">
        <Button @click="open = true">Open custom modal</Button>
        <Modal v-bind="modalArgs" v-model:open="open" close-button>
          <template #header>
            <div class="flex items-center gap-3 px-6 py-6 min-[687px]:px-8">
              <Info class="h-8 w-8 text-hugo-brand-accent" />
              <div class="min-w-0">
                <div class="text-xl font-semibold leading-7 text-hugo-text-primary">
                  Custom header
                </div>
                <div class="text-sm leading-5 text-hugo-text-default">
                  Neutral slot content for a composed dialog.
                </div>
              </div>
            </div>
          </template>
          <ModalContentText>
            Replace the built-in header or footer when a composition needs custom structure.
          </ModalContentText>
          <template #footer="{ close }">
            <div class="flex shrink-0 justify-end gap-2 bg-hugo-neutral-200 px-6 py-4 min-[687px]:px-8">
              <Button variant="outline" @click="close">Dismiss</Button>
              <Button>Continue</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};
