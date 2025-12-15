import React, { forwardRef, useState, useEffect } from "react";
import {Avatar} from "../Lib/avatar";
import { CloudUpload, Download } from "lucide-react";

const FileInput = forwardRef((props, ref) => {
  const {
    label,
    error,
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
    view = false,
    download = false,
    onChangeFile,
    ...rest
  } = props;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [invalidType, setInvalidType] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputId = `file-input-${Math.random().toString(36).slice(2)}`;

  // ✅ Validate and handle file selection
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    const valid =
      allowTypes.length === 0 ||
      allowTypes.some((type) =>
        type.startsWith(".")
          ? selectedFile.name.endsWith(type)
          : selectedFile.type === type ||
            (type.endsWith("/*") &&
              selectedFile.type.startsWith(type.split("/")[0]))
      );

    setInvalidType(!valid);

    if (!valid) {
      setFile(null);
      setPreview(null);
      onChangeFile?.(null);
      return;
    }

    setFile(selectedFile);
    onChangeFile?.(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setIsImage(true);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setIsImage(false);
      setPreview(null);
    }
  };

  // ✅ Input file change handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  // ✅ Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  // ✅ Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className={`w-full my-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
        </label>
      )}

      {/* Hidden Input */}
      <input
        id={inputId}
        type="file"
        ref={ref}
        className="hidden"
        onChange={handleFileChange}
        {...rest}
      />

      {/* 🔹 Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId).click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-emerald-500 bg-emerald-50 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-600"
        }`}
      >
        <CloudUpload  className="text-gray-500 dark:text-gray-300 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Drag and drop your file here, or <span className="font-semibold">click to upload</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Allowed: {allowTypes.join(", ")}
        </p>
      </div>

      {/* 🔹 File Info / Preview */}
      <div className="mt-4">
        {file &&
          (isImage ? (
            <div className="flex flex-col items-start space-y-2">
              <Avatar src={preview || ""} size={160} />
              <span className="text-sm text-gray-600 dark:text-gray-200 font-medium">
                {file.name}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 p-1">
              {view && (
                <span
                  onClick={() => {
                    console.log("File details:", file);
                  }}
                  className="text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-pointer"
                >
                  View 👁️
                </span>
              )}
              {download && (
                <span
                  onClick={() => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-pointer flex gap-1 items-center"
                >
                  Download <Download size={18} />
                </span>
              )}

              <span className="text-sm text-gray-700 dark:text-gray-200">
                📁 {file.name.split(".").pop()?.toUpperCase() || "FILE"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 underline">
                {file.name}
              </span>
            </div>
          ))}
      </div>

      {/* 🔹 Error */}
      {(error || invalidType) && (
        <p className="text-red-500 text-sm mt-2">
          {invalidType
            ? `This file type is not allowed. Allowed: ${allowTypes.join(", ")}`
            : "Please select a valid file."}
        </p>
      )}
    </div>
  );
});

FileInput.displayName = "FileInput";
export default FileInput;
