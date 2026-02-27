
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "../../Library/Card";
import { Button } from "../../Library/Button";
import { Alert } from "../../Library/Alert";
import ProgressCircle from "../../Library/ProgressCircle";
import FileInput from "../../Library/FileInput";
import AppIcon from "../../Component/AppIcon";

import {
  readExcelFile,
  validateExcelStructure,
  downloadExcelTemplate,
} from "../../services/excelUtils";

import useValidationRules from "../../Hooks/useValidationRules";
import BulkUploadTable from "./BulkUploadTable";

/* --------------------------------------------------------- */
const wait = (ms = 120) => new Promise((res) => setTimeout(res, ms));

export default function BulkUpload({ Template, onSuccess, onCancel }) {
  const selectedClient = useSelector(
    (state) => state.Auth?.Common?.SelectedClientCode || ""
  );

  const { validate, loading: rulesLoading } = useValidationRules(Template);
  const [uploadFile, setUploadFile] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const [phase, setPhase] = useState("idle");
  const [errorDetails, setErrorDetails] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /* =========================================================
     FIELD METADATA
  ========================================================= */
  const fields = useMemo(() => {
    if (!Template?.FieldsConfigurations) return [];

    return Template.FieldsConfigurations
      .map((f) => {
        let ApplicableJson = [];
        let options = [];
        try {
          ApplicableJson = JSON.parse(f.ApplicableJson || "[]");
        } catch { }
        try {
          options = JSON.parse(f.OptionsJson || "[]");
        } catch { }

        return {
          ...f,
          name: f.Name,
          label: f.Label,
          type: f.Type,
          ApplicableJson,
          options,
        };
      })
      .filter((f) => f.ApplicableJson.includes("upload"));
  }, [Template]);

  /* =========================================================
     READ + INITIAL VALIDATION
  ========================================================= */
  useEffect(() => {
    if (!uploadFile || !Template || rulesLoading) return;

    let cancelled = false;

    const run = async () => {
      try {
        setPhase("reading");
        setErrorDetails(null);
        setUploadProgress(0);

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

        const data = await readExcelFile(uploadFile, { fields });
        if (cancelled) return;

        setUploadProgress(60);
        await wait();

        const errors = [];
        const total = data.rows.length || 1;

        if (Template?.ClientServiceType === 1) {
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
          }
        }

        setExcelData({ ...data, errors });
        setUploadProgress(100);
        await wait(200);
        console.log("errors", errors);

        if (errors.length) {
          setPhase("error");
          setErrorDetails({
            title: "Validation Failed",
            messages: ["Fix highlighted errors below"],
          });
        } else {
          setPhase("ready");
          setErrorDetails(null);
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
    return () => {
      cancelled = true;
    };
  }, [uploadFile, Template, fields, validate, rulesLoading]);

  /* =========================================================
     LIVE ROW VALIDATION (🔥 FIX)
  ========================================================= */
  const validateRow = useCallback(
    async (rowIndex, updatedRow) => {
      const res = await validate(updatedRow, {
        context: "bulk_upload",
      });

      setExcelData((prev) => {
        if (!prev) return prev;

        const remainingErrors = prev.errors.filter(
          (e) => e.row !== rowIndex + 1
        );

        const newErrors = res.valid
          ? []
          : Object.entries(res.errors).map(([field, message]) => ({
            row: rowIndex + 1,
            field,
            message,
          }));

        const mergedErrors = [...remainingErrors, ...newErrors];

        /* 🔥 GLOBAL STATE DERIVED FROM ERRORS */
        if (mergedErrors.length === 0) {
          setPhase("ready");
          setErrorDetails(null); // ✅ HIDE TOP BANNER
        } else {
          setPhase("error");
          setErrorDetails({
            title: "Validation Failed",
            messages: ["Fix highlighted errors below"],
          });
        }

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
  console.log("Template", Template);
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

    // Ensure minimum progress visibility (1 second)
    await wait(1000);

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
    setPhase("idle");
    setErrorDetails(null);
    setUploadProgress(0);
  };

  return (
    <>
      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-gradient-to-r from-primary-700 to-indigo-600 rounded-sm px-4 py-3 md:flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <AppIcon name="FileSpreadsheet" size={22} />
            <div>
              <h2 className="text-sm md:text-lg font-semibold">
                Bulk Upload · {Template?.Name}
              </h2>
              <p className="text-xs opacity-90">{Template?.Description}</p>
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

        <AnimatePresence>
          {errorDetails && (
            <Alert variant="danger" icon>
              <strong>{errorDetails.title}</strong>
              {errorDetails.messages?.map((m, i) => (
                <div key={i}>{m}</div>
              ))}
            </Alert>
          )}
        </AnimatePresence>

        {!uploadFile && (
          <FileInput
            label="Upload Filled Template"
            allowTypes={[".xlsx", ".xls", ".csv"]}
            onChangeFile={setUploadFile}
            mand
          />
        )}

        {excelData && Template?.ClientServiceType === 1 ? (
          <BulkUploadTable
            column={fields}
            data={excelData.rows}
            errors={excelData.errors}
            onValidateRow={validateRow}
            disabled={phase === "submitting"}
          />
        ) : (
          uploadFile && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm ring-1 ring-slate-900/5 overflow-hidden transition-all hover:shadow-md relative group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>

              <div className="flex flex-col md:flex-row">
                {/* Left: File Identity */}
                <div className="p-5 flex items-start gap-5 flex-1">
                  <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100/50 shadow-sm">
                    <AppIcon name="FileSpreadsheet" size={30} />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <h4 className="text-base font-bold text-slate-800 truncate mb-1.5 leading-tight" title={uploadFile.name}>{uploadFile.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <AppIcon name="HardDrive" size={14} className="text-slate-400" />
                        {(uploadFile.size / 1024).toFixed(2)} KB
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1.5 uppercase">
                        <AppIcon name="File" size={14} className="text-slate-400" />
                        {uploadFile.name.split('.').pop()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="flex items-center gap-1.5">
                        <AppIcon name="Calendar" size={14} className="text-slate-400" />
                        {new Date(uploadFile.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Data metrics & Actions */}
                <div className="bg-slate-50/80 p-5 flex items-center justify-between gap-8 border-t md:border-t-0 md:border-l border-slate-100 min-w-[320px]">
                  <div className="grid grid-cols-2 gap-x-8">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Records</span>
                      <span className="text-xl font-bold text-slate-700 block leading-none">{excelData?.rows?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Columns</span>
                      <span className="text-xl font-bold text-slate-700 block leading-none">{excelData?.rows?.[0] ? Object.keys(excelData.rows[0]).length : 0}</span>
                    </div>
                  </div>

                  <div className="pl-6 border-l border-slate-200 flex flex-col items-center gap-3">
                    <div className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                      Ready
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Remove File"
                    >
                      <AppIcon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={handleCancel}>
            Clear
          </Button>
          <Button variant="danger" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" disabled={phase !== "ready"} onClick={handleSubmit}>
            Start Upload
          </Button>
        </div>
      </motion.div>

      <ProgressCircle
        open={["reading", "submitting"].includes(phase)}
        progress={uploadProgress}
        title={phase === "reading" ? "Reading Excel File" : "Uploading Employee Data"}
        subtitle={phase === "reading" ? "Validating file structure" : "Validating & uploading records"}
      />
    </>
  );
}
