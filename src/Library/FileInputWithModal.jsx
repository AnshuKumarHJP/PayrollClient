import React, { forwardRef, useState, useEffect, useRef } from "react";
import { Avatar } from "./avatar";
import { Label } from "./Label";
import AppIcon from "../Component/AppIcon";
import Modal from "../Component/Modal";
import Button from "./Button";
import ProgressCircle from "./ProgressCircle";
import { cn } from "./utils";
import { motion, AnimatePresence } from "framer-motion";
import { storeObject, convertFileToBase64 } from "../services/ObjectStorageService";
import { toast } from "./use-toast";

const FileInputWithModal = forwardRef((props, ref) => {
  const {
    label,
    error,
    mand,
    view,
    download,
    className = "",
    allowTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      "application/pdf",
      ".csv",
      ".doc",
      ".docx",
    ],
    onChangeFile,
    ...rest
  } = props;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [invalidType, setInvalidType] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [open, setOpen] = useState(false);

  // Progress states
  const [stage, setStage] = useState("idle"); // idle | processing | ready | uploading
  const [progress, setProgress] = useState(0);

  const inputId = useRef(`file-${crypto.randomUUID()}`);

  /* =========================================================
     HELPERS
  ========================================================= */

  const validateFile = (f) =>
    allowTypes.length === 0 ||
    allowTypes.some((t) =>
      t.startsWith(".")
        ? f.name.toLowerCase().endsWith(t)
        : f.type === t ||
        (t.endsWith("/*") && f.type.startsWith(t.split("/")[0]))
    );

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setIsImage(false);
    setInvalidType(false);
    setStage("idle");
    setProgress(0);
    onChangeFile?.(null);
    if (inputId.current) {
      const input = document.getElementById(inputId.current);
      if (input) input.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (!file) return "File";
    const ext = file.name.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return "FileText";
      case 'doc':
      case 'docx': return "FileType2";
      case 'xls':
      case 'xlsx':
      case 'csv': return "FileSpreadsheet";
      case 'txt': return "File";
      default: return "File";
    }
  };

  const getFileIconColor = (file) => {
    if (!file) return "text-slate-500";
    const ext = file.name.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return "text-rose-500 bg-rose-50 border-rose-100";
      case 'doc':
      case 'docx': return "text-blue-500 bg-blue-50 border-blue-100";
      case 'xls':
      case 'xlsx':
      case 'csv': return "text-emerald-500 bg-emerald-50 border-emerald-100";
      default: return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  /* =========================================================
     FILE PROCESS (ON CHOOSE)
  ========================================================= */

  const processFile = async (f) => {
    if (!f) return;

    setStage("processing");
    setProgress(0);

    let p = 0;
    const processingTimer = setInterval(() => {
      p += 10;
      setProgress(Math.min(p, 60));
    }, 80);

    await new Promise((r) => setTimeout(r, 500));
    clearInterval(processingTimer);

    const valid = validateFile(f);
    setInvalidType(!valid);

    if (!valid) {
      resetAll();
      return;
    }

    setFile(f);
    onChangeFile?.(f);

    if (f.type.startsWith("image/")) {
      setIsImage(true);
      setPreview(URL.createObjectURL(f));
    } else {
      setIsImage(false);
      setPreview(null);
    }

    setProgress(100);
    setTimeout(() => {
      setStage("ready");
      setProgress(0);
    }, 300);
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  /* =========================================================
     UPLOAD (ON CLICK)
  ========================================================= */

  const handleUpload = async () => {
    if (!file) return;

    setStage("uploading");
    setProgress(10);

    try {
      // 1. Convert to Base64
      const fileData = await convertFileToBase64(file);
      console.log("File Data:", fileData);
      setProgress(40);

      // 2. Upload to Object Storage
      const response = await storeObject(fileData);
      console.log("Upload Response:", response);

      // ✅ Guard: check if upload actually succeeded
      if (!response?.data?.Status) {
        throw new Error(response?.data?.Message || "Upload failed on server.");
      }

      setProgress(100);

      setTimeout(() => {
        setStage("idle");
        setOpen(false);
        setProgress(0);

        const resultData = {
          Result: response.data.Result,
          Status: response.data.Status,
          name: file.name,
          ...fileData,
        };

        onChangeFile?.(resultData);

        toast({
          title: "Upload Successful",
          description: "Your file has been securely uploaded.",
          variant: "success",
        });
      }, 500);

    } catch (err) {
      console.error("Upload Error:", err);
      setStage("idle");
      setProgress(0);

      toast({
        title: "Upload Failed",
        // ✅ handle both string rejections and Error objects
        description: typeof err === "string" ? err : err?.message || "Something went wrong during upload.",
        variant: "destructive",
      });
    }
  };

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleView = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className={cn("w-full mb-5", className)}>
      {/* {label && (
        <Label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
          {label} {mand && <span className="text-rose-500">*</span>}
        </Label>
      )} */}

      {/* Trigger Area */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex items-center justify-between p-3 bg-white dark:bg-slate-800 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300",
          error
            ? "border-rose-300 bg-rose-50/30"
            : file
              ? "border-indigo-400/50 bg-indigo-50/10 hover:border-indigo-500"
              : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            file ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
          )}>
            <AppIcon name={file ? "FileCheck" : "UploadCloud"} size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn(
              "text-sm font-semibold truncate transition-colors",
              file ? "text-indigo-900 dark:text-indigo-100" : "text-slate-600 dark:text-slate-400"
            )}>
              {file ? file.name : "Select a file to upload"}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {file ? formatFileSize(file.size) : `Supports ${allowTypes.length > 3 ? 'various formats' : allowTypes.join(', ')}`}
            </span>
          </div>
        </div>

        <div className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
          file
            ? "bg-indigo-100 text-indigo-700"
            : "bg-slate-100 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/20"
        )}>
          {file ? "Change" : "Browse"}
        </div>
      </motion.div>

      {error && (
        <span className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
          <AppIcon name="AlertCircle" size={12} />
          {typeof error === 'string' ? error : 'Required field'}
        </span>
      )}

      {/* Modern Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        Header={() => (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center
         px-4 sm:px-6 py-2 sm:py-3 ">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
            <div className="relative z-10 flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-sm">
                <AppIcon name="CloudUpload" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">Upload Document</h3>
                <p className="text-indigo-100 text-xs font-medium opacity-90">Secure file transfer</p>
              </div>
            </div>
          </div>

        )}
        Body={() => (
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 min-h-[320px]">
            <input
              id={inputId.current}
              ref={ref}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              {...rest}
            />

            {!file && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  processFile(e.dataTransfer.files?.[0]);
                }}
                onClick={() => document.getElementById(inputId.current).click()}
                className={cn(
                  "h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 gap-4 group",
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5"
                )}
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                  <AppIcon name="UploadCloud" size={32} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">
                    Supports: {allowTypes.join(", ").replace(/\./g, "").toUpperCase()}
                  </p>
                </div>
              </div>
            )}

            {file && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  {/* Preview Header */}
                  <div className="flex items-start gap-4 p-4">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center border shadow-sm",
                      getFileIconColor(file)
                    )}>
                      {isImage && preview ? (
                        <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <AppIcon name={getFileIcon(file)} size={28} strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{file.name}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{formatFileSize(file.size)} • {isImage ? 'Image' : 'Document'}</p>

                      {/* Progress Bar */}
                      {(stage === "processing" || stage === "uploading") && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>{stage === "processing" ? "Scanning..." : "Uploading..."}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ ease: "linear" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  {stage !== "processing" && stage !== "uploading" && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                      {view && (
                        <button onClick={handleView} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="Preview">
                          <AppIcon name="Eye" size={16} />
                        </button>
                      )}
                      {download && (
                        <button onClick={handleDownload} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="Download">
                          <AppIcon name="Download" size={16} />
                        </button>
                      )}
                      <button onClick={resetAll} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="Remove">
                        <AppIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Validation Status & File Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                      <AppIcon name="Check" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Format Valid</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400/80">Extension supported</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                      <AppIcon name="Shield" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-800 dark:text-blue-300">Secure File</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400/80">Ready for encryption</p>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">File Information</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Name:</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate text-xs" title={file.name}>{file.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Size:</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">{formatFileSize(file.size)}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Type:</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate" title={file.type}>{file.type || 'Unknown'}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">Modified:</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">{file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {(error || invalidType) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3"
                >
                  <AppIcon name="AlertTriangle" size={16} className="text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold text-rose-700">Upload Issue</h5>
                    <p className="text-xs text-rose-600 mt-0.5">
                      {invalidType ? `Invalid file type. Supported: ${allowTypes.join(", ")}` : error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Guide / Tips */}
            {!file && !error && !invalidType && (
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                    <AppIcon name="Lightbulb" size={14} />
                  </div>
                  <h6 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quick Guide</h6>
                </div>
                <ul className="space-y-1.5 pl-1">
                  <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>Review your file content before uploading to avoid errors.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span>Ensure the file format matches one of the allowed types listed above.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        Footer={() => (
          <div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <Button
              size="sm"
              type="button"
              disabled={!file || stage === "uploading" || stage === "processing"}
              onClick={handleUpload}
              className="shadow-lg shadow-indigo-500/20"
            >
              {stage === "uploading" ? (
                <span className="flex items-center gap-2">
                  <AppIcon name="Loader2" size={16} className="animate-spin" /> Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Confirm Upload <AppIcon name="ArrowRight" size={16} />
                </span>
              )}
            </Button>
          </div>
        )}
      />
    </div>
  );
});

FileInputWithModal.displayName = "FileInputWithModal";
export default FileInputWithModal;
