import type { Theme } from '@mui/material/styles';
import { createTableTokens } from '../../Table/styles/tableTokens';

export const DATA_GRID_ROOT_PREFIX = 'HugoUIDataGrid';

export const createDataGridTokens = (theme: Theme) => {
  const tableTokens = createTableTokens(theme);

  return {
    ...tableTokens,
    sizing: {
      ...tableTokens.sizing,
      defaultHeight: 420,
      resizeHandleWidth: 8,
      resizeIndicatorWidth: 2,
    },
  };
};
