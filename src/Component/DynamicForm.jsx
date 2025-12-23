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

import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.22 } },
};

const groupFields = (fields = []) => {
  const grouped = {};
  for (const f of fields) {
    const key = f.group || "General";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  }
  return grouped;
};

const flattenEditData = (obj, out = {}) => {
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenEditData(v, out);
    } else {
      out[k] = v;
    }
  });
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
  const [forms, setForms] = useState([]);
  const [errorsArr, setErrorsArr] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  const [status, setStatus] = useState({
    loading: true,
    submitting: false,
    apiSuccess: null,
    error: null,
  });

  // ⭐ Load ruleTypes dynamically + validate()
  const { validate: validateForm, loading: rulesLoading } =
    useValidationRules(template);

  /* --------------------------------------------------
     LOAD TEMPLATE & PRE-FILL VALUES
  -------------------------------------------------- */
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setStatus((s) => ({ ...s, loading: true }));

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

        const fields = t.fields?.filter(
          (f) => Array.isArray(f.applicable) && f.applicable.includes("form")
        ) || [];

        const makeDefaults = () => {
          const d = {};
          fields.forEach((f) => {
            d[f.name] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
          });
          return d;
        };

        let newForms = [];
        let newErrors = [];

        if (editData) {
          if (Array.isArray(editData)) {
            newForms = editData.map((rec) => {
              const base = makeDefaults();
              const flat = flattenEditData(rec);
              fields.forEach((f) => {
                if (flat[f.name] !== undefined) base[f.name] = flat[f.name];
              });
              return base;
            });
            newErrors = newForms.map(() => ({}));
          } else {
            const base = makeDefaults();
            const flat = flattenEditData(editData);
            fields.forEach((f) => {
              if (flat[f.name] !== undefined) base[f.name] = flat[f.name];
            });
            newForms = [base];
            newErrors = [{}];
          }
        } else {
          newForms = [makeDefaults()];
          newErrors = [{}];
        }

        setForms(newForms);
        setErrorsArr(newErrors);
      } catch (err) {
        setStatus((s) => ({ ...s, error: err.message }));
      } finally {
        if (alive) setStatus((s) => ({ ...s, loading: false }));
      }
    };

    load();
    return () => (alive = false);
  }, [templateId]);

  const filteredFields = useMemo(() => {
    return (
      template?.fields?.filter(
        (f) => Array.isArray(f.applicable) && f.applicable.includes("form")
      ) || []
    );
  }, [template]);

  const groups = useMemo(() => groupFields(filteredFields), [filteredFields]);

  /* --------------------------------------------------
     HANDLE CHANGE
  -------------------------------------------------- */
  const handleValue = (i, fieldName, value) => {
    setForms((old) => {
      const copy = [...old];
      copy[i] = { ...copy[i], [fieldName]: value };
      return copy;
    });

    const formCopy = { ...forms[i], [fieldName]: value };
    const result = validateForm(formCopy);

    setErrorsArr((old) => {
      const c = [...old];
      c[i] = { ...c[i], [fieldName]: result.errors[fieldName] || null };
      return c;
    });
  };

  /* --------------------------------------------------
     ADD / REMOVE FORM
  -------------------------------------------------- */
  const addMore = () => {
    const d = {};
    filteredFields.forEach((f) => {
      d[f.name] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    });
    setForms((p) => [...p, d]);
    setErrorsArr((p) => [...p, {}]);
  };

  const removeForm = (i) => {
    setForms((p) => p.filter((_, x) => x !== i));
    setErrorsArr((p) => p.filter((_, x) => x !== i));
  };

  /* --------------------------------------------------
     FULL VALIDATION BEFORE SUBMIT
  -------------------------------------------------- */
  const validateAll = () => {
    let ok = true;
    const collected = [];

    forms.forEach((f) => {
      const r = validateForm(f);
      collected.push(r.errors || {});
      if (!r.valid) ok = false;
    });

    setErrorsArr(collected);
    return ok;
  };

  /* --------------------------------------------------
     BUILD PAYLOAD (grouped or flat)
  -------------------------------------------------- */
  const buildPayload = () => {
    if (!GroupData) return forms;

    return forms.map((form) => {
      const grouped = {};
      for (const [gName, flds] of Object.entries(groups)) {
        const key = flds[0]?.groupBackendKey || gName.replace(/\s+/g, "");
        grouped[key] = {};
        flds.forEach((f) => {
          grouped[key][f.name] = form[f.name];
        });
      }
      return grouped;
    });
  };

  /* --------------------------------------------------
     SUBMIT HANDLER
  -------------------------------------------------- */
  const handleSubmit = async (e) => {
    e?.preventDefault();

    setStatus((s) => ({ ...s, submitting: true }));

    if (!validateAll()) {
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: false }));
      return;
    }

    const payload = buildPayload();
    const final = payload.length === 1 && editId ? payload[0] : payload;

    try {
      const res = await onSuccess({
        isEdit: !!editId,
        recordId: editId,
        data: final,
      });
      setStatus((s) => ({
        ...s,
        submitting: false,
        apiSuccess: !!res,
      }));
    } catch {
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: false }));
    }
  };

  /* --------------------------------------------------
     RENDER FIELD
  -------------------------------------------------- */
  const renderField = (i, field) => {
    const val = forms[i]?.[field.name];
    const err = errorsArr[i]?.[field.name];

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
        {FormInputTypes(config, val, (v) => handleValue(i, field.name, v), !!err)}
        {err && <p className="text-red-600 text-xs mt-1">{err}</p>}
      </div>
    );
  };

  /* --------------------------------------------------
     LOADING / ERROR STATES
  -------------------------------------------------- */
  if (status.loading || rulesLoading) return <Loading />;

  if (status.error)
    return (
      <Alert className="border-red-500 m-4">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{status.error}</AlertDescription>
      </Alert>
    );

  /* --------------------------------------------------
     MAIN UI
  -------------------------------------------------- */
  return (
    <motion.div className="p-2" variants={fadeIn} initial="hidden" animate="show">
      <div className="md:flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {template?.icon && <AppIcon name={template.icon} size={26} />}
          <h1 className="text-xl font-bold">{template?.name}</h1>
        </div>

        <div className="flex gap-3">
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

      <AnimatePresence>
        {status.apiSuccess === true && (
          <motion.div variants={scaleIn} initial="hidden" animate="show" exit="hidden">
            <Alert className="border-green-500 mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Saved successfully!</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {status.apiSuccess === false && (
          <motion.div variants={scaleIn} initial="hidden" animate="show" exit="hidden">
            <Alert className="border-red-500 mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Submission failed. Check errors.</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <AnimatePresence>
          {forms.map((_, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8 }}
            >
              <Card className="p-4 mb-4 border border-emerald-200">
                {AddMore && forms.length > 1 && (
                  <div className="flex justify-between mb-4">
                    <div className="text-sm font-semibold">Entry #{i + 1}</div>
                    <Button variant="destructive" size="sm" onClick={() => removeForm(i)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* GROUPED VIEW */}
                {isGrouped ? (
                  <Tabs defaultValue={Object.keys(groups)[0]} className="w-full">
                    <TabsList
                      className="w-full grid bg-emerald-100/40 border p-0"
                      style={{
                        gridTemplateColumns: `repeat(${Object.keys(groups).length}, 1fr)`,
                      }}
                    >
                      {Object.keys(groups).map((g) => (
                        <TabsTrigger
                          key={g}
                          value={g}
                          className="text-sm font-medium text-emerald-700
                          data-[state=active]:bg-emerald-300 data-[state=active]:text-emerald-900"
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
                              {renderField(i, f)}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  /* FLAT VIEW */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFields.map((f) => (
                      <div key={f.name}>
                        <Label>{f.label}</Label>
                        {renderField(i, f)}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
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
    </motion.div>
  );
};

export default DynamicForm;
