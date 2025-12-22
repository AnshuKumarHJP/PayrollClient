import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../Lib/card";
import { Button } from "../Lib/button";
import { Alert, AlertDescription } from "../Lib/alert";
import {
  Loader2,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";

import FileInput from "../Lib/FileInput";
import { templateService } from "../../api/services/templateService";

import {
  readExcelFile,
  validateExcelStructure,
  downloadExcelTemplate,
} from "../services/excelUtils";

// ⭐ ADD FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";

export default function BulkUpload({
  module,
  templateType,
  templateId,
  onSuccess,
  onCancel,
}) {
  const selectedClient = useSelector(
    (state) => state.GlobalStore.SelectedClient
  );

  const [template, setTemplate] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const [status, setStatus] = useState({
    loading: true,
    submitting: false,
    error: null,
    success: false,
    readingExcel: false,
  });

  const [fileInfo, setFileInfo] = useState(null);

  // ------------------ FILTER FIELDS ------------------
  const filteredFields = useMemo(() => {
    if (!template?.fields) return [];
    return template.fields.filter(
      (f) => Array.isArray(f.applicable) && f.applicable.includes("upload")
    );
  }, [template]);

  // ------------------ DUMMY DATA ------------------
  const generateDummyData = useMemo(() => {
    if (!filteredFields.length) return [];
    const dummyRows = [];
    for (let i = 1; i <= 5; i++) {
      const row = {};
      filteredFields.forEach((field) => {
        switch (field.type) {
          case "text":
          case "textarea":
            row[field.name] = `Sample ${field.label} ${i}`;
            break;
          case "number":
            row[field.name] = i * 100;
            break;
          case "email":
            row[field.name] = `test${i}@example.com`;
            break;
          case "phone":
          case "mobile":
            row[field.name] = `123456789${i}`;
            break;
          case "date":
            row[field.name] = new Date().toISOString().split("T")[0];
            break;
          case "select":
            row[field.name] = field.options?.[0] || `Option ${i}`;
            break;
          default:
            row[field.name] = `Dummy ${field.label} ${i}`;
        }
      });
      dummyRows.push(row);
    }
    return dummyRows;
  }, [filteredFields]);

  // ------------------ LOAD TEMPLATE ------------------
  useEffect(() => {
    const load = async () => {
      try {
        setStatus((p) => ({ ...p, loading: true }));

        let t;
        if (templateId) {
          t = await templateService.getById(templateId);
        } else {
          const all = await templateService.getByModule(module);
          t = all.find((x) => x.status === "active");
        }

        if (!t) throw new Error("No active template found");
        setTemplate(t);
      } catch (err) {
        setStatus((p) => ({ ...p, error: err.message }));
      } finally {
        setStatus((p) => ({ ...p, loading: false }));
      }
    };

    load();
  }, [module, templateId]);

  // ------------------ READ EXCEL ------------------
  useEffect(() => {
    if (!uploadFile || !template) return;

    const readExcel = async () => {
      setStatus((p) => ({ ...p, readingExcel: true }));

      setFileInfo({
        name: uploadFile.name,
        size: (uploadFile.size / 1024).toFixed(2) + " KB",
        lastModified: new Date(uploadFile.lastModified).toLocaleString(),
      });

      try {
        const validation = await validateExcelStructure(uploadFile, template);
        if (!validation.valid)
          return setStatus((p) => ({
            ...p,
            readingExcel: false,
            error: validation.error,
          }));

        const data = await readExcelFile(uploadFile, template);
        setExcelData(data);
      } catch {
        setStatus((p) => ({
          ...p,
          readingExcel: false,
          error: "Failed to read Excel file",
        }));
      } finally {
        setStatus((p) => ({ ...p, readingExcel: false }));
      }
    };

    readExcel();
  }, [uploadFile, template]);

  // ------------------ SUBMIT ------------------
  const handleSubmit = async () => {
    if (!uploadFile)
      return setStatus((p) => ({
        ...p,
        error: "Please upload a file",
      }));

    try {
      setStatus({
        loading: false,
        submitting: true,
        success: false,
        error: null,
      });

      const ok = await onSuccess?.({
        templateId: template.id,
        file: uploadFile,
        clientCode: selectedClient,
        excelData,
      });

      if (!ok) throw new Error();

      setStatus({
        loading: false,
        submitting: false,
        success: true,
        error: null,
      });
    } catch {
      setStatus({
        loading: false,
        submitting: false,
        success: false,
        error: "Upload failed. Try again.",
      });
    }
  };

  // ------------------ UI ------------------
  if (status.loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );

  return (
    <motion.div
      className="p-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* INSTRUCTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="mb-4 p-4 bg-emerald-50/40 border-l-4 border-emerald-400">
          <h3 className="font-semibold text-lg mb-2">
            Instructions for Bulk Upload
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Download the Excel template and fill employee details.</li>
            <li>Ensure all mandatory fields are completed.</li>
            <li>Upload Excel or show manually view.</li>
            <li>Validate before importing.</li>
          </ul>
        </Card>
      </motion.div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="shadow-lg border border-emerald-200 rounded-md bg-emerald-50/40 backdrop-blur-md">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-0">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Bulk Upload • {template?.name}
            </CardTitle>

            <motion.div whileTap={{ scale: 0.94 }}>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  downloadExcelTemplate(
                    filteredFields,
                    generateDummyData,
                    `${template.name}_template`,
                    selectedClient || "Organization"
                  )
                }
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* SUCCESS + ERROR */}
            <AnimatePresence>
              {status.success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-700" />
                    <AlertDescription className="text-green-700">
                      Upload processed successfully!
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {status.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert className="border-red-500 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-700" />
                    <AlertDescription className="text-red-700">
                      {status.error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FILE UPLOAD */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FileInput
                label={
                  <span>
                    Upload Filled Template <span className="text-red-500">*</span>
                  </span>
                }
                allowTypes={[".xlsx", ".xls", ".csv"]}
                onChangeFile={(file) => setUploadFile(file)}
              />
            </motion.div>

            {/* FILE INFO */}
            <AnimatePresence>
              {fileInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-100/60 rounded p-3 text-xs text-emerald-800"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={14} /> <strong>File Info</strong>
                  </div>
                  <p>📄 Name: {fileInfo.name}</p>
                  <p>📦 Size: {fileInfo.size}</p>
                  <p>🕒 Modified: {fileInfo.lastModified}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EXCEL SUMMARY */}
            <AnimatePresence>
              {excelData && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-semibold text-blue-800">Rows</div>
                      <div className="text-blue-600">{excelData.totalRows}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-semibold text-green-800">Valid</div>
                      <div className="text-green-600">{excelData.validRows}</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="font-semibold text-red-800">Invalid</div>
                      <div className="text-red-600">{excelData.invalidRows}</div>
                    </div>
                  </div>

                  {/* JSON TOGGLE */}
                  <div className="flex justify-end my-2">
                    <motion.div whileTap={{ scale: 0.94 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJson(!showJson)}
                      >
                        {showJson ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span className="ml-2">
                          {showJson ? "Hide JSON" : "Show JSON"}
                        </span>
                      </Button>
                    </motion.div>
                  </div>

                  {/* JSON VIEW */}
                  <AnimatePresence>
                    {showJson && (
                      <motion.pre
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-100 p-4 rounded border max-h-96 overflow-auto text-xs"
                      >
                        {JSON.stringify(excelData.rows, null, 2)}
                      </motion.pre>
                    )}
                  </AnimatePresence>

                  {/* TABLE PREVIEW */}
                  {!showJson && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <table className="w-full border text-sm rounded">
                        <thead className="bg-emerald-100 text-emerald-900">
                          <tr>
                            {filteredFields.map((field) => (
                              <th
                                key={field.name}
                                className="border px-3 py-2"
                              >
                                {field.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.rows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50">
                              {filteredFields.map((field) => (
                                <td
                                  key={field.name}
                                  className="border px-3 py-2"
                                >
                                  {row[field.name] ?? "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-3">
              <motion.div whileTap={{ scale: 0.94 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={status.submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {status.submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Start Upload
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
