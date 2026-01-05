import React, { useState, useCallback } from "react";
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
import { UpsertFieldValidationRule } from "../Store/FormBuilder/Action";
import CryptoService from "../Security/useCrypto";

const ValidationTypes = ["LENGTH", "REGEX", "RANGE", "CUSTOM"];
const severities = ["HIGH", "MEDIUM", "LOW"];
const categories = ["IDENTITY", "FINANCIAL", "CONTACT"];

const FieldValidationRuleForm = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    RuleCode: "",
    RuleName: "",
    RuleDescription: "",
    TargetEntity: "",
    TargetField: "",
    ValidationType: "LENGTH",
    Severity: "HIGH",
    Category: "IDENTITY",
    DisplayOrder: 1,
    IsActive: true,
    ValidationParameters: []
  });

  /* -------------------- handlers -------------------- */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const addParam = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      ValidationParameters: [
        ...prev.ValidationParameters,
        { paramName: "", paramValue: "" }
      ]
    }));
  }, []);

  const updateParam = useCallback((index, field, value) => {
    setForm((prev) => {
      const params = [...prev.ValidationParameters];
      params[index] = { ...params[index], [field]: value };
      return { ...prev, ValidationParameters: params };
    });
  }, []);

  const removeParam = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      ValidationParameters: prev.ValidationParameters.filter(
        (_, i) => i !== index
      )
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = [];
    if (!form.RuleCode.trim()) errors.push("Rule Code is required");
    if (!form.RuleName.trim()) errors.push("Rule Name is required");
    if (!form.TargetEntity.trim()) errors.push("Target Entity is required");
    if (!form.TargetField.trim()) errors.push("Target Field is required");

    if (form?.ValidationParameters?.length === 0) {
      errors.push("At least one validation parameter is required");
    } else {
      form?.ValidationParameters?.forEach((p, i) => {
        if (!p.paramName.trim() || !p.paramValue.trim()) {
          errors.push(`Parameter ${i + 1} is incomplete`);
        }
      });
    }
    return errors;
  }, [form]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errs = validateForm();
      if (errs?.length) {
        toast({
          title: "Validation Error",
          description: errs.join(", "),
          variant: "destructive",
        });
        return;
      }
      // 🔐 Encrypt FULL object
      const encryptedPayload = CryptoService.encrypt(form);
      try {
        // ⏳ save
        const result = await dispatch(UpsertFieldValidationRule(encryptedPayload));
        // 🔄 refresh list ONLY IF SUCCESS
        if (result?.Status === true) {
          console.log("Call Get All");
        }

      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to save field validation rule - ${error.message}`,
          variant: "destructive",
        });
        console.error("Save failed:", error);
      }
    },
    [form, validateForm, toast, dispatch]
  );


  /* -------------------- render -------------------- */
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden ">

        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b bg-gradient-to-r from-green-600 to-emerald-600">
          <h2 className="text-sm sm:text-xl font-semibold text-white">
            Field Validation Rule
          </h2>
          <p className="text-green-100 text-xs sm:text-sm">
            Create and manage validation rules dynamically
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-1 md:p-2 space-y-6">

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Code</Label>
                  <Input
                    name="RuleCode"
                    placeholder="Enter unique rule code"
                    value={form.RuleCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rule Name</Label>
                  <Input
                    name="RuleName"
                    placeholder="Enter human-readable rule name"
                    value={form.RuleName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="RuleDescription"
                  placeholder="Describe the validation rule purpose and behavior"
                  value={form.RuleDescription}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Target */}
          <Card>
            <CardHeader>
              <CardTitle>Target Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Entity</Label>
                  <Input
                    name="TargetEntity"
                    placeholder="e.g., Customer, User, KYC"
                    value={form.TargetEntity}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Field</Label>
                  <Input
                    name="TargetField"
                    placeholder="e.g., firstName, email, phoneNumber"
                    value={form.TargetField}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Rule Settings</CardTitle>
            </CardHeader>
            <CardContent>

              {/* 👇 FIXED DISPLAY ORDER POSITION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                <div className="space-y-2">
                  <Label>Validation Type</Label>
                  <Select
                    value={form.ValidationType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, ValidationType: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ValidationTypes.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Severity </Label>
                  <Select
                    value={form.Severity}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, Severity: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.Category}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, Category: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ✅ CORRECT DISPLAY ORDER POSITION */}
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    min={1}
                    name="DisplayOrder"
                    placeholder="1"
                    value={form.DisplayOrder}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        DisplayOrder: Number(e.target.value)
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Switch
                  checked={form.IsActive}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, IsActive: v }))
                  }
                />
                <Label>Active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Validation Parameters</CardTitle>
              <Button type="button" variant="outline" onClick={addParam} className="w-full sm:w-auto">
                + Add
              </Button>
            </CardHeader>
            <CardContent>
              {form.ValidationParameters.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3"
                >
                  <Input
                    placeholder="Param Name"
                    value={p.paramName}
                    onChange={(e) =>
                      updateParam(i, "paramName", e.target.value)
                    }
                  />
                  <Input
                    className="sm:col-span-3"
                    placeholder="Param Value"
                    value={p.paramValue}
                    onChange={(e) =>
                      updateParam(i, "paramValue", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeParam(i)}
                    className="w-full sm:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex justify-end border-t pt-6">
            <Button type="submit">Save Rule</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldValidationRuleForm;
