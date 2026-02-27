import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../Library/use-toast";

import {
  GetAllFieldValidationRules,
  DeleteFieldValidationRuleById,
} from "../../Store/FormBuilder/Action";

import Loading from "../../Component/Loading";
import Button from "../../Library/Button";
import AppIcon from "../../Component/AppIcon";
import { Badge } from "../../Library/Badge";
import AdvanceTable from "../../Library/Table/AdvanceTable";

import { ValidationTypes, Categories } from "../../Data/StaticData";
import { ActiveBadge, SeverityBadge } from "../../Component/HealperComponents";
import { SweetConfirm } from "../../Component/SweetAlert";
import { useNavigate } from "react-router-dom";
import CryptoService from "../../Security/useCrypto";

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
const FieldValidationRuleList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    navigate("/fieldValidationRule/add");
  }, [navigate]);

  const handleEdit = useCallback(
    (id) => {
      const encryptedId = CryptoService.encrypt(id.toString());
      navigate(`/fieldValidationRule/edit/${encryptedId}`);
    },
    [navigate]
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
          variant="warning"
          size="xs"
          onClick={() => handleEdit(row.Id)}
          icon={<AppIcon name="Edit" />}
        >

        </Button>

        <Button
          variant="danger"
          size="xs"
          onClick={() => handleDelete(row.Id)}
          icon={<AppIcon name="Trash" />}
        >

        </Button>
      </div>
    ),
    [handleEdit, handleDelete]
  );

  // * ---------------- COLUMNS (STATIC) ---------------- */
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


  const tableData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6 space-y-3 md:space-y-0 text-slate-800 dark:text-white">
        {/* LEFT: TITLE + DESCRIPTION */}
        <div>
          <div className="flex items-center gap-2">
            <AppIcon name="ShieldCheck" size={22} className="text-primary" />
            <h1 className="text-base md:text-xl font-semibold">
              Field Validation Rules
            </h1>
          </div>

          <p className="mt-1 text-xs md:text-sm text-muted-foreground max-w-xl">
            Define and manage validation logic to ensure data accuracy, consistency,
            and compliance across forms and bulk uploads.
          </p>
        </div>

        {/* RIGHT: ACTION */}
        <Button
          onClick={handleCreateNew}
          icon={<AppIcon name="Plus" size={16} />}
          className="w-full md:w-auto"
          size="sm"
        >
          Create New Rule
        </Button>
      </div>

      <AdvanceTable
        // title="Field Validation Rules"
        // icon="ShieldCheck"
        columns={columns}
        data={tableData}
        renderActions={renderActionCell}
        isLoading={isLoading}
        showIndex={true}
      />
    </div>
  );
};

export default FieldValidationRuleList;
