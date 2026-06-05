import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { action } from 'storybook/actions';
import { DetailCard } from '@hugo-ui/mui';
import { hugoUIColorRoles } from '@hugo-ui/mui/styles/theme';

const CardPreview = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      width: 'min(100%, 720px)',
      display: 'grid',
      gap: 2,
      padding: 3,
      background: hugoUIColorRoles.surface.subtle,
    }}
  >
    {children}
  </Box>
);

const CardContent = () => (
  <>
    <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.25 }}>Basic information</h3>
    <p style={{ margin: 0, color: '#515B6B', fontSize: 14, lineHeight: 1.5 }}>
      Reusable detail panel for grouped fields and supporting notes.
    </p>
  </>
);

const meta = {
  title: 'HugoUI/Molecules/DetailCard',
  component: DetailCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DetailCard>;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <CardPreview>
      <DetailCard>
        <CardContent />
      </DetailCard>
    </CardPreview>
  ),
};

export const Clickable: Story = {
  render: () => (
    <CardPreview>
      <DetailCard onClick={action('detail-card-click')}>
        <CardContent />
      </DetailCard>
    </CardPreview>
  ),
};
