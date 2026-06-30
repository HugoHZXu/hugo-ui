# @hugo-ui/shadcn

English | [简体中文](./README.zh-CN.md)

Lightweight React components for Hugo UI, built with Tailwind CSS, Radix UI primitives, and shadcn-style composition patterns. This is the lighter alternative to `@hugo-ui/mui`, with its own stylesheet and design tokens.

## Installation

```bash
npm install @hugo-ui/shadcn react react-dom
```

> **Note**: Your application needs to have Tailwind CSS configured. Import the package stylesheet once at your app entry point.

## Quick Start

```tsx
import { useState } from 'react';
import '@hugo-ui/shadcn/styles.css';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HugoUIShadcnProvider,
  Input,
  Modal,
  ModalContentText,
} from '@hugo-ui/shadcn';

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <HugoUIShadcnProvider>
      <Card>
        <CardHeader>
          <CardTitle>Example Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Item name" />
          <Button className="mt-4" onClick={() => setOpen(true)} tone="brand" variant="solid">
            Save
          </Button>
        </CardContent>
      </Card>
      <Modal
        buttonDefs={{ primary: { onClick: () => setOpen(false) } }}
        onClose={() => setOpen(false)}
        onOpenChange={setOpen}
        open={open}
        title="Sample modal"
      >
        <ModalContentText>Confirm the selected example before saving.</ModalContentText>
      </Modal>
    </HugoUIShadcnProvider>
  );
}
```

## Available Components

- **Actions & Badges**: `Button`, `Badge`
- **Forms**: `Input`
- **Layout**: `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription`
- **Dialog Primitives**: `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`
- **Modal Layer**: `Modal`, `ModalTitle`, `ModalFooter`, `ModalContentText`, `ModalLoadingIndicator`
- **Utilities**: `HugoUIShadcnProvider`, `cn`

## Styling Architecture

The distributed stylesheet includes Tailwind directives, design tokens, base styles, and component styles:

- `src/styles/globals.css` - Main stylesheet entry point
- `src/styles/tokens.css` - Hugo UI color roles and Tailwind theme variables
- `src/styles/base.css` - Base CSS reset
- Component variants use `class-variance-authority` where appropriate
- Components expose stable `data-*` attributes and `className` for controlled customization

## Local Development

From the repository root:

```bash
pnpm --filter @hugo-ui/shadcn run test
pnpm --filter @hugo-ui/shadcn run typecheck
pnpm --filter @hugo-ui/shadcn run build
```
