---
name: design-token-audit
description: Audit color and token usage before or after design-system color changes. Use when changing color roles, raw palette usage, hover/selected states, status colors, headers, surfaces, or alpha-based styling.
---

# Design Token Audit

Use this skill for design-system color or token work.

## Step 1: Map The Token Layers

Inspect:

- raw palette: `packages/mui/src/styles/color.ts`
- semantic roles: `packages/mui/src/styles/colorRoles.ts`
- theme exposure: `packages/mui/src/styles/theme.ts`
- component token files under `packages/mui/src/**/styles/*Tokens.ts`
- shadcn CSS token surface under `packages/shadcn/src/styles/*.css` when Tailwind/shadcn styling is involved

## Step 2: Prefer Semantic Roles

Decision order:

1. Use an existing `theme.hugoUIColorRoles` semantic role.
2. If no role exists but the need is reusable, propose adding a semantic role.
3. If the color is truly component-specific, use a component token with a clear name.
4. Use `theme.hugoUIColors` only as a deliberate escape hatch.

Do not use raw hex values in component styles.

## Step 3: Review Alpha Usage

Search for:

```bash
rg "alpha\\(" packages/mui/src packages/storybook/src
```

`alpha(...)` is acceptable for deliberate transparency effects such as overlays or material blends. It is not preferred for ordinary hover, selected, active, or status backgrounds when an existing raw token or role can express the state.

## Step 4: Check For Duplicate Or Unused Palette Tokens

Look for:

- raw colors used only in docs
- duplicate hex values with different names
- `hugoUIColors` references repeated across components
- roles defined but not consumed
- shadcn CSS variables that drift from documented MUI semantic roles

Do not delete tokens casually. Report candidates first unless the user asked for cleanup.

## Step 5: Audit Current UI States

Inspect at minimum:

- app/header surfaces used by templates
- nav hover/selected/focus
- table row hover/selected/focus
- toggle hover/selected/focus
- search box hover/focus
- status tag backgrounds
- modal overlay and feedback surfaces
- shadcn button/input/card/badge states when relevant

Prefer low-contrast surfaces such as `surface.tinted` for hover/selected states.

## Step 6: Report

End with:

- `Raw palette findings`
- `Semantic role findings`
- `Direct hugoUIColors usage`
- `Alpha usage`
- `Recommended role additions or cleanup`
- `Verification run or intentionally skipped`
