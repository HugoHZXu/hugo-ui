import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { FileDropzone } from '@hugo-ui/shadcn-vue';

const meta = {
  title: 'Hugo UI Shadcn Vue/Molecule/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  args: {
    accept: '.csv,.txt',
    description: 'Drag and drop a file, or browse from your device.',
    maxSize: 1024 * 1024,
    multiple: false,
    title: 'Upload a sample file',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['idle', 'dragging', 'selected', 'error', 'uploading', 'done'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FileDropzone>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => ({
    components: { FileDropzone },
    setup() {
      const files = ref<File[]>([]);
      return { args, files };
    },
    template: `
      <div style="width: 420px">
        <FileDropzone v-model="files" v-bind="args" />
      </div>
    `,
  }),
};

export const Multiple: Story = {
  args: {
    description: 'Choose one or more sample files.',
    multiple: true,
    title: 'Upload sample files',
  },
};

export const Uploading: Story = {
  args: {
    description: 'The selected file is being uploaded.',
    status: 'uploading',
    title: 'Uploading file',
  },
};

export const Error: Story = {
  args: {
    error: 'File type is not supported.',
    title: 'Upload failed',
  },
};
