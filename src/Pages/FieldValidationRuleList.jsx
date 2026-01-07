/* =====================================================
   CLEAN & OPTIMIZED – FieldValidationRuleList
   ✔ Stable renders
   ✔ Predictable refresh (only GET_ALL)
   ✔ Memoized handlers & columns
   ✔ Uses reusable badges
===================================================== */

import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../Lib/use-toast";

import {
  GetAllFieldValidationRules,
  DeleteFieldValidationRuleById
} from "../Store/FormBuilder/Action";

import AdvanceTable from "../Component/AdvanceTable";
import Loading from "../Component/Loading";
import { Button } from "../Lib/button";
import AppIcon from "../Component/AppIcon";
import { Badge } from "../Lib/badge";

import { ValidationTypes, Categories } from "../Data/StaticData";
import { ActiveBadge, SeverityBadge } from "../Component/HealperComponents";
import { SweetConfirm } from "../Component/SweetAlert";

/* ----------------------------------------------------
   VALIDATION PARAMS CELL (PURE)
---------------------------------------------------- */
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

  if (!Array.isArray(params) || params.length === 0)
    return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {params.map((p, i) => (
        <Badge key={i} size="xs">
          {p.ParamName} : {p.ParamValue}
        </Badge>
      ))}
    </div>
  );
});

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
const FieldValidationRuleList = ({ onAddEditMode }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const {
    data = [],
    isLoading,
    error,
    Success
  } = useSelector(
    (state) => state.FormBuilderStore.FieldValidationRule || {}
  );

  /* ---------------- FETCH ON MOUNT ---------------- */
  useEffect(() => {
    dispatch(GetAllFieldValidationRules());
  }, [dispatch]);

  /* ---------------- ERROR TOAST ---------------- */
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleCreateNew = useCallback(() => {
    onAddEditMode?.(true, { type: "add" });
  }, [onAddEditMode]);

  const handleEdit = useCallback(
    (id) => {
      onAddEditMode?.(true, { id, type: "edit" });
    },
    [onAddEditMode]
  );

  const handleDelete = useCallback(
    (id) => {
      SweetConfirm({
        title: "Delete Field Validation Rule",
        text: "Are you sure you want to delete this field validation rule?",
        onConfirm: async () => {
          await dispatch(DeleteFieldValidationRuleById(id));
          dispatch(GetAllFieldValidationRules()); // explicit refresh
        }
      });
    },
    [dispatch]
  );

  /* ---------------- ACTION COLUMN ---------------- */
  const RenderAction = useCallback(
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

  /* ---------------- COLUMNS (STATIC) ---------------- */
  const columns = useMemo(
    () => [
      { key: "RuleCode", label: "Rule Code", sticky: true },
      { key: "RuleName", label: "Rule Name" },
      { key: "RuleDescription", label: "Description" },
      {
        key: "ValidationParameters",
        label: "Validation Parameters",
        width: 260,
        render: (v) => <ValidationParamsCell value={v} />
      },
      { key: "TargetEntity", label: "Target Entity" },
      { key: "TargetField", label: "Target Field" },
      {
        key: "ValidationType",
        label: "Validation Type",
        width: 100,
        render: (v) =>
          ValidationTypes.find((t) => t.value === Number(v))?.label ?? v
      },
      {
        key: "Severity",
        label: "Severity",
        width: 100,
        render: (v) => <SeverityBadge value={v} />
      },
      {
        key: "Category",
        label: "Category",
        width: 120,
        render: (v) =>
          Categories.find((c) => c.value === Number(v))?.label ?? v
      },
      {
        key: "IsActive",
        label: "Status",
        width: 100,
        render: (v) => <ActiveBadge value={v} />
      },
      {
        key: "DisplayOrder",
        label: "Display Order",
        type: "number",
        width: 120
      }
    ],
    []
  );

  /* ---------------- DATA (STABLE) ---------------- */
  const tableData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button variant="default" onClick={handleCreateNew}>
          <AppIcon name="Plus" />
          Add New Field Validation Rule
        </Button>
      </div>

      <AdvanceTable
        title="Field Validation Rules"
        icon="ShieldCheck"
        columns={columns}
        data={tableData}
        renderActions={RenderAction}
        isLoading={isLoading}
        showIndex={true}
      />
    </div>
  );
};

export default FieldValidationRuleList;
