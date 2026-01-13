/* =====================================================
   FieldValidationRuleForm
   ✔ Single form for ADD + UPDATE
   ✔ Id present → UPDATE
   ✔ Id null / undefined → ADD
   ✔ Uses GET_ALL data for edit
===================================================== */

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "../Lib/input";
import { Button } from "../Lib/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../Lib/select";
import { Textarea } from "../Lib/textarea";
import { Switch } from "../Lib/switch";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Label } from "../Lib/label";
import { useToast } from "../Lib/use-toast";

import {
  UpsertFieldValidationRule,
  GetAllFieldValidationRules
} from "../Store/FormBuilder/Action";

import { Categories, Severities, ValidationTypes } from "../Data/StaticData";
import AppIcon from "../Component/AppIcon";
import { SweetSuccess } from "../Component/SweetAlert";

/* =====================================================
   DEFAULT FORM
===================================================== */
const defaultForm = {
  Id: null,
  RuleCode: "",
  RuleName: "",
  RuleDescription: "",
  TargetEntity: "",
  TargetField: "",
  ValidationType: 0,
  Severity: 0,
  Category: 0,
  DisplayOrder: 1,
  IsActive: true,
  ValidationParameters: [{ ParamName: "", ParamValue: "" }]
};

const FieldValidationRuleForm = ({ id, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { data = [], isLoading } = useSelector(
    (state) => state.FormBuilderStore.FieldValidationRule || {}
  );

  const [form, setForm] = useState(defaultForm);

  /* =====================================================
     LOAD DATA FOR EDIT (Id PRESENT)
  ===================================================== */
  useEffect(() => {
    if (!id) {
      setForm(defaultForm);
      return;
    }

    const rule = data.find((r) => r.Id === id);
    if (!rule) return;

    let params = [];
    try {
      params = Array.isArray(rule.ValidationParameters)
        ? rule.ValidationParameters
        : JSON.parse(rule.ValidationParameters || "[]");
    } catch {
      params = [];
    }

    setForm({
      Id: rule.Id ?? null,
      RuleCode: rule.RuleCode ?? "",
      RuleName: rule.RuleName ?? "",
      RuleDescription: rule.RuleDescription ?? "",
      TargetEntity: rule.TargetEntity ?? "",
      TargetField: rule.TargetField ?? "",
      ValidationType: Number(rule.ValidationType) || 0,
      Severity: Number(rule.Severity) || 0,
      Category: Number(rule.Category) || 0,
      DisplayOrder: Number(rule.DisplayOrder) || 1,
      IsActive: rule.IsActive ?? true,
      ValidationParameters:
        params.length > 0 ? params : [{ ParamName: "", ParamValue: "" }]
    });
  }, [id, data]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  const addParam = useCallback(() => {
    setForm((p) => ({
      ...p,
      ValidationParameters: [
        ...p.ValidationParameters,
        { ParamName: "", ParamValue: "" }
      ]
    }));
  }, []);

  const updateParam = useCallback((i, key, value) => {
    setForm((p) => {
      const list = [...p.ValidationParameters];
      list[i] = { ...list[i], [key]: value };
      return { ...p, ValidationParameters: list };
    });
  }, []);

  const removeParam = useCallback((i) => {
    setForm((p) => ({
      ...p,
      ValidationParameters: p.ValidationParameters.filter((_, idx) => idx !== i)
    }));
  }, []);

  /* =====================================================
     VALIDATION
  ===================================================== */
  const errors = useMemo(() => {
    const e = [];
    if (!form.RuleCode.trim()) e.push("Rule Code is required");
    if (!form.RuleName.trim()) e.push("Rule Name is required");
    if (!form.TargetEntity.trim()) e.push("Target Entity is required");
    if (!form.TargetField.trim()) e.push("Target Field is required");

    form.ValidationParameters.forEach((p, i) => {
      if (!p.ParamName.trim() || !p.ParamValue.trim()) {
        e.push(`Validation parameter ${i + 1} is incomplete`);
      }
    });

    // Check for duplicate parameter names
    const paramNames = form.ValidationParameters.map(p => p.ParamName.trim()).filter(name => name);
    const duplicateNames = paramNames.filter((name, index) => paramNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      e.push(`Duplicate parameter names found: ${duplicateNames.join(", ")}`);
    }

    return e;
  }, [form]);

  /* =====================================================
     SUBMIT (UPSERT)
  ===================================================== */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (errors.length) {
        toast({
          title: "Validation Error",
          description: errors.join(", "),
          variant: "destructive"
        });
        return;
      }

      try {
        const payload = {
          ...form,
          Id: form.Id || 0 // Use 0 for new records instead of null
        };

        const res = await dispatch(UpsertFieldValidationRule(payload));

        if (res?.Status) {
          dispatch(GetAllFieldValidationRules());
          SweetSuccess({
            title: form.Id ? "Updated" : "Created",
            text: `Field validation rule ${form.Id ? "updated" : "created"} successfully.`,
          });
          onSave?.(res);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Save failed",
          variant: "destructive"
        });
      }
    },
    [form, errors, dispatch, toast, onSave]
  );

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden ">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b bg-gradient-to-r from-emerald-400 to-green-400">
        <h2 className="text-sm sm:text-xl font-semibold text-white flex items-center gap-2">
          <AppIcon name={"BookOpenCheck"} size={30} />  Field Validation Rule
        </h2>
        <p className="text-green-100 text-xs sm:text-sm">
          Create and manage validation rules dynamically
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-2 md:p-4">

        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>
              {form.Id ? "Edit Validation Rule" : "Create Validation Rule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Rule Code</Label>
              <Input
                name="RuleCode"
                placeholder="Enter rule code"
                value={form.RuleCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Rule Name</Label>
              <Input
                name="RuleName"
                placeholder="Enter rule name"
                value={form.RuleName}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                name="RuleDescription"
                placeholder="Enter rule description"
                value={form.RuleDescription}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* TARGET */}
        <Card>
          <CardHeader>
            <CardTitle>Target Mapping</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Target Entity</Label>
              <Input
                name="TargetEntity"
                placeholder="Target Entity"
                value={form.TargetEntity}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Target Field</Label>
              <Input
                name="TargetField"
                placeholder="Target Field"
                value={form.TargetField}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* SETTINGS */}
        <Card>
          <CardHeader>
            <CardTitle>Rule Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Validation Types</Label>
              <Select
                value={String(form.ValidationType)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, ValidationType: Number(v) }))
                }
              >
                <SelectTrigger><SelectValue placeholder="Validation Type" /></SelectTrigger>
                <SelectContent>
                  {ValidationTypes.map((v) => (
                    <SelectItem key={v.value} value={String(v.value)}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Severities</Label>

              <Select
                value={String(form.Severity)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, Severity: Number(v) }))
                }
              >
                <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  {Severities.map((s) => (
                    <SelectItem key={s.value} value={String(s.value)}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categories</Label>
              <Select
                value={String(form.Category)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, Category: Number(v) }))
                }
              >
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {Categories.map((c) => (
                    <SelectItem key={c.value} value={String(c.value)}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                min={1}
                value={form.DisplayOrder}
                onChange={(e) =>
                  setForm((p) => ({ ...p, DisplayOrder: Number(e.target.value) }))
                }
              />
            </div>
          </CardContent>

          <CardContent className="flex items-center gap-2">
            <Switch
              checked={form.IsActive}
              onCheckedChange={(v) =>
                setForm((p) => ({ ...p, IsActive: v }))
              }
            />
            <Label>Active</Label>
          </CardContent>
        </Card>

        {/* PARAMETERS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Validation Parameters</CardTitle>
              <Button type="button" variant="outline" onClick={addParam}>
                + Add
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {form.ValidationParameters.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end border rounded-lg p-3"
              >
                {/* PARAM NAME */}
                <div className="md:col-span-2">
                  <Label>Param Name</Label>
                  <Input
                    placeholder="Param Name"
                    value={p.ParamName}
                    onChange={(e) => updateParam(i, "ParamName", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* PARAM VALUE */}
                <div className="md:col-span-3">
                  <Label>Param Value</Label>
                  <Input
                    placeholder="eg: ^[a-zA-Z0-9]+$"
                    value={p.ParamValue}
                    onChange={(e) => updateParam(i, "ParamValue", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* REMOVE BUTTON */}
                <div className="md:col-span-1 flex md:justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full md:w-auto flex items-center gap-2"
                    onClick={() => removeParam(i)}
                  >
                    <AppIcon name="Trash" />
                    <span className="md:hidden">Remove</span>
                  </Button>
                </div>
              </div>

            ))}
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : (form.Id ? "Update Rule" : "Create Rule")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FieldValidationRuleForm;
