
/* =========================================================
   BulkUpload.jsx  (FULL – LIVE ROW VALIDATION)
========================================================= */
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent } from "../../Lib/card";
import { Button } from "../../Lib/button";
import { Alert, AlertDescription } from "../../Lib/alert";

import FileInput from "../../Lib/FileInput";
import AppIcon from "../../Component/AppIcon";

import {
  readExcelFile,
  validateExcelStructure,
  downloadExcelTemplate,
} from "../../services/excelUtils";

import useValidationRules from "../../Hooks/useValidationRules";
import { motion, AnimatePresence } from "framer-motion";
import BulkUploadTable from "./BulkUploadTable";

export default function BulkUpload({ Template, onSuccess, onCancel }) {
  const selectedClient = useSelector((state) => state.Auth?.Common?.SelectedClient || "");

  const { validate, loading: rulesLoading } = useValidationRules(Template);

  const [uploadFile, setUploadFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | reading | ready | error | submitting | success
  const [errorDetails, setErrorDetails] = useState(null);

  /* ---------------- PARSE FIELDS ---------------- */
  const fields = useMemo(() => {
    if (!Template?.FieldsConfigurations) return [];
    return Template.FieldsConfigurations
      .map((f) => {
        let applicable = [];
        let options = [];
        try { applicable = JSON.parse(f.ApplicableJson || "[]"); } catch {}
        try { options = JSON.parse(f.OptionsJson || "[]"); } catch {}
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

  /* ---------------- READ EXCEL ---------------- */
  useEffect(() => {
    if (!uploadFile || !Template || rulesLoading) return;

    let cancelled = false;

    const run = async () => {
      setPhase("reading");
      setErrorDetails(null);

      setFileInfo({
        name: uploadFile.name,
        size: (uploadFile.size / 1024).toFixed(2) + " KB",
        lastModified: new Date(uploadFile.lastModified).toLocaleString(),
      });

      try {
        const structure = await validateExcelStructure(uploadFile, { fields });
        if (!structure.valid) {
          setPhase("error");
          setErrorDetails({
            title: "Invalid Excel Structure",
            messages: [structure.error],
          });
          return;
        }

        const data = await readExcelFile(uploadFile, { fields });
        if (cancelled) return;

        const errors = [];

        for (let i = 0; i < data.rows.length; i++) {
          const res = await validate(data.rows[i], { context: "bulk_upload" });
          if (!res.valid) {
            Object.entries(res.errors).forEach(([field, message]) => {
              errors.push({
                row: i + 1,
                field,
                message,
              });
            });
          }
        }

        setExcelData({
          ...data,
          errors,
        });

        if (errors.length) {
          setPhase("error");
          setErrorDetails({
            title: "Validation Failed",
            messages: ["Fix highlighted errors below"],
          });
        } else {
          setPhase("ready");
        }
      } catch {
        setPhase("error");
        setErrorDetails({
          title: "Processing Error",
          messages: ["Failed to read Excel file"],
        });
      }
    };

    run();
    return () => (cancelled = true);
  }, [uploadFile, Template, fields, validate, rulesLoading]);

  /* ---------------- LIVE ROW VALIDATION ---------------- */
  const validateRow = useCallback(
    async (rowIndex, updatedRow) => {
      const result = await validate(updatedRow, { context: "bulk_upload" });

      setExcelData((prev) => {
        if (!prev) return prev;

        const remaining = (prev.errors || []).filter(
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

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!excelData || excelData.errors.length) return;

    setPhase("submitting");
    const ok = await onSuccess?.({
      templateId: Template?.Id,
      file: uploadFile,
      excelData,
      clientCode: selectedClient,
    });

    setPhase(ok ? "success" : "error");
  };

  /* ---------------- UI ---------------- */
  return (
    <motion.div className="p-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="mb-4 p-4 bg-emerald-50/40 border-l-4 border-emerald-400">
        <h3 className="font-semibold text-md mb-2">Bulk Upload Instructions</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Download the template</li>
          <li>Fill mandatory fields</li>
          <li>Fix errors inline</li>
        </ul>
      </Card>

      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg px-6 py-4 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-white">
          <AppIcon name="FileSpreadsheet" size={22} />
          <div>
            <h2 className="text-lg font-semibold">
              Bulk Upload · {Template?.Name}
            </h2>
            <p className="text-xs opacity-90">{Template?.Description}</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="bg-white"
          onClick={() =>
            downloadExcelTemplate(
              fields,
              [],
              `${Template?.Name}_template`,
              selectedClient || "ORG"
            )
          }
        >
          <AppIcon name="Download" className="mr-2" />
          Download Template
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {errorDetails && (
              <Alert className="border-red-500 bg-red-50">
                <AlertDescription>
                  <strong>{errorDetails.title}</strong>
                  {errorDetails.messages?.map((m, i) => (
                    <div key={i}>{m}</div>
                  ))}
                </AlertDescription>
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

          {excelData && (
            <BulkUploadTable
              column={fields}
              data={excelData.rows}
              errors={excelData.errors}
              onValidateRow={validateRow}
              disabled = {false}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            <Button
              disabled={phase !== "ready"}
              onClick={handleSubmit}
              className="bg-emerald-600 text-white"
            >
              {phase === "submitting" ? "Uploading…" : "Start Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
