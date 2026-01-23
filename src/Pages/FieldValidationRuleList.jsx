import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../Library/use-toast";

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
   VALIDATION PARAMETERS CELL (PURE)
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

  const { data = [], isLoading, error } = useSelector(
    (state) => state.FormBuilderStore.FieldValidationRule || {}
  );

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(GetAllFieldValidationRules());
  }, [dispatch]);

  /* ================= ERROR ================= */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "danger",
      });
    }
  }, [error, toast]);

  /* ================= ACTIONS ================= */
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

  const renderActionCell = useCallback(
    (row) => (
      <div className="flex items-center justify-center gap-3 h-full pl-2">
        <Button
          variant="ghost"
          size="icon"
         // className="text-amber-600"       // 👈 icon-only size
          onClick={() => handleEdit(row.Id)}
        >
          <AppIcon name="Edit" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          //className="text-red-600"
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
      /* ===== SELECTION (CHECKBOX) COLUMN ===== */
      // {
      //   colId: "__select__",
      //   headerName: "",
      //   width: 48,
      //   minWidth: 48,
      //   maxWidth: 48,
      //   checkboxSelection: true,
      //   headerCheckboxSelection: true,
      //   pinned: "left",
      //   lockPosition: true,

      //   sortable: false,
      //   filter: false,
      //   resizable: false,
      //   suppressMenu: true,

      //   suppressColumnsToolPanel: true,
      //   suppressExport: true,
      // },
       {
        colId: "SLNO",
        headerName: "#",
        pinned: "left",
        minWidth: 40,
        maxWidth: 40,
        valueGetter: (params) => params.node.rowIndex + 1,
        cellClass: "text-center font-medium",
        sortable: false,
        filter: false,
        suppressMenu: true,
      },

      {
        field: "RuleCode",
        colId: "RuleCode",
        headerName: "Rule Code",
        pinned: "left",
        flex:1
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
        tooltipField: "ValidationParameters",

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
          Categories.find(
            (c) => c.value === Number(p.value)
          )?.label ?? p.value,
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

      /* ===== ACTIONS COLUMN ===== */
      {
        colId: "__actions__",
        headerName: "Actions",
        pinned: "right",
        width: 90,
        minWidth: 90,
        maxWidth: 90,
        cellRenderer: (p) => renderActionCell(p.data),
        // sortable: false,
        // filter: false,
        // suppressMenu: true,
        // suppressColumnsToolPanel: true,
        // suppressExport: true,
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
        <Button
          variant="primary"
          className="text-white"
          icon={<AppIcon name="Plus" />}
          onClick={handleCreateNew}
        >
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
        paginationPageSizeSelector={[5, 10, 20, 50]}
        
      />
    </div>
  );
};

export default FieldValidationRuleList;

/* =====================================================
   NOTE FOR FUTURE YOU
-----------------------------------------------------
- Checkbox column MUST be fixed width (48px)
- Never make checkbox flexible
- Always suppress export & column tools
- cellRenderer = UI only
- valueFormatter = export / clipboard truth
===================================================== */
