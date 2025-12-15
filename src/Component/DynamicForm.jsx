// src/components/DynamicForm.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "../Lib/card";
import { Button } from "../Lib/button";
import { Label } from "../Lib/label";
import { Alert, AlertDescription } from "../Lib/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Loader2, XCircle, CheckCircle, Plus, Trash } from "lucide-react";

import AppIcon from "../Component/AppIcon";
import { templateService } from "../../api/services/templateService";
import FormInputTypes from "./FormInputTypes";
import useValidationRules from "../Hooks/useValidationRules";

/**
 * DynamicForm
 * - templateId: id or API to get template (uses templateService.getById)
 * - editId, editData: optional for edit mode
 * - onSuccess({ isEdit, recordId, data }) => should return truthy on success
 * - onCancel: callback
 * - AddMore: allow multiple entries
 * - GroupData: whether backend expects grouped payload (by groupBackendKey)
 *
 * The validate hook returns { valid: boolean, errors: {field: message} }.
 */
const groupFields = (fields = []) => {
  const grouped = {};
  for (const f of fields) {
    const g = f.group || "General";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(f);
  }
  return grouped;
};

const flattenEditData = (obj, out = {}) => {
  for (const [k, v] of Object.entries(obj || {})) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenEditData(v, out);
    } else {
      out[k] = v;
    }
  }
  return out;
};

const DynamicForm = ({
  templateId,
  editId = null,
  editData = null,
  onSuccess,
  onCancel,
  AddMore = false,
  GroupData = false,
}) => {
  const [template, setTemplate] = useState(null);
  const [forms, setForms] = useState([]); // array of flat form objects
  const [errorsArr, setErrorsArr] = useState([]); // array of { field: message }
  const [isGrouped, setIsGrouped] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    submitting: false,
    apiSuccess: null,
    error: null,
  });

  // hook loads rules for template and returns validate(formData, context) -> { valid, errors }
  const { validate: validateForm, loading: rulesLoading } =
    useValidationRules(template);

  // Load template & initialize forms
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setStatus((s) => ({ ...s, loading: true, error: null }));

        const result = await templateService.getById(templateId);
        const t =
          Array.isArray(result)
            ? result.find((x) => x.status === "active")
            : result?.status === "active"
            ? result
            : null;

        if (!t) throw new Error("No active template found.");

        if (!alive) return;
        setTemplate(t);

        const fields = (t.fields || []).filter(
          (f) => Array.isArray(f.applicable) && f.applicable.includes("form")
        );

        // create defaults object
        const makeDefaults = () => {
          const init = {};
          for (const f of fields) {
            init[f.name] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
          }
          return init;
        };

        // prefill from editData if present
        let newForms = [];
        let newErrors = [];

        if (editData) {
          if (Array.isArray(editData)) {
            newForms = editData.map((rec) => {
              const merged = makeDefaults();
              const flat = flattenEditData(rec);
              fields.forEach((f) => {
                if (flat[f.name] !== undefined) merged[f.name] = flat[f.name];
              });
              return merged;
            });
            newErrors = newForms.map(() => ({}));
          } else {
            const merged = makeDefaults();
            const flat = flattenEditData(editData);
            fields.forEach((f) => {
              if (flat[f.name] !== undefined) merged[f.name] = flat[f.name];
            });
            newForms = [merged];
            newErrors = [{}];
          }
        } else {
          newForms = [makeDefaults()];
          newErrors = [{}];
        }

        setForms(newForms);
        setErrorsArr(newErrors);
      } catch (err) {
        console.error(err);
        setStatus((s) => ({ ...s, error: err.message }));
      } finally {
        if (alive) setStatus((s) => ({ ...s, loading: false }));
      }
    };

    load();
    return () => (alive = false);
  }, [templateId, editId, editData]);

  // derived lists
  const filteredFields = useMemo(() => {
    return template?.fields?.filter(
      (f) => Array.isArray(f.applicable) && f.applicable.includes("form")
    ) || [];
  }, [template]);

  const groups = useMemo(() => groupFields(filteredFields), [filteredFields]);

  // handle per-field change with real-time validation for that field
  const handleValue = (index, fieldName, value) => {
    // update forms state
    setForms((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[index] = { ...copy[index], [fieldName]: value };
      return copy;
    });

    // run validation for whole form but only pick field error (engine returns object)
    const updated = { ...(forms[index] || {}), [fieldName]: value };
    const res = validateForm(updated, { template });

    setErrorsArr((prev) => {
      const copy = prev.map((p) => ({ ...p }));
      copy[index] = { ...copy[index], [fieldName]: res.errors[fieldName] || null };
      return copy;
    });
  };

  // add / remove
  const addMore = () => {
    const init = {};
    filteredFields.forEach((f) => {
      init[f.name] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    });
    setForms((p) => [...p, init]);
    setErrorsArr((p) => [...p, {}]);
  };

  const removeForm = (i) => {
    setForms((p) => p.filter((_, idx) => idx !== i));
    setErrorsArr((p) => p.filter((_, idx) => idx !== i));
  };

  // validate all forms (returns true/false and sets errorsArr)
  const validateAll = () => {
    const allErrors = [];
    let ok = true;

    for (let i = 0; i < forms.length; i++) {
      // provide context with existingRecords if needed (caller can extend)
      const res = validateForm(forms[i], {});
      allErrors[i] = res.errors || {};
      if (!res.valid) ok = false;
    }

    setErrorsArr(allErrors);
    return ok;
  };

  // build payload (grouped if GroupData true)
  const buildPayload = () => {
    if (!GroupData) return forms.map((f) => ({ ...f }));

    return forms.map((form) => {
      const grouped = {};
      for (const [gName, flds] of Object.entries(groups)) {
        const backendKey = flds[0]?.groupBackendKey || gName.replace(/\s+/g, "");
        grouped[backendKey] = {};
        for (const fld of flds) {
          grouped[backendKey][fld.name] = form[fld.name];
        }
      }
      return grouped;
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setStatus((s) => ({ ...s, submitting: true, apiSuccess: null }));

    const ok = validateAll();
    if (!ok) {
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: false }));
      return;
    }

    const payload = buildPayload();
    const finalData = payload.length === 1 && editId ? payload[0] : payload;

    try {
      const result = await onSuccess({
        isEdit: !!editId,
        recordId: editId,
        data: finalData,
      });

      // result should be truthy if success
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: !!result }));
    } catch (err) {
      console.error("onSuccess threw:", err);
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: false }));
    }
  };

  const renderField = (idx, field) => {
    const value = forms[idx]?.[field.name];
    const err = errorsArr[idx]?.[field.name];

    const config = {
      InputType: field.type,
      DataType: field.type,
      FormFieldName: field.label,
      Options: field.options ?? [],
      DefaultDisable: field.disabled ?? false,
      Accept: field.accept,
    };

    return (
      <div>
        {FormInputTypes(config, value, (val) => handleValue(idx, field.name, val), !!err)}
        {err && <p className="text-red-600 text-xs mt-1">{err}</p>}
      </div>
    );
  };

  // UI states
  if (status.loading || rulesLoading)
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (status.error)
    return (
      <Alert className="border-red-500 m-4">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{status.error}</AlertDescription>
      </Alert>
    );

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {template?.icon && <AppIcon name={template.icon} size={26} />}
          <h1 className="text-xl font-bold">{template?.name || "Form"}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="success" onClick={() => setIsGrouped((p) => !p)}>
            {isGrouped ? "Ungroup" : "Group"}
          </Button>

          {AddMore && (
            <Button variant="outline" onClick={addMore}>
              <Plus className="mr-2 h-4 w-4" /> Add More
            </Button>
          )}
        </div>
      </div>

      {status.apiSuccess === true && (
        <Alert className="border-green-500 mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Saved successfully!</AlertDescription>
        </Alert>
      )}

      {status.apiSuccess === false && (
        <Alert className="border-red-500 mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>Submission failed. Please check errors.</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {forms.map((_, idx) => (
          <Card
            key={idx}
            className="p-4 mb-4 border border-emerald-200 rounded-md"
          >
            {AddMore && forms.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Entry #{idx + 1}</div>
                <Button variant="destructive" size="sm" onClick={() => removeForm(idx)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isGrouped ? (
              <Tabs defaultValue={Object.keys(groups)[0]} className="w-full">
                <TabsList
                  className="w-full grid bg-emerald-100/40 border border-emerald-200 p-0"
                  style={{
                    gridTemplateColumns: `repeat(${Object.keys(groups).length}, 1fr)`,
                  }}
                >
                  {Object.keys(groups).map((g) => (
                    <TabsTrigger
                      key={g}
                      value={g}
                      className="text-sm font-medium text-emerald-700 data-[state=active]:bg-emerald-300 data-[state=active]:text-emerald-800"
                    >
                      {g}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(groups).map(([gName, flds]) => (
                  <TabsContent key={gName} value={gName} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {flds.map((f) => (
                        <div key={f.name}>
                          <Label>{f.label}</Label>
                          {renderField(idx, f)}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFields.map((f) => (
                  <div key={f.name}>
                    <Label>{f.label}</Label>
                    {renderField(idx, f)}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        <div className="flex justify-end gap-3 mt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={status.submitting}>
            {status.submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing…
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
