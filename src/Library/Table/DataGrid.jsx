import React, { useMemo, useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid modules (as per official getting started guide)
ModuleRegistry.registerModules([AllCommunityModule]);

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "./Table.css";
import Button from "../../Library/Button";
import { Switch } from "../../Library/Switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../../Library/DropdownMenu";
import { exportGridData } from "./GenericGridExport";
import DropdownSelect from "../../Component/DropdownSelect";
import AppIcon from "../../Component/AppIcon";
import { Density, DownloadTypes } from "../../Data/StaticData";

import AvatarThink from '../../Image/Avatar-think.png'

const DataGrid = ({
  rowData = [],
  columnDefs = [],
  height = 400,
  theme = 'ag-theme-alpine',
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [10, 25, 50, 100],
  enableSorting = true,
  enableFilter = true,
  enableColResize = true,
  enableRowSelection = 'multiple',
  onSelectionChanged,
  onCellClicked,
  onGridReady,
  defaultColDef = {},
  gridOptions = {},
  className = '',
  gridIcon="LayoutPanelLeft",
  gridTitle="Data Vie",
  ...props
}) => {
  // State for toolbar functionality
  const [visibleColumns, setVisibleColumns] = useState(
    columnDefs.map(col => col.field || col.colId).filter(Boolean)
  );
  const gridRef = useRef(null);

  // Default column definition
  const defaultColumnDef = useMemo(() => ({
    sortable: enableSorting,
    filter: enableFilter,
    resizable: enableColResize,
    minWidth: 100,
    flex: 1,
    ...defaultColDef,
  }), [enableSorting, enableFilter, enableColResize, defaultColDef]);

  // Reload function
  const handleReload = () => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshCells();
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (field) => {
    const newVisibleColumns = visibleColumns.includes(field)
      ? visibleColumns.filter(f => f !== field)
      : [...visibleColumns, field];

    setVisibleColumns(newVisibleColumns);

    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setColumnsVisible([field], newVisibleColumns.includes(field));
    }
  };

  // Grid options
  const gridOpts = useMemo(() => ({
    pagination,
    paginationPageSize,
    paginationPageSizeSelector,
    onSelectionChanged,
    onCellClicked,
    onGridReady,
    theme: 'legacy', // Use legacy theme mode for CSS file theming
    ...gridOptions,
  }), [
    pagination,
    paginationPageSize,
    paginationPageSizeSelector,
    onSelectionChanged,
    onCellClicked,
    onGridReady,
    gridOptions,
  ]);


  /* ================= EXPORT ================= */
  // Convert flat columnDefs to grouped format expected by ExportHelper
  const convertColumnDefsToGroups = (columnDefs) => {
    return [{
      header: 'Data',
      children: columnDefs.map(col => ({
        key: col.field || col.colId,
        label: col.headerName || (col.field || col.colId),
        type: col.type || 'string',
        render: col.cellRenderer ? (value) => col.cellRenderer({ value }) : null
      }))
    }];
  };

  /* ================= GROUPED EXPORT ================= */
  const exportFile = (type) => {
    if (!gridRef.current?.api) return;

    const api = gridRef.current.api;
    console.log(api);
    re


    /* 1️⃣ rows: selected OR all */
    const selectedRows = api.getSelectedRows();
    const dataToExport = selectedRows.length ? selectedRows : rowData;

    const groupedColumns = convertColumnDefsToGroups(columnDefs);

    exportGridData({
      api: api,
      rowData: dataToExport,
      columnDefs: groupedColumns,        // pass columnDefs as fallback
      type,              // "excel" | "csv" | "pdf" | "json"
      filename: "data",  // optional
    });
  };


  if (!rowData || rowData.length === 0) {
    return (
      <div className={`${className} bg-white shadow-md border rounded flex flex-col items-center justify-center`} {...props} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <img src={AvatarThink} alt="" className='h-72' />
        <div className='text-center'>
          <p>  Looks like empty!</p>
          <p>
            Adjust above filter for better results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white shadow-md border rounded`} {...props}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-">
        <div className="flex items-center gap-2">
          <AppIcon name={gridIcon}/>
          <h3 className="font-semibold text-gray-800">{gridTitle}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Columns Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200">
                <AppIcon name="Columns" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {columnDefs.map((col) => {
                const field = col.field || col.colId;
                if (!field) return null;
                return (
                  <DropdownMenuItem
                    key={field}
                    className="flex justify-between gap-4"
                    onClick={() => toggleColumnVisibility(field)}
                  >
                    {col.headerName || field}
                    <Switch size="sm" checked={visibleColumns.includes(field)} />
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownSelect
            items={Density}
            triggerIcon="Grid2x2"
          //  onSelect={setSizeMode}
          />

          <DropdownSelect
            items={DownloadTypes}
            triggerIcon="Download"
            onSelect={exportFile}
          />

          {/* Reload Button */}
          <Button className="border-gray-200" variant="outline" onClick={handleReload}>
            <AppIcon name="RefreshCw" size={18} />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div
        className={`${theme}`}
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColumnDef}
          rowSelection={enableRowSelection}
          gridOptions={gridOpts}
        />
      </div>
    </div>
  );
};

export default DataGrid;
