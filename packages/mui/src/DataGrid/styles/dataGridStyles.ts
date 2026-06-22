import Box from '@mui/material/Box';
import { createTheme, styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { createTableThemeOverrides } from '../../Table/styles/tableStyles';
import { DATA_GRID_ROOT_PREFIX, createDataGridTokens } from './dataGridTokens';

export const createDataGridTheme = (parentTheme: Theme) =>
  createTheme(parentTheme, createTableThemeOverrides());

export const DataGridRoot = styled(Box)(({ theme }) => {
  const tokens = createDataGridTokens(theme as Theme);

  return {
    width: '100%',
    color: tokens.colors.textDefault,
    [`&.${DATA_GRID_ROOT_PREFIX}-root`]: {
      boxSizing: 'border-box',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-container`]: {
      border: `1px solid ${tokens.colors.borderDefault}`,
      borderRadius: tokens.sizing.radius,
      background: tokens.colors.surface,
      overflow: 'hidden',
      ...theme.hugoUIShadows.NO_SHADOW,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-viewport`]: {
      position: 'relative',
      overflow: 'auto',
      background: tokens.colors.surface,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-table`]: {
      position: 'relative',
      minWidth: '100%',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-header`]: {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      background: tokens.colors.surfaceHeader,
      borderBottom: `1px solid ${tokens.colors.borderStrong}`,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-row`]: {
      display: 'grid',
      minWidth: '100%',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-headerCell`]: {
      ...theme.hugoUITypography.smallText.uppercase,
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      height: tokens.sizing.headCellHeight,
      padding: `0 ${tokens.sizing.cellPaddingX}px`,
      color: tokens.colors.textSubtle,
      background: tokens.colors.surfaceHeader,
      borderBottom: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-headerCellContent`]: {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      '.MuiTableSortLabel-root': {
        maxWidth: '100%',
        minWidth: 0,
      },
      '.MuiTableSortLabel-icon': {
        flexShrink: 0,
      },
    },
    [`.${DATA_GRID_ROOT_PREFIX}-resizeHandle`]: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: tokens.sizing.resizeHandleWidth,
      cursor: 'col-resize',
      touchAction: 'none',
      outline: 'none',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 8,
        right: 0,
        bottom: 8,
        width: tokens.sizing.resizeIndicatorWidth,
        background: tokens.colors.borderStrong,
        opacity: 0,
      },
      '@media (hover: hover)': {
        '&:hover::after': {
          opacity: 1,
        },
      },
      '&:focus-visible::after': {
        opacity: 1,
        background: tokens.colors.focusRing,
      },
    },
    [`.${DATA_GRID_ROOT_PREFIX}-resizeHandleActive::after`]: {
      opacity: 1,
      background: tokens.colors.focusRing,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-columnResizing`]: {
      userSelect: 'none',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-resizeIndicator`]: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      zIndex: 3,
      width: tokens.sizing.resizeIndicatorWidth,
      background: tokens.colors.focusRing,
      pointerEvents: 'none',
      transform: 'translateX(-50%)',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-body`]: {
      position: 'relative',
      minWidth: '100%',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-bodyRow`]: {
      position: 'absolute',
      left: 0,
      top: 0,
      borderBottom: `1px solid ${tokens.colors.borderDefault}`,
      outline: 'none',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-rowInteractive`]: {
      cursor: 'pointer',
      '@media (hover: hover)': {
        [`&:hover .${DATA_GRID_ROOT_PREFIX}-cell`]: {
          background: tokens.colors.surfaceHover,
        },
      },
      [`&:focus-visible .${DATA_GRID_ROOT_PREFIX}-cell`]: {
        boxShadow: [
          `inset 0 ${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
          `inset 0 -${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
        ].join(', '),
      },
      [`&:focus-visible .${DATA_GRID_ROOT_PREFIX}-cell:first-of-type`]: {
        boxShadow: [
          `inset ${tokens.sizing.focusRingWidth}px 0 0 ${tokens.colors.focusRing}`,
          `inset 0 ${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
          `inset 0 -${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
        ].join(', '),
      },
      [`&:focus-visible .${DATA_GRID_ROOT_PREFIX}-cell:last-of-type`]: {
        boxShadow: [
          `inset -${tokens.sizing.focusRingWidth}px 0 0 ${tokens.colors.focusRing}`,
          `inset 0 ${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
          `inset 0 -${tokens.sizing.focusRingWidth}px 0 ${tokens.colors.focusRing}`,
        ].join(', '),
      },
    },
    [`.${DATA_GRID_ROOT_PREFIX}-rowSelected .${DATA_GRID_ROOT_PREFIX}-cell`]: {
      background: tokens.colors.surfaceSelected,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-rowSelected.${DATA_GRID_ROOT_PREFIX}-rowInteractive:hover .${DATA_GRID_ROOT_PREFIX}-cell`]:
      {
        background: tokens.colors.surfaceSelectedHover,
      },
    [`.${DATA_GRID_ROOT_PREFIX}-cell`]: {
      ...theme.hugoUITypography.body,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      padding: `0 ${tokens.sizing.cellPaddingX}px`,
      color: tokens.colors.textDefault,
      overflow: 'hidden',
      background: tokens.colors.surface,
    },
    [`.${DATA_GRID_ROOT_PREFIX}-cellContent`]: {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-alignCenter`]: {
      justifyContent: 'center',
      textAlign: 'center',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-alignRight`]: {
      justifyContent: 'flex-end',
      textAlign: 'right',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-stateContent`]: {
      minHeight: tokens.sizing.stateMinHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: tokens.sizing.statePadding,
      textAlign: 'center',
      color: tokens.colors.textSubtle,
      background: tokens.colors.surface,
      borderBottom: `1px solid ${tokens.colors.borderDefault}`,
      boxSizing: 'border-box',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-loadingRows`]: {
      display: 'grid',
      minWidth: '100%',
    },
    [`.${DATA_GRID_ROOT_PREFIX}-loadingRow`]: {
      display: 'grid',
      borderBottom: `1px solid ${tokens.colors.borderDefault}`,
    },
  };
});
