import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "../Lib/card";
import { Button } from "../Lib/button";
import { Label } from "../Lib/label";
import { Alert, AlertDescription } from "../Lib/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Lib/tabs";
import { Loader2, XCircle, CheckCircle, Plus, Trash } from "lucide-react";

import AppIcon from "../Component/AppIcon";
import FormInputTypes from "./FormInputTypes";
import useValidationRules from "../Hooks/useValidationRules";

import { motion, AnimatePresence } from "framer-motion";
import Loading from "./Loading";

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.22 } }
};

/* -------------------------------------------------
      GROUP FIELDS EXACTLY BASED ON TEMPLATE
------------------------------------------------- */
const groupFields = (fields = []) => {
  const grouped = {};

  fields.forEach((f) => {
    const groupName = f.FieldGroup?.trim() || "General";
    if (!grouped[groupName]) grouped[groupName] = [];
    grouped[groupName].push(f);
  });

  return grouped;
};

/* -------------------------------------------------
      FLATTEN (for edit mode)
------------------------------------------------- */
const flattenEditData = (obj, out = {}) => {
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v)) flattenEditData(v, out);
    else out[k] = v;
  });
  return out;
};


const DynamicForm = ({
  Template = null,
  editId = null,
  editData = null,
  onSuccess,
  onCancel,
  AddMore = false,
  GroupData = false
}) => {

  /* ----------------------------------------------
         PARSE TEMPLATE
   ---------------------------------------------- */
  const fields = useMemo(() => {
    if (!Template?.FieldsConfigurations) return [];

    return Template.FieldsConfigurations.map((f) => {
      let applicable = [];
      let options = [];

      try {
        applicable = JSON.parse(f.ApplicableJson || "[]");
      } catch { }

      try {
        options = JSON.parse(f.OptionsJson || "[]");
      } catch { }

      return { ...f, applicable, options };
    }).filter((f) => f.applicable.includes("form"));
  }, [Template]);

  const groups = useMemo(() => groupFields(fields), [fields]);


  /* ----------------------------------------------
        MAKE DEFAULT FORM
  ---------------------------------------------- */
  const makeDefaults = useCallback(() => {
    const d = {};
    fields.forEach((f) => {
      d[f.Name] = f.DefaultValue ?? (f.Type === "checkbox" ? false : "");
    });
    return d;
  }, [fields]);

  /* ----------------------------------------------
        INITIAL FORMS
  ---------------------------------------------- */
  const [forms, setForms] = useState(() => {
    if (!fields.length) return [];

    if (editData) {
      const base = makeDefaults();
      const flat = flattenEditData(editData);
      fields.forEach((f) => {
        if (flat[f.Name] !== undefined) base[f.Name] = flat[f.Name];
      });
      return [base];
    }

    return [makeDefaults()];
  });

  const [errorsArr, setErrorsArr] = useState([{}]);

  const [isGrouped, setIsGrouped] = useState(false);

  const [status, setStatus] = useState({
    submitting: false,
    apiSuccess: null,
    error: null
  });


  const { validate, loading: rulesLoading } = useValidationRules(Template);


  /* ----------------------------------------------
        HANDLE VALUE CHANGE  — FIXED ASYNC
  ---------------------------------------------- */
  const handleValue = useCallback(
    async (i, fieldName, value) => {
      setForms((prev) => {
        const copy = [...prev];
        copy[i] = { ...copy[i], [fieldName]: value };
        return copy;
      });

      const result = await validate({
        ...forms[i],
        [fieldName]: value
      });

      setErrorsArr((prev) => {
        const copy = [...prev];
        copy[i] = {
          ...copy[i],
          [fieldName]: result.errors?.[fieldName] || null
        };
        return copy;
      });
    },
    [forms, validate]
  );

  /* ----------------------------------------------
        ADD / REMOVE FORMS
  ---------------------------------------------- */
  const addMore = () => {
    setForms((p) => [...p, makeDefaults()]);
    setErrorsArr((p) => [...p, {}]);
  };

  const removeForm = (i) => {
    setForms((p) => p.filter((_, x) => x !== i));
    setErrorsArr((p) => p.filter((_, x) => x !== i));
  };

  /* ----------------------------------------------
        VALIDATE ALL — FIXED ASYNC
  ---------------------------------------------- */
  const validateAll = async () => {
    const collectedErrors = [];
    let isValid = true;

    for (const form of forms) {
      const result = await validate(form);
      collectedErrors.push(result.errors || {});
      if (!result.valid) isValid = false;
    }

    setErrorsArr(collectedErrors);
    return isValid;
  };
  /* ----------------------------------------------
        BUILD PAYLOAD
  ---------------------------------------------- */
  const buildPayload = () => {
    if (!GroupData) return forms;

    return forms.map((form) => {
      const g = {};

      for (const [gName, flds] of Object.entries(groups)) {
        const key = flds[0].GroupBackendKey || gName.toLowerCase();
        g[key] = {};

        flds.forEach((f) => {
          g[key][f.Name] = form[f.Name];
        });
      }

      return g;
    });
  };



  /* ----------------------------------------------
        SUBMIT — FIXED ASYNC validateAll()
  ---------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus((s) => ({ ...s, submitting: true, apiSuccess: null }));

    const isValid = await validateAll();

    // 🚫 STOP HERE IF ANY ERROR EXISTS
    if (!isValid) {
      setStatus((s) => ({...s,submitting: false, apiSuccess: false}));
      return;
    }

    const payload = buildPayload();
    const final = editId && payload.length === 1 ? payload[0] : payload;

    try {
      const ok = await onSuccess({
        isEdit: !!editId,
        recordId: editId,
        data: final
      });


      setStatus((s) => ({...s,submitting: false,apiSuccess: ok}));
    } catch {
      setStatus((s) => ({ ...s, submitting: false, apiSuccess: false }));
    }
  };


  /* ----------------------------------------------
        RENDER FIELD
  ---------------------------------------------- */
  const renderField = useCallback(
    (i, f) => {
      const val = forms[i]?.[f.Name];
      const err = errorsArr[i]?.[f.Name];

      const placeholder = f.Placeholder && f.Placeholder.trim() ? f.Placeholder : `Enter ${f.Label}`;

      const config = {
        InputType: f.Type,
        Label: f.Label,
        Placeholder: placeholder,
        Options: f.options,
        Accept: f.Accept
      };

      return (
        <div>
          <FormInputTypes
            f={config}
            value={val}
            onChange={(v) => handleValue(i, f.Name, v)}
            hasError={!!err}
          />
          {err && <p className="text-red-600 text-xs mt-1">{err}</p>}
        </div>
      );
    },
    [forms, errorsArr, handleValue]
  );

  if (rulesLoading) return <Loading />;

  /* ----------------------------------------------
         MAIN UI
   ---------------------------------------------- */
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">


      {/* SUCCESS / ERROR */}
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


      {/* HEADER */}
      {/* <div className="bg-white shadow-xl rounded-2xl overflow-hidden " > */}
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center
         px-4 sm:px-6 py-3 sm:py-5 border-b  bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg mb-4">
          {/* LEFT CONTENT */}
          <div className="flex items-start gap-3">
            <AppIcon
              name={Template.Icon}
              size={24}
              className="text-white shrink-0 mt-1 sm:mt-0"
            />

            <div>
              <h2 className="text-base sm:text-xl font-semibold text-white leading-tight">
                {Template?.Name}
              </h2>
              {Template?.Description && (
                <p className="text-green-100 text-xs sm:text-sm mt-1">
                  {Template.Description}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className=" flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto ">
            <Button
              onClick={() => setIsGrouped((p) => !p)}
              className=" w-full sm:w-auto bg-green-600 text-white hover:bg-green-700
        active:bg-green-800 shadow-md hover:shadow-lg  transition-all duration-200" >
              {isGrouped ? "Ungroup" : "Group"}
            </Button>

            {AddMore && (
              <Button
                onClick={addMore}
                className="w-full sm:w-auto border border-green-200
          text-green-700 bg-white hover:bg-green-50 hover:text-green-800
          active:bg-green-100 shadow-sm transition-all duration-200 flex items-center justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Add More
              </Button>
            )}
          </div>
        </div>
        {/* </div> */}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      <Button variant="destructive" className="w-fit" size="sm" type="button" onClick={() => removeForm(i)}>
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
                              <div key={f.Name} >
                                <Label>{f.Label}</Label>
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
                      {fields.map((f) => (
                        <div key={f.Name}>
                          <Label>{f.Label}</Label>
                          {renderField(i, f)}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* FOOTER BUTTONS */}
          <Card className="flex justify-end gap-3 border border-emerald-200 p-2">
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
          </Card>
        </form>
      {/* </div> */}
    </motion.div>
  );
};

export default DynamicForm;