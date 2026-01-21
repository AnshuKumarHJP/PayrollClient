import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../Lib/use-toast";

import {
  GetAllFieldValidationRules,
  DeleteFieldValidationRuleById,
} from "../Store/FormBuilder/Action";

import DataGrid from "../Library/Table/DataGrid";
import Loading from "../Component/Loading";
import Button from "../Library/Button";
import AppIcon from "../Component/AppIcon";
import { Badge } from "../Library/Badge";

import { ValidationTypes, Categories } from "../Data/StaticData";
import { ActiveBadge, SeverityBadge } from "../Component/HealperComponents";
import { SweetConfirm } from "../Component/SweetAlert";

/* =====================================================
   VALIDATION PARAMETERS CELL (PURE + SAFE)
===================================================== */
const ValidationParamsCell = React.memo(({ value }) => {
  if (!value) return <span className="text-gray-400">—</span>;

  let params = value;

  if (typeof value === "string") {
    try {
      params = JSON.parse(value);
    } catch {
      return <span className="text-gray-400">Invalid</span>;
    }
  }

  if (!Array.isArray(params) || params.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {params.map((p, i) => (
        <Badge key={i} size="sm" variant="success">
          {p.ParamName} : {p.ParamValue}
        </Badge>
      ))}
    </div>
  );
});

/* =====================================================
   MAIN COMPONENT
===================================================== */
const FieldValidationRuleList = ({ onAddEditMode }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    data = [],
    isLoading,
    error,
  } = useSelector(
    (state) => state.FormBuilderStore.FieldValidationRule || {}
  );

  /* ================= FETCH ON MOUNT ================= */
  useEffect(() => {
    dispatch(GetAllFieldValidationRules());
  }, [dispatch]);

  /* ================= ERROR HANDLING ================= */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  /* ================= ACTION HANDLERS ================= */
  const handleCreateNew = useCallback(() => {
    onAddEditMode?.(true, { type: "add" });
  }, [onAddEditMode]);

  const handleEdit = useCallback(
    (id) => onAddEditMode?.(true, { id, type: "edit" }),
    [onAddEditMode]
  );

  const handleDelete = useCallback(
    (id) => {
      SweetConfirm({
        title: "Delete Field Validation Rule",
        text: "Are you sure you want to delete this rule?",
        onConfirm: async () => {
          await dispatch(DeleteFieldValidationRuleById(id));
          dispatch(GetAllFieldValidationRules());
        },
      });
    },
    [dispatch]
  );

  /* ================= ACTION CELL ================= */
  const renderActionCell = useCallback(
    (row) => (
      <div className="flex gap-2">
        <Button
          variant="warning"
          size="sm"
          onClick={() => handleEdit(row.Id)}
        >
          <AppIcon name="Edit" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.Id)}
        >
          <AppIcon name="Trash" />
        </Button>
      </div>
    ),
    [handleEdit, handleDelete]
  );

  /* ================= COLUMN DEFINITIONS ================= */
  const columnDefs = useMemo(
    () => [
      {
        headerName: "",
        width: 20,                        // compact & clean
        checkboxSelection: true,          // row checkbox
        headerCheckboxSelection: true,    // select-all checkbox
        pinned: "left",                   // always visible
        suppressMenu: true,               // no column menu
        sortable: false,                  // checkbox column should not sort
        filter: false,                    // checkbox column should not filter
        resizable: false,                 // fixed width = stable layout
        lockPosition: true,               // prevent drag
      },
      {
        field: "RuleCode",
        colId: "RuleCode",
        headerName: "Rule Code",
        pinned: "left",
        minWidth: 140,
      },
      {
        field: "RuleName",
        colId: "RuleName",
        headerName: "Rule Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "RuleDescription",
        colId: "RuleDescription",
        headerName: "Description",
        minWidth: 220,
        tooltipField: "RuleDescription",
      },
      {
        field: "ValidationParameters",
        colId: "ValidationParameters",
        headerName: "Validation Parameters",
        minWidth: 240,
        cellRenderer: ValidationParamsCell,
        valueFormatter: (p) =>
          p.value ? JSON.stringify(p.value) : "-",
      },
      {
        field: "TargetEntity",
        colId: "TargetEntity",
        headerName: "Target Entity",
        minWidth: 160,
      },
      {
        field: "TargetField",
        colId: "TargetField",
        headerName: "Target Field",
        minWidth: 160,
      },
      {
        field: "ValidationType",
        colId: "ValidationType",
        headerName: "Validation Type",
        minWidth: 160,
        valueFormatter: (p) =>
          ValidationTypes.find(
            (t) => t.value === Number(p.value)
          )?.label ?? p.value,
      },
      {
        field: "Severity",
        colId: "Severity",
        headerName: "Severity",
        minWidth: 120,
        cellRenderer: SeverityBadge,
        valueFormatter: (p) => String(p.value ?? "-"),
      },
      {
        field: "Category",
        colId: "Category",
        headerName: "Category",
        minWidth: 150,
        valueFormatter: (p) =>
          Categories.find((c) => c.value === Number(p.value))?.label ?? p.value,
      },
      {
        field: "IsActive",
        colId: "IsActive",
        headerName: "Status",
        minWidth: 120,
        cellRenderer: ActiveBadge,
        valueFormatter: (p) =>
          p.value ? "Active" : "Inactive",
      },
      {
        field: "DisplayOrder",
        colId: "DisplayOrder",
        headerName: "Display Order",
        type: "number",
        minWidth: 120,
        sort: "asc",
      },
      {
        // colId: "Actions",
        headerName: "Actions",
        pinned: "right",
        minWidth: 50,
        cellRenderer: (p) => renderActionCell(p.data),
        sortable: false,
        filter: false,
        suppressMenu: true,
        suppressColumnsToolPanel: true,
        suppressExport: true,
      },
    ],
    [renderActionCell]
  );

  const tableData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button variant="default"
          className="flex"
          onClick={handleCreateNew}>
          <AppIcon name="Plus" />
          Add New Field Validation Rule
        </Button>
      </div>

      <DataGrid
        rowData={tableData}
        columnDefs={columnDefs}
        height={500}
        gridIcon="ShieldCheck"
        gridTitle="Field Validation Rules"
        enableRowSelection="multiple"
        pagination
        paginationPageSize={10}
      />
    </div>
  );
};

export default FieldValidationRuleList;
