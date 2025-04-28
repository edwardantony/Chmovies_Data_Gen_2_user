'use client';
import React from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import {
  Box,
  Tooltip,
  IconButton,
  Button,
  darken,
  lighten,
  useTheme,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/AddBoxTwoTone';
import {
  type PaginationState,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';

// Reusable change handler utility
const handleChange = <T,>(
  currentState: T,
  setState: (newState: T) => void
) => (updaterOrValue: T | ((prevState: T) => T)) => {
  const newState = typeof updaterOrValue === 'function'
    ? (updaterOrValue as (prevState: T) => T)(currentState)
    : updaterOrValue;
  setState(newState);
};

interface DataTableProps<TData extends Record<string, any>> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: string;
  rowSelection: RowSelectionState;
  isLoading: boolean;
  showProgressBars: boolean;
  totalCount?: number;
  error?: string | null;
  onPaginationChange: (pagination: PaginationState) => void;
  onSortingChange: (sorting: SortingState) => void;
  onGlobalFilterChange: (filter: string) => void;
  onRowSelectionChange: (rowSelection: RowSelectionState) => void;
  onCreate: (values: TData) => Promise<void>;
  onUpdate: (values: TData) => Promise<void>;
  onDelete: (id: string | null, isBulkDelete: boolean) => Promise<void>;
  isTopToolbar?: boolean;
  muiRowDragHandleProps?: any;
  onClearError?: () => void;
}

const DataTable = <TData extends Record<string, any> & { id?: string }>({
  columns,
  data,
  pagination,
  sorting,
  globalFilter,
  rowSelection,
  isLoading,
  showProgressBars,
  totalCount,
  error,
  onPaginationChange,
  onSortingChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  onCreate,
  onUpdate,
  onDelete,
  isTopToolbar,
  muiRowDragHandleProps,
  onClearError,
}: DataTableProps<TData>) => {
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === 'dark'
      ? 'rgb(232, 232, 232)'
      : 'rgb(240, 240, 240)';

  const table = useMaterialReactTable({
    columns,
    data,
    // Table features
    enableEditing: true,
    enableRowSelection: true,
    enablePagination: true,
    enableSorting: true,
    enableGlobalFilter: true,
    // Table Display Mode
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    // Disabled default control
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    // Manual state control
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // State handlers using the reusable utility
    onPaginationChange: handleChange(pagination, onPaginationChange),
    onSortingChange: handleChange(sorting, onSortingChange),
    onGlobalFilterChange: handleChange(globalFilter, onGlobalFilterChange),
    onRowSelectionChange: handleChange(rowSelection, onRowSelectionChange),
    // State values
    state: {
      pagination,
      sorting,
      globalFilter,
      rowSelection,
      isLoading,
      showProgressBars,
    },
    // Other configuration
    rowCount: totalCount ?? data.length + 1,
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: true,
      showLastButton: false,
    },
    initialState:{
      density: 'comfortable', // or 'comfortable', 'standard', 'compact'
      columnVisibility: {
        id: false,
        createdAt: false,
        updatedAt: false,
      },
      columnPinning: { right: ['mrt-row-actions'] },
    },
    // CRUD operations
    onCreatingRowSave: async ({ values, table }) => {
      await onCreate(values as TData);
      table.setCreatingRow(null);
    },
    onEditingRowSave: async ({ values, table }) => {
      await onUpdate(values as TData);
      table.setEditingRow(null);
    },
    // UI Components
    renderTopToolbarCustomActions: ({ table }) => (
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          onClick={() => table.setCreatingRow(true)}
          startIcon={<AddIcon />}
        >
          New
        </Button>
        {Object.keys(rowSelection).length > 0 && (
          <Button
            color="error"
            onClick={() => onDelete(null, true)}
            startIcon={<DeleteIcon />}
            variant="contained"
          >
            Delete Selected
          </Button>
        )}
      </Box>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => onDelete(row.original.id || null, false)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderEmptyRowsFallback: () => (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {isLoading ? 'Loading...' : 'No data found'}
      </Box>
    ),
    // Styling
    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(odd):not([data-selected="true"]) > td': {
          backgroundColor: darken(baseBackgroundColor, 0.06),
        },
        '& tr:nth-of-type(even):not([data-selected="true"]) > td': {
          backgroundColor: lighten(baseBackgroundColor, 0.06),
        },
      },
    },
    mrtTheme: {
      baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && (
        <Alert severity="error" onClose={onClearError}>
          {error}
        </Alert>
      )}
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default DataTable;