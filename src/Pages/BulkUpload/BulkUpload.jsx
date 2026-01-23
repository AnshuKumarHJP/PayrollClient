/* =========================================================
   BulkUpload.jsx
   PRODUCTION-READY • STABLE • MODERN UX
   ✔ Visible progress (reading + submitting)
   ✔ Smooth animation
   ✔ Safe async handling
   ✔ No flicker / no hidden state
========================================================= */

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "../../Library/Card";
import { Button } from "../../Library/Button";
import { Alert } from "../../Library/Alert";
import { Progress } from "../../Library/progress";
import FileInput from "../../Library/FileInput";
import AppIcon from "../../Component/AppIcon";

import {
  readExcelFile,
  validateExcelStructure,
  downloadExcelTemplate,
} from "../../services/excelUtils";

import useValidationRules from "../../Hooks/useValidationRules";
import BulkUploadTable from "./BulkUploadTable";

/* ---------------------------------------------------------
   Small async delay to allow React repaint (UX polish)
--------------------------------------------------------- */
const wait = (ms = 120) => new Promise((res) => setTimeout(res, ms));

export default function BulkUpload({ Template, onSuccess, onCancel }) {
  const selectedClient = useSelector(
    (state) => state.Auth?.Common?.SelectedClient || ""
  );

  const { validate, loading: rulesLoading } = useValidationRules(Template);

  const [uploadFile, setUploadFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const [phase, setPhase] = useState("idle");
  // idle | reading | ready | error | submitting | success

  const [errorDetails, setErrorDetails] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* =========================================================
     FIELD METADATA (UPLOAD ONLY)
  ========================================================= */
  const fields = useMemo(() => {
    if (!Template?.FieldsConfigurations) return [];

    return Template.FieldsConfigurations
      .map((f) => {
        let applicable = [];
        let options = [];
        try {
          applicable = JSON.parse(f.ApplicableJson || "[]");
        } catch {}
        try {
          options = JSON.parse(f.OptionsJson || "[]");
        } catch {}

        return {
          ...f,
          name: f.Name,
          label: f.Label,
          type: f.Type,
          applicable,
          options,
        };
      })
      .filter((f) => f.applicable.includes("upload"));
  }, [Template]);

  /* =========================================================
     READ + VALIDATE EXCEL
  ========================================================= */
  useEffect(() => {
    if (!uploadFile || !Template || rulesLoading) return;

    let cancelled = false;

    const run = async () => {
      try {
        setPhase("reading");
        setErrorDetails(null);
        setUploadProgress(0);

        setFileInfo({
          name: uploadFile.name,
          size: (uploadFile.size / 1024).toFixed(2) + " KB",
          lastModified: new Date(uploadFile.lastModified).toLocaleString(),
        });

        /* -------- Step 1: Structure validation -------- */
        setUploadProgress(10);
        await wait();

        const structure = await validateExcelStructure(uploadFile, { fields });
        if (!structure.valid) {
          setPhase("error");
          setErrorDetails({
            title: "Invalid Excel Structure",
            messages: [structure.error],
          });
          return;
        }

        setUploadProgress(30);
        await wait();

        /* -------- Step 2: Read Excel -------- */
        const data = await readExcelFile(uploadFile, { fields });
        if (cancelled) return;

        setUploadProgress(60);
        await wait();

        /* -------- Step 3: Row validation -------- */
        const errors = [];
        const total = data.rows.length || 1;

        for (let i = 0; i < total; i++) {
          const res = await validate(data.rows[i], {
            context: "bulk_upload",
          });

          if (!res.valid) {
            Object.entries(res.errors).forEach(([field, message]) => {
              errors.push({
                row: i + 1,
                field,
                message,
              });
            });
          }

          setUploadProgress(60 + Math.floor((i / total) * 30));
          await wait(40);
        }

        setExcelData({ ...data, errors });
        setUploadProgress(100);
        await wait(200);

        if (errors.length) {
          setPhase("error");
          setErrorDetails({
            title: "Validation Failed",
            messages: ["Fix highlighted errors below"],
          });
        } else {
          setPhase("ready");
        }
      } catch (err) {
        setPhase("error");
        setErrorDetails({
          title: "Processing Error",
          messages: ["Failed to read Excel file"],
        });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [uploadFile, Template, fields, validate, rulesLoading]);

  /* =========================================================
     LIVE ROW VALIDATION
  ========================================================= */
  const validateRow = useCallback(
    async (rowIndex, updatedRow) => {
      const result = await validate(updatedRow, {
        context: "bulk_upload",
      });

      setExcelData((prev) => {
        if (!prev) return prev;

        const remaining = prev.errors.filter(
          (e) => e.row !== rowIndex + 1
        );

        const newErrors = result.valid
          ? []
          : Object.entries(result.errors).map(([field, message]) => ({
              row: rowIndex + 1,
              field,
              message,
            }));

        const mergedErrors = [...remaining, ...newErrors];
        setPhase(mergedErrors.length ? "error" : "ready");

        return {
          ...prev,
          rows: prev.rows.map((r, i) =>
            i === rowIndex ? updatedRow : r
          ),
          errors: mergedErrors,
        };
      });
    },
    [validate]
  );

  /* =========================================================
     SUBMIT
  ========================================================= */
  const handleSubmit = async () => {
    if (!excelData || excelData.errors.length) return;

    setPhase("submitting");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((p) => (p >= 90 ? 90 : p + 10));
    }, 200);

    const ok = await onSuccess?.({
      templateId: Template?.Id,
      file: uploadFile,
      excelData,
      clientCode: selectedClient,
    });

    clearInterval(interval);
    setUploadProgress(100);
    await wait(300);

    setPhase(ok ? "success" : "error");
  };

  /* =========================================================
     RESET
  ========================================================= */
  const handleCancel = () => {
    setUploadFile(null);
    setExcelData(null);
    setFileInfo(null);
    setPhase("idle");
    setErrorDetails(null);
    setUploadProgress(0);
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-lg px-6 py-3 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-white">
          <AppIcon name="FileSpreadsheet" size={22} />
          <div>
            <h2 className="text-lg font-semibold">
              Bulk Upload · {Template?.Name}
            </h2>
            <p className="text-xs opacity-90">
              {Template?.Description}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<AppIcon name="Download" />}
          onClick={() =>
            downloadExcelTemplate(
              fields,
              [],
              `${Template?.Name}_template`,
              selectedClient || "ORG"
            )
          }
        >
          Download Template
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {errorDetails && (
              <Alert variant="danger" icon={true} className="border-red-500 bg-red-50">
                  <strong>{errorDetails.title}</strong>
                  {errorDetails.messages?.map((m, i) => (
                    <div key={i}>{m}</div>
                  ))}
              </Alert>
            )}
          </AnimatePresence>

          {!uploadFile && (
            <FileInput
              label="Upload Filled Template *"
              allowTypes={[".xlsx", ".xls", ".csv"]}
              onChangeFile={setUploadFile}
            />
          )}

         

          {/* PROGRESS (READING + SUBMITTING) */}
          {["reading", "submitting"].includes(phase) && (
            <Progress
              value={uploadProgress}
              variant={phase === "submitting" ? "info" : "default"}
              label="Uploading your records"
            />
          )}

           {excelData && (
            <BulkUploadTable
              column={fields}
              data={excelData.rows}
              errors={excelData.errors}
              onValidateRow={validateRow}
              // disabled={phase === "submitting"}
              disabled={true}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCancel}>
              Clear
            </Button>

            <Button variant="danger" onClick={onCancel}>
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={phase !== "ready"}
              onClick={handleSubmit}
            >
              {phase === "submitting" ? "Uploading…" : "Start Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
